var SseHeaders = {
  "content-type": "text/event-stream",
  "Transfer-Encoding": "chunked",
  Connection: "keep-alive",
};
var eventSourceMap = new Map();
var getEventSourceMap = function (url) {
  if (!eventSourceMap.has(url)) {
    eventSourceMap.set(url, new EventSource(url));
  }
  return eventSourceMap.get(url);
};
var handleEventSourceMessage = function (controller, _a) {
  var data = _a.data,
    type = _a.type,
    lastEventId = _a.lastEventId;
  var responseText = sseChunkData(data, type, lastEventId);
  var responseData = Uint8Array.from(responseText, function (x) {
    return x.charCodeAt(0);
  });
  try {
    controller.enqueue(responseData);
  } catch (e) {
    // SSE가 retry 될 때 stream이 유효하지 않아서 에러가 발생
    // 어떡할지 모르겠음.
  }
};
var sseChunkData = function (data, type, id) {
  return (
    Object.entries({ type: type, id: id, data: data })
      .filter(function (_a) {
        var value = _a[1];
        return ![undefined, null].includes(value);
      })
      .map(function (_a) {
        var key = _a[0],
          value = _a[1];
        return "".concat(key, ": ").concat(value);
      })
      .join("\n") + "\n\n"
  );
};
self.addEventListener("fetch", function (event) {
  var fetchEvent = event;
  console.log("event", event);
  var _a = fetchEvent.request,
    headers = _a.headers,
    url = _a.url;
  var isSSERequest = headers.get("Accept") === "text/event-stream";
  if (!isSSERequest) {
    return;
  }
  var stream = new ReadableStream({
    start: function (controller) {
      return getEventSourceMap(url).addEventListener(
        "message",
        function (event) {
          handleEventSourceMessage(controller, event);
        }
      );
    },
  });
  var response = new Response(stream, { headers: SseHeaders });
  fetchEvent.respondWith(response);
});
