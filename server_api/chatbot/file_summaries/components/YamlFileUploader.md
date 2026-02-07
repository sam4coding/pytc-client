# client/src/components/YamlFileUploader.js

Base configuration step: upload YAML file or choose preset, set model architecture, and adjust sliders (batch size, GPUs, etc.).

## Props

- **`type`** — `"training"` or `"inference"`

## Features

- **Upload** — FileReader to parse YAML
- **Preset select** — Fetches via `getConfigPresetContent(path)`
- **Revert to preset** — Restores original preset when modified
- **Effective dataset paths** — Shows common folder, image name, label name, output path (from AppContext)
- **Model architecture** — Select from `getModelArchitectures()`
- **Sliders** — Training: batch size, GPUs, CPUs; Inference: batch size, augmentations

## Context Sync

- Injects `DATASET.INPUT_PATH`, `IMAGE_NAME`, `LABEL_NAME`, `OUTPUT_PATH` from AppContext into loaded YAML
- Syncs `YamlContext` (numGPUs, numCPUs, solverSamplesPerBatch, etc.) from parsed YAML

## Dependencies

- `AppContext`, `YamlContext`
- `findCommonPartOfString` from utils
- API: getConfigPresets, getConfigPresetContent, getModelArchitectures
