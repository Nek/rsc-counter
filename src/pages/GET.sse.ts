import { cookie, useSearchParams } from "@lazarv/react-server";
import { registerClient, unregisterClient } from "~/lib/sse";

export default async function GetSSE({ request }: { request: Request }) {
  const cookies = cookie();
  const sessionId = cookies.session as string;

  const clientId = useSearchParams().clientId;

  if (!sessionId || !clientId) {
    return new Response("Not found", { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      registerClient(sessionId, clientId, controller);

      request.signal.addEventListener("abort", () => {
        unregisterClient(sessionId, clientId);
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
