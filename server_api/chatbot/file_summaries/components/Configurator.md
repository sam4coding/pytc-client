# client/src/components/Configurator.js

Stepper-based configuration workflow for **training** or **inference**. Drives users through setting inputs, base config, and advanced config.

## Props

- **`fileList`** — File list (from context or props)
- **`type`** — `"training"` or `"inference"`

## Steps

1. **Set Inputs** — `InputSelector` (image, label, output path, log/checkpoint path)
2. **Base Configuration** — `YamlFileUploader` (preset or upload)
3. **Advanced Configuration** — `YamlFileEditor` (tweak YAML controls)

## Validation

- Prevents advancing if required inputs are missing
- Shows warning alert: "Before you continue, add: ..."
- Missing inputs: input image, input label, output path; log path (training) or checkpoint path (inference)
- Missing base config: "base configuration (preset or upload)"

## Persistence

- Step index saved to `localStorage` under `configStep:${type}`
- On "Done": saves `trainingConfig` or `inferenceConfig` to `localStorage`

## Dependencies

- `AppContext` — inputImage, inputLabel, outputPath, logPath, checkpointPath, trainingConfig, inferenceConfig
