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
      subscribe(channelId, clientId, controller);

      request.signal.addEventListener("abort", () => {
        unsubscribe(channelId, clientId);
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
