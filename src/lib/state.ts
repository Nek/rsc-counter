"use server";

import Redis from "ioredis";

import { broadcast } from "./pubsub";

const redis = new Redis(); // default: localhost:6379

const VOTES = ["A", "B", "C", "D"] as const;
export type VoteOptions = (typeof VOTES)[number];
export type State = Record<VoteOptions, number>;
const ENTRIES: [VoteOptions, number][] = VOTES.map((vote) => [vote, 0]);

const STATE_KEY = "poll:state";

export async function reset() {
  const entries = VOTES.map((vote) => [vote, "0"]);
  await redis.del(STATE_KEY);
  await redis.hset(STATE_KEY, Object.fromEntries(entries));
  const state = Object.fromEntries(entries.map(([k, v]) => [k, Number(v)])) as State;
  broadcast("poll", "update_results", state);
}
export type ResetAction = typeof reset;

export async function vote(id: VoteOptions) {
  await redis.hincrby(STATE_KEY, id, 1);
  const state = await getState();
  broadcast("poll", "update_results", state);
}
export type VoteAction = typeof vote;

export async function getState(): Promise<State> {
  const data = await redis.hgetall(STATE_KEY);
  const state: Partial<State> = {};
  for (const [key, value] of Object.entries(data)) {
    state[key as VoteOptions] = parseInt(value, 10);
  }
  // Ensure all vote options exist (even if Redis was empty)
  for (const k of VOTES) {
    if (state[k] == null) state[k] = 0;
  }
  return state as State;
}
export type GetStateAction = typeof getState;
