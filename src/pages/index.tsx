import { cookie, setCookie } from "@lazarv/react-server";

import { increment } from "../actions";
import { getState } from "../actions";
import Counter from "../Counter";

export default function Index() {
  const cookies = cookie();
  let id = cookies.session;
  if (!id) {
    id = crypto.randomUUID();
    setCookie("session", id);
  }
  return <Counter id={id} count={getState().count} increment={increment} />;
}
