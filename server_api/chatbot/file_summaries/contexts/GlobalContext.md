# client/src/contexts/GlobalContext.js

Global application state via React Context. Persists file-related and config state to IndexedDB via `localforage`.

## State Keys (FILE_CACHE_KEYS)

- `files`, `fileList`, `imageFileList`, `labelFileList`
- `currentImage`, `currentLabel`
- `inputImage`, `inputLabel`
- `outputPath`, `logPath`, `checkpointPath`
- `trainingConfig`, `inferenceConfig`
- `uploadedYamlFile`, `selectedYamlPreset` (selectedYamlPreset not persisted)
- `viewer`, `tensorBoardURL`

## Persistence

- `usePersistedState(key, defaultValue)` — Loads from localforage on mount, saves on change
- `sanitizePersistedState` — Removes volatile fields from file objects before save
- `resetFileState` — Clears all file-related keys from localforage and resets to defaults

## ContextWrapper

Provides `AppContext.Provider` with all state and setters. Used at app root in App.js.
