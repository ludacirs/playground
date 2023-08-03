const SseHeaders: HeadersInit = {
  "content-type": "text/event-stream",
  "Transfer-Encoding": "chunked",
  Connection: "keep-alive",
};

// declare by https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#passthroughonexception
interface FetchEvent extends Event {
  type: string;
  request: Request;
  respondWith: <T = unknown>(response: Response | Promise<T>) => void;
  waitUntil: <T = unknown>(promise: Promise<T>) => void;
  passThroughOnException: () => void;
}

const onServerSentEventMessage = (
  controller: ReadableStreamDefaultController,
  { data, type, lastEventId }: MessageEvent
) => {
  const responseText = sseChunkData(data, type, lastEventId);
  const responseData = Uint8Array.from(responseText, (x) => x.charCodeAt(0));
  controller.enqueue(responseData);
};

const sseChunkData = (data: any, type: string, id: string) =>
  Object.entries({ type, id, data })
    .filter(([, value]) => ![undefined, null].includes(value))
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n") + "\n\n";

self.addEventListener("fetch", (event) => {
  const fetchEvent = event as unknown as FetchEvent;
  const { headers, url } = fetchEvent.request;
  const isSSERequest = headers.get("Accept") === "text/event-stream";

  if (!isSSERequest) {
    return;
  }

  const serverConnections: Record<string, EventSource> = {};
  const getServerConnection = (url: string) => {
    if (!serverConnections[url]) {
      serverConnections[url] = new EventSource(url);
    }

    return serverConnections[url];
  };

  const stream = new ReadableStream({
    start: (controller) =>
      (getServerConnection(url).onmessage = (e) =>
        onServerSentEventMessage(controller, e)),
  });

  const response = new Response(stream, { headers: SseHeaders });

  fetchEvent.respondWith(response);
});
