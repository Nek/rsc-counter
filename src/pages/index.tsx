import VoteWidget from "~/components/VoteWidget";
import { getState } from "~/lib/state";
import { vote } from "~/lib/state";
import { reset } from "~/lib/state";

export default function Index() {
  return <VoteWidget initialState={getState()} vote={vote} reset={reset} />;
}
