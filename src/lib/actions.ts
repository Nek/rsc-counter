"use server";

import { notifyClients } from "~/lib/sse";

export type SessionId = string;

export type ClientState = {
  count: number;
};

export type AppState = Map<SessionId, ClientState>;

const state: AppState = new Map();

export function register(id: SessionId): ClientState {
  if (!state.has(id)) {
    state.set(id, { count: 0 });
  }
  // notifyClients(state);
  return state.get(id)!;
}

export function increment(id: SessionId): ClientState {
  if (!state.has(id)) {
    throw new Error("No such session");
  }
  const count = state.get(id)?.count;
  if (count === undefined) {
    throw new Error("No such client state");
  }
  const newState = { count: count + 1 };
  state.set(id, newState);
  notifyClients(state);
  return newState;
}

export function getState() {
  return state;
}
