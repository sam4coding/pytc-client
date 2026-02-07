# client/src/views/ModelTraining.js

Model training view: Configurator + Start/Stop training buttons.

## Flow

1. Configurator (InputSelector, YamlFileUploader, YamlFileEditor)
2. Start Training — Validates uploaded YAML, outputPath, logPath; calls `startModelTraining`
3. Polls `getTrainingStatus` every 2s while training
4. Stop Training — `stopModelTraining`

## Validation

- Requires `uploadedYamlFile`, `outputPath`, `logPath` before starting
- Uses `localStorage.trainingConfig` or `context.trainingConfig`

## Status Display

Shows training status message (starting, monitoring, completed, error, stopped).
