import { useEffect, useMemo, useState } from "react";

export function usePubSub(channelId: string) {
  const clientId = useMemo(() => crypto.randomUUID(), []);
  const [event, setEvent] = useState<any>(null);
  useEffect(() => {
    const eventSource = new EventSource(
      `/events?channelId=${channelId}&clientId=${clientId}`
    );
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEvent(data);
    };
    return () => eventSource.close();
  }, [clientId]);
  return event;
}
