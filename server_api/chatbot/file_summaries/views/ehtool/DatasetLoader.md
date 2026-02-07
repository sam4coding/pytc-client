# client/src/views/ehtool/DatasetLoader.js

Form to load a dataset for the Error Handling Tool. Collects project name, dataset path, and optional mask path.

## Props

- **`onLoad`** — Callback `(datasetPath, maskPath, projectName)`
- **`loading`** — Disables submit button

## Form Fields

- **Project Name** — Required (default "My Project")
- **Dataset Path** — Required; `UnifiedFileInput` (file, directory, or glob)
- **Mask Path** — Optional; `UnifiedFileInput`

## Supported Formats

- Single TIFF (2D or 3D)
- Directory of images (PNG, JPG, TIFF)
- Glob pattern (e.g. `*.tif`)
