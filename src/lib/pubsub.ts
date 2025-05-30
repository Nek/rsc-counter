// app/lib/sse.ts
type ClientSteamController = ReadableStreamDefaultController<Uint8Array>;
type ChannelId = string;
type ClientId = string;
type Clients = Map<ClientId, ClientSteamController>;
type Channels = Map<ChannelId, Clients>;

const clientsBySession: Channels = new Map();

export function subscribe(
  channelId: string,
  clientId: string,
  controller: ClientSteamController
) {
  let clients = clientsBySession.get(channelId);
  if (!clients) {
    clients = new Map<string, ClientSteamController>();
    clientsBySession.set(channelId, clients);
  }
  clients.set(clientId, controller);
}

export function unsubscribe(channelId: string, clientId: string) {
  const clients = clientsBySession.get(channelId);
  if (!clients) {
    return;
  }
  clients.delete(clientId);
  if (clients.size <= 0) {
    clientsBySession.delete(channelId);
  }
}

export function broadcast(channelId: string, event: string, data: any) {
  const clients = clientsBySession.get(channelId);
  if (!clients) {
    return;
  }
  for (const [clientId, controller] of clients.entries()) {
    const payload = `data: ${JSON.stringify({ type: event, data })}\n\n`;
    const encoded = new TextEncoder().encode(payload);
    try {
      controller.enqueue(encoded);
    } catch (err) {
      console.error(err);
      unsubscribe(channelId, clientId); // remove broken clients
    }
  }
}
