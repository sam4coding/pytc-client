# client/src/views/ehtool/ProgressTracker.js

Left-side panel showing detection workflow progress and actions.

## Props

- **`stats`** — { progress_percent, reviewed, total, correct, incorrect, unsure, error }
- **`projectName`**, **`totalLayers`**
- **`onNewSession`** — Load new dataset
- **`onStartProofreading`** — Start proofreading (opens first incorrect layer)

## UI

- Project Info card (name, layer count)
- Progress bar (reviewed/total)
- Classification Summary (Correct, Incorrect, Unsure, Unreviewed counts)
- "Proofread Incorrect Layers" button (when incorrect > 0)
- "Load New Dataset" button
