# client/src/contexts/YamlContext.js

Context for YAML-related UI state (GPUs, batch size, etc.). Used by `YamlFileUploader` to drive sliders and sync with loaded config.

## State

### Training
- `numGPUs`, `numCPUs`
- `solverSamplesPerBatch`, `learningRate`

### Inference
- `inferenceSamplesPerBatch`, `augNum`

## YamlContextWrapper

Provides `YamlContext.Provider`. Wraps children inside `AppContext` in App.js.
