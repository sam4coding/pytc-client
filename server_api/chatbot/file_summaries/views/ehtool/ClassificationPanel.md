# client/src/views/ehtool/ClassificationPanel.js

Right-side panel for classifying selected layers in the detection workflow.

## Props

- **`selectedCount`** — Number of selected layers
- **`onClassify`** — Callback with "correct" | "incorrect" | "unsure"
- **`onSelectAll`** — Select all layers
- **`onClearSelection`** — Clear selection

## UI

- Tag: "X layer(s) selected"
- Buttons: Correct (C), Incorrect (X), Unsure (U) — disabled when none selected
- Selection: Select All (Ctrl+A), Clear Selection
- Keyboard shortcuts help section
