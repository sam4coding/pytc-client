# client/src/views/ehtool/LayerGrid.js

Grid of layer cards with thumbnails, classification status, selection checkboxes, and pagination.

## Props

- **`layers`** — Array of layer objects (id, image_base64, mask_base64, layer_name, layer_index, classification)
- **`selectedLayers`** — Array of selected layer IDs
- **`onLayerSelect`** — Toggle selection (layerId)
- **`onLayerClick`** — Open inspector/editor (layer)
- **`currentPage`**, **`totalPages`**, **`onPageChange`**

## UI

- Cards with Badge.Ribbon showing classification (Correct/Incorrect/Unsure/Unreviewed)
- Checkbox overlay for selection (click does not open editor)
- Image + optional mask overlay (opacity 0.5)
- Pagination at bottom (12 per page)
