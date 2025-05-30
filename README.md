## About

This is a real-time voting application prototype built with [@lazarv/react-server](https://react-server.dev), demonstrating React Server Components with Redis-backed state and real-time updates via Server-Sent Events (SSE). It's heavily inspired by a Phoenix LiveView example.

### Key Technologies

- **Framework**: [@lazarv/react-server](https://react-server.dev) with React Server Components
- **State Storage**: Redis (ioredis) for persistent voting state
- **Real-time**: Server-Sent Events (SSE) with Redis pub/sub for multi-instance scaling
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite with React Compiler

### Key Architecture Patterns

1. **React Server Components**: Server actions in `src/lib/state.ts` marked with `"use server"` directive handle voting logic and state mutations
2. **Redis State Management**: Persistent voting state stored in Redis with automatic real-time synchronization
3. **Scalable Real-time Communication**: Redis pub/sub enables SSE broadcasting across multiple server instances
4. **File-based Routing**: Pages in `src/pages/` directory, with API routes following naming convention (e.g., `GET.events.ts`)


### State Management Flow

- **Redis Storage**: Voting state persisted in Redis hash at key `poll:state` with vote options A, B, C, D
- **Server Actions**: Functions `vote()`, `reset()`, and `getState()` in `src/lib/state.ts` handle Redis operations
- **Real-time Broadcasting**: Server actions publish updates via Redis pub/sub to `poll:*` channels
- **Multi-instance Scaling**: Redis pub/sub distributes messages across server instances
- **Client Sync**: `usePubSub` hook manages EventSource connections and updates local state

### Real-time Communication Architecture

- **SSE Endpoint**: `GET.events.ts` creates EventSource endpoint for client connections
- **Redis Integration**: `src/lib/pubsub.ts` bridges Redis pub/sub with local client management
- **Client Hook**: `src/hooks/usePubSub.ts` provides React integration with EventSource
- **Message Flow**: Server Action → Redis Update → Redis Pub/Sub → SSE → All Connected Clients

### Component Structure

- **VoteWidget**: Main client component that consumes server actions and real-time updates
- **VoteButton**: Individual voting button component
- Server actions are passed as props from server components to client components
  
## Getting Started

First, start Redis:

```sh
docker run -p 6379:6379 redis
```

Then, run the development server:

```sh
bun --bun run dev
```

Use the `--open` flag, the development server command menu or navigate to [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.tsx`. The page auto-updates as you edit the file.

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

## Development Commands

- **Linting**: `bun run lint`
- **Type checking**: `bun run typecheck`
- **Format code**: `bun run format`

## Learn More

To learn more about [@lazarv/react-server](https://react-server.dev), take a look at the documentation or search the documentation using the development server.

You can check out framework on [GitHub](https://github.com/lazarv/react-server) - your feedback and contributions are welcome!
