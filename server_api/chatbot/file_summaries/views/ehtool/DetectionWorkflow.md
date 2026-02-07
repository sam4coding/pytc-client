# client/src/views/ehtool/DetectionWorkflow.js

Main detection workflow for the Error Handling Tool. Load dataset → browse layers → classify → proofread incorrect layers.

## Props

- **`sessionId`**, **`setSessionId`** — Session state
- **`refreshTrigger`** — Forces reload when changed

## Flow

1. **No session** — Show `DatasetLoader`
2. **With session** — Three-panel layout:
   - Left: `ProgressTracker` (stats, progress, "Proofread Incorrect", "Load New Dataset")
   - Center: `LayerGrid` (paginated layers; click to inspect, checkbox to select)
   - Right: `ClassificationPanel` (Correct/Incorrect/Unsure, Select All, Clear)
3. **UnifiedImageEditor** — Modal for mask editing + classification when layer clicked

## API

- `POST /eh/detection/load` — Load dataset; returns session_id, project_name, total_layers
- `GET /eh/detection/layers` — Layers with pagination, include_images
- `GET /eh/detection/stats` — Progress stats
- `POST /eh/detection/classify` — Classify selected layers

## Keyboard Shortcuts

- C — Correct (selected layers)
- X — Incorrect
- U — Unsure
- Ctrl+A — Select all

## Page Size

12 layers per page (3x4 grid).
