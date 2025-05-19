// app/lib/sse.ts
type ClientSteamController = ReadableStreamDefaultController<Uint8Array>;
type Clients = Map<string, ClientSteamController>;

const clientsBySession = new Map<string, Clients>();

export function registerClient(
  sessionId: string,
  clientId: string,
  controller: ClientSteamController
) {
  let clients = clientsBySession.get(sessionId);
  if (!clients) {
    clients = new Map<string, ClientSteamController>();
    clientsBySession.set(sessionId, clients);
  }
  clients.set(clientId, controller);
}

export function unregisterClient(sessionId: string, clientId: string) {
  const clients = clientsBySession.get(sessionId);
  if (!clients) {
    return;
  }
  clients.delete(clientId);
  if (clients.size <= 0) {
    clientsBySession.delete(sessionId);
  }
}

export function notifyClients(state: Map<string, any>) {
  console.log("notifying clients", state);
  for (const [sessionId, clientState] of state.entries()) {
    const clients = clientsBySession.get(sessionId);
    if (!clients) {
      continue;
    }
    for (const [clientId, controller] of clients.entries()) {
      const payload = `data: ${JSON.stringify(clientState)}\n\n`;
      const encoded = new TextEncoder().encode(payload);
      try {
        controller.enqueue(encoded);
      } catch (err) {
        console.error(err);
        unregisterClient(sessionId, clientId); // remove broken clients
      }
    }
  }
}
