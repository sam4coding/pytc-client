# client/src/components/FilePickerModal.js

Modal for browsing and selecting files or directories from server storage. Uses the `/files` API to list items.

## Props

- **`visible`** — Whether modal is open
- **`onCancel`** — Close callback
- **`onSelect`** — Callback with selected item `{ ...item, logical_path }`
- **`title`** — Modal title (default: "Select File")
- **`selectionType`** — `"file"`, `"directory"`, or `"fileOrDirectory"`

## Behavior

- **Breadcrumb navigation** — Click to jump to parent folders
- **Up button** — Navigate to parent
- **Select Current Directory** — Visible when `selectionType` is `directory` or `fileOrDirectory`; selects current folder
- **File/Directory selection** — Click file or folder; for files, can use "Select" action or double-click
- **Sorting** — Folders first, then files by name

## API

- `GET /files` — Loads full file tree; filters client-side by current path

## Note

- Uses `physical_path` or constructs path from `path` + `name` for backend; `logical_path` for display
