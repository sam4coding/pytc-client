# client/src/views/ehtool/UnifiedImageEditor.js

Modal combining mask editing (ProofreadingEditor) with quality classification. Used when user clicks a layer in the grid.

## Props

- **`visible`** — Whether modal is open
- **`layer`** — Layer object (image_base64, mask_base64, layer_name, layer_index, id, classification)
- **`sessionId`** — Current session
- **`onClose`** — Close callback
- **`onSaveSuccess`** — Called after save; typically triggers reload of layers/stats

## Flow

1. User edits mask in ProofreadingEditor
2. User sets classification (Correct/Incorrect/Unsure) via radio buttons
3. Save (Ctrl+S or button) → POST mask to `/eh/detection/mask`, POST classification to `/eh/detection/classify`
4. onSaveSuccess → close

## Keyboard

- C, X, U — Set classification
- Ctrl+S — Save
- Escape — Close
