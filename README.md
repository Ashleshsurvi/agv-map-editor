Mujin AGV Map Editor

This project is a full-stack web application for editing Automated Guided Vehicle (AGV) maps.  
It provides a React and TypeScript frontend, as well as a Django REST backend.


Features

 Create, edit, and delete AGV nodes on a map  
 Import/export JSON map files  
 REST API backend  
 Dockerized frontend and backend  
 Automated frontend and backend tests  
 Zoom, pan, and drag support in the editor

Project Structure

AGVMAP/
├── agv_backend/ # Django backend
├── mujin-map-editor/ # React frontend
├── docker-compose.yml # Docker orchestration
└── README.md

Prerequisites

Docker installed

Steps
	
Step1:  “docker compose up --build”   (**Build and start containers**)

Step2:  Access the app:
Frontend: http://localhost:4173


Backend API: http://localhost:8000/api/NodeList/
Step3: Stopping containers:
	docker compose down  (in another terminal)


Running Locally Without Docker
Backend:
cd agv_backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend:
cd mujin-map-editor
npm install
npm run dev

NOTE: 
Frontend will start at http://localhost:5173


Backend API will be at http://localhost:8000/api/NodeList/


Running Tests
Frontend Tests:
cd mujin-map-editor
npm run test

Backend Tests:
cd agv_backend
python manage.py test
Example Map File Format

{
  "map": {
    "maxNeighborDistance": 1500,
    "nodes": [
      {
        "x": 1000,
        "y": 1000,
        "code": 10001000,
        "directions": ["North"]
      },
      {
        "x": 1000,
        "y": 6510,
        "code": 10001070,
        "directions": ["East"],
        "name": "CHUTE",
        "chute": { "direction": "North" }
      }
    ]
  }
}


REST API Endpoints
GET /api/NodeList/ — List all nodes
POST /api/NodeList/ — Create node
PUT /api/NodeUpdate/<id>/ — Update node
DELETE /api/NodeDelete/<code>/ — Delete node
DELETE /api/NodeClear/ — Clear all nodes
POST /api/NodeBulkImport/ — Import nodes in bulk

Docker Compose Overview

The docker-compose.yml sets up:
Frontend container: Node & Vite build


Backend container: Django server


Exposes ports 4173 (frontend) and 8000 (backend)

Tips

If you see CORS errors, confirm your CORS_ALLOWED_ORIGINS in agv_backend/settings.py includes your frontend URL:

CORS_ALLOWED_ORIGINS = [
    "http://localhost:4173"
]

Always rebuild Docker images after major changes:

docker compose up --build


Author
Ashlesh Survi
