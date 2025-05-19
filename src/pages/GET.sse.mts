import { registerClient, unregisterClient } from "../lib/sse";
import { cookie } from "@lazarv/react-server";

export default async function GetSSE({ request, response }) {
  const encoder = new TextEncoder();
  const cookies = cookie();
  console.log("cks", cookies);
  const id = cookies.session || crypto.randomUUID();

  const stream = new ReadableStream({
    start(controller) {
      registerClient(id, controller);

      request.signal.addEventListener("abort", () => {
        unregisterClient(id);
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