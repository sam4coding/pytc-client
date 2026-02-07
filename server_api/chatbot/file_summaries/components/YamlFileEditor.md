# client/src/components/YamlFileEditor.js

Advanced YAML configuration editor with structured controls (switches, selects, numbers) and a raw YAML modal.

## Props

- **`type`** — `"training"` or `"inference"`

## Sections (CONTROL_SECTIONS)

### Training

- Common training knobs: Optimizer, LR scheduler, learning rate, batch size, iterations, save/validation intervals
- System: Distributed, Parallel mode, Debug mode
- Model: Block type, Backbone, Normalization, Activation, Pooling, Mixed precision, Aux output
- Dataset: 2D dataset, Load 2D slices, Isotropic, Drop channels, Reduce labels, Ensure min size, Pad mode
- Solver (advanced): Weight decay, Momentum, Clip gradients

### Inference

- Common: Batch size, Augmentations, Blending, Eval mode
- Advanced: Run singly, Unpad output, Augment mode, Test count

## Features

- **Structured controls** — Switch, Select, InputNumber per YAML path
- **Raw YAML modal** — "Open raw YAML" for full editing; Format, Copy buttons
- **Validation** — Shows "YAML has a syntax error" when invalid
- **Context sync** — Updates `AppContext` trainingConfig or inferenceConfig on change

## Dependency

- `AppContext` — trainingConfig, inferenceConfig, uploadedYamlFile, selectedYamlPreset
