"use client";

import { useEffect, useState } from "react";

export default function Counter({
  count,
  increment,
}: {
  count: number;
  increment: () => void;
}) {
  const [data, setData] = useState({ count });

  useEffect(() => {
    const eventSource = new EventSource("/sse");
    eventSource.onmessage = (event) => {
      console.log("event", event);
      setData(JSON.parse(event.data));
    };
    return () => eventSource.close();
  }, []);

  return (
    <div>
      <p>Count: {data.count}</p>
      <button onClick={() => increment()}>Increment</button>
    </div>
  );
}
