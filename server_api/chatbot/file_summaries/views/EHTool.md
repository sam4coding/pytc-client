# client/src/views/EHTool.js

Error Handling Tool wrapper. Renders header and `DetectionWorkflow` for detecting and classifying errors in image stacks.

## Props

- **`onStartProofreading`** — Callback when user starts proofreading
- **`onSessionChange`** — Callback when session ID changes
- **`refreshTrigger`** — Incremented to force refresh
- **`savedSessionId`** — Persisted session ID to restore

## Layout

- Header: "Error Handling Tool" with description
- Content: `DetectionWorkflow` with session management
