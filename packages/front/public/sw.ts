const SseHeaders: HeadersInit = {
  "content-type": "text/event-stream",
  "Transfer-Encoding": "chunked",
  Connection: "keep-alive",
};

const eventSourceMap = new Map<string, EventSource>();

const getEventSourceMap = (url: string) => {
  if (!eventSourceMap.has(url)) {
    eventSourceMap.set(url, new EventSource(url));
  }

  return eventSourceMap.get(url)!;
};

const handleEventSourceMessage = (
  controller: ReadableStreamDefaultController,
  { data, type, lastEventId }: MessageEvent
) => {
  const responseText = sseChunkData(data, type, lastEventId);
  const responseData = Uint8Array.from(responseText, (x) => x.charCodeAt(0));
  try {
    controller.enqueue(responseData);
  } catch (e) {
    // SSE가 retry 될 때 stream이 유효하지 않아서 에러가 발생
    // 어떡할지 모르겠음.
  }
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

  const stream = new ReadableStream({
    start: (controller) =>
      getEventSourceMap(url).addEventListener("message", (event) => {
        handleEventSourceMessage(controller, event);
      }),
  });

  const response = new Response(stream, { headers: SseHeaders });

  fetchEvent.respondWith(response);
});

// declare by https://developers.cloudflare.com/workers/runtime-apis/fetch-event/#passthroughonexception
interface FetchEvent extends Event {
  type: string;
  request: Request;
  respondWith: <T = unknown>(response: Response | Promise<T>) => void;
  waitUntil: <T = unknown>(promise: Promise<T>) => void;
  passThroughOnException: () => void;
}
