# client/src/views/ProofReading.js

SynAnno proofreading view: synapse list, Neuroglancer viewer, and proofreading controls.

## Layout

- **Left (15%)** — `SynapseList` (progress + clickable list)
- **Center** — `NeuroglancerViewer` (project-based; `/api/synanno/ng-url/:projectId`)
- **Right (15%)** — `ProofreadingControls`

## API

- `GET /api/projects/:projectId/synapses` — Fetch synapses
- `GET /api/synanno/ng-url/:projectId` — Neuroglancer URL
- `PUT /api/synapses/:id` — Update synapse (status, pre_neuron_id, post_neuron_id)

## Keyboard Shortcuts

- C — Correct
- X — Incorrect
- U — Unsure
- Arrow Right — Next
- Arrow Left — Previous
- S — Save

## States

- Loading, empty (no synapses), main layout
