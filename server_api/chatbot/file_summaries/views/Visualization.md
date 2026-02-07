# client/src/views/Visualization.js

Neuroglancer visualization view. Users select image and label, set scales, and open Neuroglancer viewers in tabs.

## Props

- **`viewers`**, **`setViewers`** — Lifted state; array of `{ key, title, viewer }` (viewer = URL)

## Inputs

- Image — `UnifiedFileInput`
- Label — `UnifiedFileInput`
- Scales (z,y,x) — Text input (default "30,6,6")

## Flow

1. User selects image/label, clicks "Visualize"
2. `getNeuroglancerViewer(imagePath, labelPath, scalesArray)` → server returns viewer URL
3. URL rewritten to use `localhost` instead of server host
4. New viewer added to `viewers`; tab created
5. Tabs are editable (close); Refresh button per tab

## Empty State

"InboxOutlined" icon + "Select an image and click Visualize to get started"
