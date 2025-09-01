# SceneGraph AI

SceneGraph AI is a full-stack application that generates scene graphs and natural language descriptions from user-uploaded images. It leverages deep learning models for object detection and relationship reasoning, and provides a modern, interactive web interface for visualization.

---

## Table of Contents
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Backend Details](#backend-details)
- [Frontend Details](#frontend-details)
- [Setup Instructions](#setup-instructions)
- [API Reference](#api-reference)
- [Technologies Used](#technologies-used)
- [License](#license)

---

## Features
- **Object Detection**: Uses YOLOv5 to detect objects in images.
- **Scene Graph Construction**: Predicts spatial and semantic relationships between objects.
- **Graph Neural Network (GNN) Reasoning**: Refines relationships using GNNs.
- **Natural Language Description**: Summarizes scene graph relationships using a transformer-based model.
- **Interactive Visualization**: Frontend displays scene graph, processed image, and description.
- **Modern UI**: Built with Next.js, React, Tailwind CSS, and React Flow.

---

## Architecture Overview

```
User ──> Frontend (Next.js/React) ──> Backend (FastAPI/PyTorch) ──> Deep Learning Models
```

- **Frontend**: Handles image upload, displays results, and visualizes scene graphs.
- **Backend**: Processes images, runs detection and reasoning models, and serves API endpoints.

---

## Backend Details (`backend/`)

- **main.py**: FastAPI app entry point. Sets up CORS and includes the `/predict` endpoint.
- **predict.py**: Defines the `/predict` API route. Accepts image uploads, loads models, and returns scene graph, description, and processed image.
- **services.py**: Core logic for image processing:
  - Loads YOLOv5 for object detection.
  - Scales bounding boxes to original image size.
  - Predicts relationships using heuristics and semantic likelihoods.
  - Refines relationships with GNN.
  - Draws bounding boxes and labels on images.
  - Generates a natural language summary using a transformer summarizer.
- **relationships.py**: Implements spatial and semantic relationship prediction between detected objects. Uses heuristics and semantic likelihoods from `config.py`.
- **graph_network.py**: Implements a Graph Neural Network (GNN) for advanced reasoning over scene graphs.
- **transformer_model.py**: Defines a transformer model for summarization and reasoning.
- **yolo.py**: Contains a simplified YOLOv5 model architecture for demonstration.
- **utils.py**: Utility functions for bounding box operations, non-max suppression, and checkpoint management.
- **config.py**: Lists supported relationships and semantic likelihoods for object pairs.
- **dependencies.py**: Loads and provides models (YOLO, transformer, GNN, summarizer) for API endpoints.

---

## Frontend Details (`frontend/`)

- **package.json**: Lists dependencies (Next.js, React, Tailwind CSS, React Flow, etc.).
- **app/layout.tsx**: Global layout and metadata for the app.
- **app/page.tsx**: Main UI. Allows users to upload images, view processed results, scene graphs, and descriptions.
- **hooks/useImageProcessing.ts**: Custom React hook for handling image upload, preview, analysis, and clearing.
- **lib/api.ts**: Sends image to backend `/predict` endpoint and returns results.
- **src/components/SceneGraphVisualizer.tsx**: Visualizes scene graph using React Flow, showing objects and relationships.
- **src/components/ui/button.tsx**: Custom button component with styling variants.

---

## Setup Instructions

### Backend
1. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Start the API server:
   ```bash
   uvicorn backend.main:app --reload
   ```

### Frontend
1. Install Node.js dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

---

## API Reference

### POST `/predict`
- **Description**: Accepts an image file and returns a scene graph, description, and processed image.
- **Request**: `multipart/form-data` with a single image file (`file`)
- **Response**:
  - `scene_graph`: JSON object with detected objects and relationships
  - `description`: Natural language summary of the scene
  - `processed_image`: Base64-encoded image with bounding boxes and labels

---

## Technologies Used
- **Backend**: FastAPI, PyTorch, YOLOv5, Transformers (HuggingFace), Graph Neural Networks
- **Frontend**: Next.js, React, Tailwind CSS, React Flow, Framer Motion

---

## License
MIT

---

## Acknowledgements
- [YOLOv5](https://github.com/ultralytics/yolov5)
- [HuggingFace Transformers](https://huggingface.co/transformers/)
- [React Flow](https://reactflow.dev/)

---

## Example Workflow
1. User uploads an image via the web interface.
2. Backend detects objects and predicts relationships.
3. Scene graph and description are generated and returned.
4. Frontend visualizes the scene graph and displays the description and processed image.

---

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## Contact
For questions or support, please open an issue on GitHub.
