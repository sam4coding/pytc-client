# client/src/components/InputSelector.js

Form for selecting input image, label, output path, and (depending on type) log path or checkpoint path. Used inside `Configurator` step 1.

## Props

- **`type`** — `"training"` or `"inference"`

## Form Items

- **Input Image** — `UnifiedFileInput` (file or directory for training/inference)
- **Input Label** — Same
- **Output Path** — Directory
- **Log Path** (training) — Directory for training logs
- **Checkpoint Path** (inference) — Path to model checkpoint (.pth.tar)

## Context

- Reads/writes `AppContext`: inputImage, inputLabel, outputPath, logPath, checkpointPath
