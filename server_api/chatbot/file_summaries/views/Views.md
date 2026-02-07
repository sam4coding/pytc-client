# client/src/views/Views.js

Main view shell: horizontal menu tabs, content area, and optional AI chat drawer.

## Tabs

- File Management, Visualization, Model Training, Model Inference, Tensorboard, SynAnno, Worm Error Handling
- Tabs can be shown/hidden via `WorkflowSelector` (first launch or "Change Views")
- Only visited tabs render content (lazy)

## Persistence

- Reads `workflow_preference.json` from `/files` API to restore tab selection
- Saves preferences via POST to `/files/upload` when user selects workflows
- Polls `/health` until API ready before loading preferences

## IPC (Electron)

- `toggle-tab` — Show/hide tab by key
- `change-views` — Open `WorkflowSelector` modal

## Chat Drawer

- Right-side Drawer with resizable width (280–800px)
- Chatbot button in header; `Chatbot` component inside drawer
- `destroyOnClose` so chat state resets on close
