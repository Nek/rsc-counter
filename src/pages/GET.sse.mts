import { registerClient, unregisterClient } from "../lib/sse";

export default async function GetSSE({ request, response }) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      registerClient(controller);

      request.signal.addEventListener("abort", () => {
        unregisterClient(controller);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}