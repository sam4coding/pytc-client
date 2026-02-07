# client/src/components/ProofreadingControls.js

Controls for classifying and editing a single synapse during proofreading. Displays status buttons, neuron ID inputs, and save actions.

## Props

- **`currentSynapse`** — Selected synapse object
- **`onSave`** — Callback with `{ status, pre_neuron_id, post_neuron_id }`
- **`onNext`** — Navigate to next synapse

## UI Sections

1. **Synapse info** — ID, position (x,y,z), confidence
2. **Status Classification** — Correct (C), Incorrect (X), Unsure (U) buttons
3. **Pre-synaptic Neuron ID** — Input
4. **Post-synaptic Neuron ID** — Input
5. **Actions** — Save (S), Save & Next (→)

## Empty State

Shows "No synapse selected" when `currentSynapse` is null.
