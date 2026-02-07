# client/src/views/ModelInference.js

Model inference view: Configurator + Start/Stop inference buttons.

## Flow

1. Configurator (InputSelector, YamlFileUploader, YamlFileEditor)
2. Start Inference — Calls `startModelInference(inferenceConfig, outputPath, checkpointPath)`
3. Uses `localStorage.inferenceConfig` and context for output/checkpoint paths
4. Stop Inference — `stopModelInference`

## Props

- **`isInferring`**, **`setIsInferring`** — Lifted from parent; disables Start when running, Stop when not

## Note

- `context.uploadedYamlFile.name` passed to API (likely for compatibility); inference config comes from localStorage
