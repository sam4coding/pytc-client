# client/src/components/WorkflowSelector.js

Modal for selecting which workflows/tabs to show in the main app. Used on first launch and via "Change Views".

## Props

- **`visible`** — Whether modal is open
- **`onSelect`** — Callback with array of selected mode keys
- **`onCancel`** — Close callback

## Options

- File Management (`files`)
- Visualization (`visualization`)
- Model Training (`training`)
- Model Inference (`inference`)
- Tensorboard (`monitoring`)
- SynAnno (`synanno`)
- Worm Error Handling (`worm-error-handling`)

## Default

"files" is selected by default. User can select multiple; "Launch Selected" submits.
