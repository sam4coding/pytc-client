# client/src/components/SynapseList.js

Scrollable list of synapses with status icons and progress. Highlights the currently selected synapse.

## Props

- **`synapses`** — Array of synapse objects
- **`currentIndex`** — Index of selected synapse
- **`onSelectSynapse`** — Callback when user clicks a synapse
- **`reviewedCount`** — Number of reviewed synapses (for progress bar)

## Status Icons

- `correct` — Green check
- `incorrect` — Red X
- `unsure` — Yellow question
- `error` / default — No icon

## Progress

- Progress bar: `reviewedCount / totalErrors` where `totalErrors` = synapses with status `"error"`
- Text: "X / Y reviewed"

## Display

- Each item: Synapse ID, position (x,y,z), confidence
- Selected item: blue background, left border highlight
