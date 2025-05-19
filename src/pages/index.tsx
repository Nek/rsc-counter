import { cookie, setCookie } from "@lazarv/react-server";
import Counter from "~/components/Counter";
import { increment, register } from "~/lib/actions";
import { getState } from "~/lib/actions";

export default function Index() {
  const cookies = cookie();
  let sessionId = cookies.session;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    setCookie("session", sessionId);
    register(sessionId);
  }
  const state = getState();
  return [...state.entries()].map(([_id, state], i) =>
    _id === sessionId ? (
      <Counter
        key={_id}
        increment={increment}
        sessionId={_id}
        initialCount={state.count}
      />
    ) : (
      <p key={_id}>{state.count}</p>
    )
  );
}
