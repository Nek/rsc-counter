## About

This is a real-time voting application prototype built with [@lazarv/react-server](https://react-server.dev), demonstrating React Server Components with real-time updates via Server-Sent Events (SSE). It's heavily inspired by a Phoenix LiveView example.

### Key Architecture Patterns

1. **React Server Components**: Server actions in `src/lib/state.ts` marked with `"use server"` directive handle voting logic and state mutations
2. **Real-time Communication**: Custom pub/sub system using SSE for broadcasting state changes to all connected clients
3. **File-based Routing**: Pages in `src/pages/` directory, with API routes following naming convention (e.g., `GET.events.ts`)


### State Management Flow

- **Server State**: Global voting state maintained in `src/lib/state.ts` with functions `vote()`, `reset()`, and `getState()`
- **Real-time Updates**: Server actions call `broadcast()` to notify all connected clients via SSE
- **Client Sync**: `usePubSub` hook manages EventSource connections and updates local state

### SSE Implementation

- **Subscription**: `GET.events.ts` creates EventSource endpoint for client connections
- **Pub/Sub System**: `src/lib/pubsub.ts` manages client subscriptions and broadcasting
- **Client Hook**: `src/hooks/usePubSub.ts` provides React integration with EventSource

### Component Structure

- **VoteWidget**: Main client component that consumes server actions and real-time updates
- **VoteButton**: Individual voting button component
- Server actions are passed as props from server components to client components
  
## Getting Started

First, run the development server:

```sh
bun --bun run dev
```

Use the `--open` flag, the development server command menu or navigate to [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying ``. The page auto-updates as you edit the file.

## Build

To build the application for production, run:

```sh
bun --bun run build
```

The build output will be in the `.react-server` directory.

To run the production server, run:

```sh
bun --bun run start
```

## Learn More

To learn more about [@lazarv/react-server](https://react-server.dev), take a look at the documentation or search the documentation using the development server.

You can check out framework on [GitHub](https://github.com/lazarv/react-server) - your feedback and contributions are welcome!
