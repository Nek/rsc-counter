import { useSearchParams } from "@lazarv/react-server";
import { subscribe, unsubscribe } from "~/lib/pubsub";

export default async function GetEvents({ request }: { request: Request }) {
  const channelId = useSearchParams().channelId as string;
  const clientId = useSearchParams().clientId as string;

  if (!channelId || !clientId) {
    return new Response("Not found", { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Subscribe with cleanup
      subscribe(channelId, clientId, controller, request.signal);

      // Extra safety: timeout or heartbeat
      const ping = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": ping\n\n"));
        } catch {
          unsubscribe(channelId, clientId);
          controller.close();
          clearInterval(ping);
        }
      }, 15000); // send comment every 15s

      request.signal.addEventListener("abort", () => {
        unsubscribe(channelId, clientId);
        controller.close();
        clearInterval(ping);
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
