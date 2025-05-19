import { increment } from "../actions";
import { getState } from "../actions";
import Counter from "../Counter";

export default function Index() {
  return <Counter count={getState().count} increment={increment} />;
}
