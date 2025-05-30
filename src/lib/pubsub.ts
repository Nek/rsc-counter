import Redis from "ioredis";

type ClientStreamController = ReadableStreamDefaultController<Uint8Array>;
type ChannelId = string;
type ClientId = string;
type Clients = Map<ClientId, ClientStreamController>;
type Channels = Map<ChannelId, Clients>;

const clientsByChannel: Channels = new Map();

// Redis connection (duplicate for pub/sub)
const redisPub = new Redis();
const redisSub = new Redis();

redisSub.psubscribe("poll:*", (err) => {
  if (err) console.error("Redis subscribe error", err);
});

// When receiving a message from Redis, forward to local clients
redisSub.on("pmessage", (_pattern, channelKey, message) => {
  const [, channelId] = channelKey.split(":"); // e.g., poll:abc123 → abc123
  const payload = JSON.parse(message);
  const clients = clientsByChannel.get(channelId);
  if (!clients) return;

  const encoded = new TextEncoder().encode(
    `data: ${JSON.stringify(payload)}\n\n`
  );
  for (const [clientId, controller] of clients) {
    try {
      controller.enqueue(encoded);
    } catch (err) {
      console.error("Broadcast error", err);
      unsubscribe(channelId, clientId);
    }
  }
});

export function subscribe(
  channelId: string,
  clientId: string,
  controller: ClientStreamController,
  abortSignal?: AbortSignal
) {
  let clients = clientsByChannel.get(channelId);
  if (!clients) {
    clients = new Map();
    clientsByChannel.set(channelId, clients);
  }
  clients.set(clientId, controller);

  // Optional: clean up when request is aborted (e.g. browser closed)
  if (abortSignal) {
    const onAbort = () => {
      unsubscribe(channelId, clientId);
    };
    abortSignal.addEventListener("abort", onAbort, { once: true });
  }
}

export function unsubscribe(channelId: string, clientId: string) {
  const clients = clientsByChannel.get(channelId);
  if (!clients) return;
  clients.delete(clientId);
  if (clients.size === 0) {
    clientsByChannel.delete(channelId);
  }
}

export function broadcast(channelId: string, event: string, data: any) {
  const message = JSON.stringify({ type: event, data });
  redisPub.publish(`poll:${channelId}`, message);
}
