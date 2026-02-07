# client/src/views/Monitoring.js

TensorBoard monitoring view. Fetches TensorBoard URL and displays it in an iframe.

## API

- `getTensorboardURL()` — Returns URL (default `http://localhost:6006/`)

## UI

- Full-width iframe, height 800px
- Fetches URL on mount when not yet set
