"use client";

import { useEffect, useMemo, useState } from "react";

export default function Counter({
  increment,
  sessionId,
  initialCount,
}: {
  increment: (id: string) => void;
  sessionId: string;
  initialCount: number;
}) {
  const [data, setData] = useState({ count: initialCount });
  const clientId = useMemo(() => crypto.randomUUID(), []);
  useEffect(() => {
    const eventSource = new EventSource(`/sse?clientId=${clientId}`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("event", data);
      setData(data);
    };
    return () => eventSource.close();
  }, [clientId]);

  return (
    <div>
      <p>Count: {data.count}</p>
      <button
        onClick={() => {
          console.log("incrementing", sessionId, "from", clientId);
          increment(sessionId);
        }}
      >
        Increment
      </button>
    </div>
  );
}
