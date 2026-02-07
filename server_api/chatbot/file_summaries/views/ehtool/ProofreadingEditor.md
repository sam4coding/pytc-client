# client/src/views/ehtool/ProofreadingEditor.js

Canvas-based image editor for mask correction. Paint, erase, pan, zoom, undo/redo.

## Props

- **`imageBase64`**, **`maskBase64`** — Image and mask data
- **`onSave`** — Callback with base64 mask data
- **`onNext`**, **`onPrevious`** — Layer navigation (optional)
- **`currentLayer`**, **`totalLayers`**, **`layerName`**

## Tools

- **Paint (P)** — Draw white on mask
- **Erase (E)** — Erase from mask
- **Hand (H)** — Pan (or Ctrl+click / middle-click)

## Features

- Brush size (1–64) for paint/erase
- Minimap with click-to-jump viewport
- Undo/Redo (Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y)
- Show/Hide mask toggle
- Zoom (wheel, buttons, Reset)
- Custom brush cursor overlay
- Ctrl+S to save

## Keyboard

- P, E, H — Switch tools
- A / Arrow Left — Previous layer
- D / Arrow Right — Next layer
