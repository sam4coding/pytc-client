# client/src/components/NeuroglancerViewer.js

Loads and displays a Neuroglancer viewer in an iframe for a given project. Used in SynAnno / proofreading flow.

## Props

- **`projectId`** — Project ID (default 1)
- **`currentSynapse`** — Optional; shows synapse ID in UI for reference

## API

- `GET /api/synanno/ng-url/${projectId}` — Returns `{ url }` or `{ message }`

## States

- **Loading** — Spinner while fetching
- **Error** — Alert + "Try Again" button
- **Setup in Progress** — When URL not yet available; shows "Converting data to NIfTI format..."
- **Ready** — iframe with Neuroglancer

## UI

- Refresh button (top-right)
- Optional synapse ID display
