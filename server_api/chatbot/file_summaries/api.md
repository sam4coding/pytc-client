# client/src/api.js

Central API client for the PyTC Client frontend. Exposes functions for all backend communication.

## API Base URL

`${REACT_APP_SERVER_PROTOCOL || "http"}://${REACT_APP_SERVER_URL || "localhost:4242"}`

## Exports

### `apiClient`
Axios instance with base URL, `withCredentials: true`. Used for general requests (e.g. `/files`, `/files/upload`).

### Visualization
- **`getNeuroglancerViewer(image, label, scales)`** — Launches Neuroglancer viewer. Accepts file objects or path strings. Uses FormData for browser uploads.

### File Checks
- **`checkFile(file)`** — POST to `/check_files` to detect if file is likely a label (heuristic).

### Generic
- **`makeApiRequest(url, method, data)`** — HTTP request helper with JSON Content-Type.

### Model Training
- **`startModelTraining(trainingConfig, logPath, outputPath)`** — Injects OUTPUT_PATH into YAML config and POSTs to `/start_model_training`
- **`stopModelTraining()`**
- **`getTrainingStatus()`**
- **`getTensorboardURL()`**

### Model Inference
- **`startModelInference(inferenceConfig, outputPath, checkpointPath)`** — Injects OUTPUT_PATH into YAML, sets NUM_GPUS=1, POSTs to `/start_model_inference`
- **`stopModelInference()`**
- **`getInferenceStatus()`**

### Chatbot
- **`queryChatBot(query)`** — POST to `/chat/query`
- **`clearChat()`** — POST to `/chat/clear`

### Config Presets
- **`getConfigPresets()`** — GET `/pytc/configs`
- **`getConfigPresetContent(path)`** — GET `/pytc/config`
- **`getModelArchitectures()`** — GET `/pytc/architectures`

## Helper Functions

- `buildFilePath(file)` — Extracts path from various file object shapes ( Ant Design Upload, folderPath+name, etc.)
- `hasBrowserFile(file)` — Checks if file is a browser File object
- `handleError(error)` — Throws errors with response detail when available
