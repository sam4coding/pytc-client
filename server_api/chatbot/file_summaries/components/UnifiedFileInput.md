# client/src/components/UnifiedFileInput.js

Unified file/directory input supporting text entry, drag-and-drop, and a file picker for local or server storage.

## Props

- **`value`** — Current value: string path or `{ path, display }`
- **`onChange`** — Callback with `{ path, display }`
- **`placeholder`**
- **`style`**, **`disabled`**
- **`selectionType`** — `"file"`, `"directory"`, or `"fileOrDirectory"` (default: `"file"`)

## Input Methods

1. **Text input** — Type path directly
2. **Browse (folder icon)** — Opens "Select Source" modal:
   - **Local Machine** — Electron `ipcRenderer.invoke("open-local-file", …)` for native dialog
   - **Server Storage** — Opens `FilePickerModal`
3. **Drag and drop** — Drop file/folder; uses `file.path` (Electron)

## Features

- Drag-over visual feedback
- Display value can differ from `path` (e.g. logical vs physical path)

## Dependencies

- Electron for local file picker
- `FilePickerModal` for server selection
