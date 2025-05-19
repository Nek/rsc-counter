// app/lib/sse.ts
type Client = ReadableStreamDefaultController<Uint8Array>;

const clients = new Map<string, Client>();

export function registerClient(id: string, controller: Client) {
  clients.set(id, controller);
}

export function unregisterClient(id: string) {
  clients.delete(id);
}

export function notifyClients(state: Map<string, any>) {
  for (const [id, clientState] of state.entries()) {
    const client = clients.get(id);
    if (!client) {
      continue;
    }
    const payload = `data: ${JSON.stringify(clientState)}\n\n`;
    const encoded = new TextEncoder().encode(payload);
    try {
      client.enqueue(encoded);
    } catch (err) {
      console.error(err);
      clients.delete(id); // remove broken clients
    }
  }
}
