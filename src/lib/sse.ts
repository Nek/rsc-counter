// app/lib/sse.ts
type Client = ReadableStreamDefaultController<Uint8Array>;

const clients = new Map<string, Client>();

export function registerClient(id: string, controller: Client) {
  clients.set(id, controller);
}

export function unregisterClient(id: string) {
  clients.delete(id);
}

export function pushToClients(data: any) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  const encoded = new TextEncoder().encode(payload);

  for (const client of clients.values()) {
    try {
      client.enqueue(encoded);
    } catch (err) {
      console.error(err);
      clients.delete(client); // remove broken clients
    }
  }
}
