# client/src/App.js

Root component of the PyTC Client application. Wraps the app in context providers and performs cache clearing on boot.

## Structure

```
App
  ├── ContextWrapper (GlobalContext)
  │   └── YamlContextWrapper (YamlContext)
  │       └── CacheBootstrapper
  │           └── MainContent (Views)
```

## Components

### `CacheBootstrapper`
- Runs `resetFileState()` from `AppContext` on mount
- Clears local cache (files, fileList, etc.) before rendering children
- Renders nothing until cache is cleared; then renders main content

### `MainContent`
- Renders `Views` component (main application layout with tabs)

## Contexts

- **AppContext** — Global state (files, configs, paths, etc.)
- **YamlContext** — YAML-specific state (GPUs, batch size, etc.)

## Usage

Used as the root in `index.js` via `ReactDOM.createRoot`.
