"use client";

import { useEffect, useState } from "react";

import { usePubSub } from "~/hooks/usePubSub";
import { ResetAction, type State, VoteAction, VoteOptions } from "~/lib/state";

import VoteButton from "./VoteButton";

export default function VoteWidget({
  initialState,
  vote,
  reset,
}: {
  initialState: State;
  vote: VoteAction;
  reset: ResetAction;
}) {
  const [state, setState] = useState<State>(initialState);
  const event = usePubSub("poll");

  useEffect(() => {
    if (event) {
      switch (event.type) {
        case "update_results":
          setState(event.data);
          break;
      }
    }
  }, [event]);

  return (
    <div>
      {[...Object.entries(state)].map(([id, count]) => {
        return (
          <VoteButton
            key={id}
            description={id}
            count={count}
            vote={() => vote(id as VoteOptions)}
          />
        );
      })}
      <button onClick={() => reset()}>Reset</button>
    </div>
  );
}
