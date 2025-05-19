import { cookie, setCookie } from "@lazarv/react-server";
import Counter from "~/components/Counter";
import { increment, register } from "~/lib/actions";
import { getState } from "~/lib/actions";

export default function Index() {
  const cookies = cookie();
  let id = cookies.session;
  if (!id) {
    id = crypto.randomUUID();
    setCookie("session", id);
    register(id);
  }
  const state = getState();
  return [...state.entries()].map(([_id, state], i) =>
    _id === id ? (
      <Counter key={_id} count={state.count} increment={increment} id={_id} />
    ) : (
      <p key={_id}>{state.count}</p>
    )
  );
}
