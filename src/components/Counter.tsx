"use client";

import { useEffect, useState } from "react";

export default function Counter({
  count,
  increment,
  id,
}: {
  count: number;
  increment: (id: string) => void;
  id: string;
}) {
  const [data, setData] = useState({ count });

  useEffect(() => {
    const eventSource = new EventSource("/sse");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("event", data);
      setData(data);
    };
    return () => eventSource.close();
  }, []);

  return (
    <div>
      <p>Count: {data.count}</p>
      <button onClick={() => setData(increment(id))}>Increment</button>
    </div>
  );
}
