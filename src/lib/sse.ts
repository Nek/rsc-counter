// app/lib/sse.ts
type Client = ReadableStreamDefaultController<Uint8Array>;

const clients = new Set<Client>();

export function registerClient(controller: Client) {
  clients.add(controller);
}

export function unregisterClient(controller: Client) {
  clients.delete(controller);
}

export function pushToClients(data: any) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  const encoded = new TextEncoder().encode(payload);

  for (const client of clients) {
    try {
      client.enqueue(encoded);
    } catch (err) {
      clients.delete(client); // remove broken clients
    }
  }
}