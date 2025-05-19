import { cookie } from "@lazarv/react-server";
import { registerClient, unregisterClient } from "~/lib/sse";

export default async function GetSSE({ request }: { request: Request }) {
  const cookies = cookie();
  const id = cookies.session as string;

  if (!id) {
    return new Response("Not found", { status: 404 });
  }

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
