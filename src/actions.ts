"use server";

import { pushToClients } from "./lib/sse";

const state = {
  count: 0,
};

export function increment() {
  state.count++;
  pushToClients(state);
}

export function getState() {
  return state;
}
