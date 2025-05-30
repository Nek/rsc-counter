"use server";

import { broadcast } from "./pubsub";

const VOTES = ["A", "B", "C", "D"] as const;
export type VoteOptions = (typeof VOTES)[number];
export type State = Record<VoteOptions, number>;
const ENTRIES: [VoteOptions, number][] = VOTES.map((vote) => [vote, 0]);

let state = Object.fromEntries(ENTRIES) as State;

export function reset() {
  state = Object.fromEntries(ENTRIES) as State;
  broadcast("poll", "update_results", state);
}
export type ResetAction = typeof reset;

export function vote(id: VoteOptions) {
  state[id] = (state[id] || 0) + 1;
  broadcast("poll", "update_results", state);
}
export type VoteAction = typeof vote;

export function getState() {
  return state;
}
export type GetStateAction = typeof getState;
