# server_api/main.py

FastAPI server that powers the PyTC Client application. Provides API endpoints for model training, inference, Neuroglancer visualization, file management, authentication, and an optional RAG chatbot.

## Overview

- **Framework**: FastAPI with CORS enabled
- **Port**: 4242 (default)
- **Database**: SQLAlchemy models (auth) created on startup
- **Static Files**: `/uploads` directory mounted for file storage

## Routers

- **Auth** (`/`): User authentication
- **SynAnno** (`/`): Synapse annotation endpoints
- **EHTool** (`/eh`): Error handling tool (detection, classification, layers)

## Key Endpoints

### Health & Config
- `GET /health` — Server status check
- `GET /pytc/configs` — List PyTorch Connectomics config presets (YAML)
- `GET /pytc/config?path=...` — Get config file content
- `GET /pytc/architectures` — List model architectures from build.py

### Model Training & Inference
- `POST /start_model_training` — Proxy to PyTC server (localhost:4243)
- `POST /stop_model_training` — Stop training
- `GET /training_status` — Training status polling
- `POST /start_model_inference` — Run inference
- `POST /stop_model_inference` — Stop inference
- `GET /get_tensorboard_url` — Returns TensorBoard URL (default: localhost:6006)

### Visualization
- `POST /neuroglancer` — Create Neuroglancer viewer for image/label volumes. Accepts JSON or multipart/form-data with image, label, scales.

### Data & Files
- `POST /check_files` — Heuristic check if file is a label (integer type, low unique values, or binary)

### Chatbot (RAG)
- `POST /chat/query` — Chat query (requires chatbot configured)
- `POST /chat/clear` — Clear chat history
- `GET /chat/status` — Check if chatbot is configured

## Chatbot Notes

- Chatbot is optional; server continues if dependencies fail
- Lazy initialization via `_ensure_chatbot()` on first request
- Returns 503 if chatbot not configured

## Environment

- `REACT_APP_SERVER_PROTOCOL = "http"`
- `REACT_APP_SERVER_URL = "localhost:4243"` (PyTC server)
