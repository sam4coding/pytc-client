#!/usr/bin/env bash

set -euo pipefail

if ! command -v uv >/dev/null 2>&1; then
	echo "uv is required. Install it from https://docs.astral.sh/uv/." >&2
	exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
	echo "npm is required to run the Electron client." >&2
	exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLIENT_DIR="${ROOT_DIR}/client"

echo "Synchronizing Python environment with uv..."
uv sync --python 3.11 --directory "${ROOT_DIR}"

echo "Preparing pytorch_connectomics dependency..."
bash "${ROOT_DIR}/scripts/setup_pytorch_connectomics.sh"

echo "Installing frontend dependencies..."
pushd "${CLIENT_DIR}" >/dev/null
npm install
popd >/dev/null

echo "Bootstrap complete. Run scripts/start.sh to launch the app."
