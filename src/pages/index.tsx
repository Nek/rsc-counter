import VoteWidget from "~/components/VoteWidget";
import { getState } from "~/lib/state";
import { vote } from "~/lib/state";
import { reset } from "~/lib/state";

export default async function Index() {
  const state = await getState();
  return <VoteWidget initialState={state} vote={vote} reset={reset} />;
}
