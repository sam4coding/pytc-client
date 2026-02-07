# client/src/components/FileTreeSidebar.js

Collapsible sidebar showing a tree of folders and files. Used by `FilesManager` for navigation.

## Props

- **`folders`** — Array of `{ key, title, parent }`
- **`files`** — Object mapping parent key to array of `{ key, name, size, type }`
- **`currentFolder`** — Currently selected folder key
- **`onSelect`** — Callback when folder is selected (receives key without `folder-` prefix)
- **`onDrop`** — Optional callback for drag-and-drop
- **`onContextMenu`** — Optional callback for right-click
- **`width`** — Sidebar width (default 250); 0 hides it

## UI

- "Explorer" header
- Ant Design `DirectoryTree` with folders (expandable) and files (leaf nodes)
- Icons: FolderFilled, FolderOpenFilled, FileOutlined
- Draggable nodes; `blockNode` layout
