# client/src/views/WormErrorHandling.js

Container for the Worm Error Handling workflow. Wraps `EHTool` and manages session state.

## State

- `ehToolSession` — Current session ID (passed to EHTool as `savedSessionId`)
- `refreshTrigger` — Incremented when proofreading starts; forces EHTool refresh

## Props to EHTool

- `refreshTrigger`, `savedSessionId`, `onSessionChange`, `onStartProofreading`
