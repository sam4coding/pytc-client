# PyTC Client

A desktop client that interacts with the `pytorch_connectomics` library for connectomics workflows.

This file only contains instructions on running the application. For a high-level description of the project structure, see `project-structure.md`.

## Set-up

### 1. Bootstrap

```
scripts/bootstrap.sh      # macOS / Linux
scripts\bootstrap.ps1     # Windows
```

Re-run this only when you need to update dependencies.

### 2. Launch the full stack

```
scripts/start.sh          # macOS / Linux
scripts\start.ps1         # Windows
```

## Before pushing

Format most code with `prettier`:

```
npm install
npx prettier --write .
```

Format python code with `black`:

```
uv run black .
```

Format shell scripts with `shfmt` (macOS / Linux):

```
brew install shfmt
shfmt -w .
```
