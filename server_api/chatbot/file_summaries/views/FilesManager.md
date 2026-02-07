# client/src/views/FilesManager.js

File manager: tree sidebar, breadcrumb navigation, grid/list view, and full CRUD on files/folders.

## Features

- **Sidebar** — `FileTreeSidebar`; resizable; toggle visibility
- **Breadcrumb** — Navigate up; click to jump
- **View modes** — Grid or list
- **Selection** — Single/multi (Ctrl, Shift); drag selection box
- **Context menu** — New folder, Upload, Rename, Copy, Delete, Preview, Properties
- **Drag & drop** — Internal move; external OS files → upload to current folder
- **Keyboard** — Delete, Ctrl+C/X/V, Ctrl+A

## API Endpoints

- `GET /files` — List files/folders
- `POST /files/folder` — Create folder
- `PUT /files/:id` — Rename or move
- `DELETE /files/:id` — Delete
- `POST /files/upload` — Upload file
- `POST /files/copy` — Copy file

## State

- folders, files (transformed from API), currentFolder
- selectedItems, clipboard, editingItem, newItemType, tempName
- contextMenu, previewFile, propertiesData, selectionBox
- sidebarWidth, isSidebarVisible
