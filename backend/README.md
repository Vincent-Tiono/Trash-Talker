# Trash-Talker Backend

This document provides instructions on how to set up and run the Trash-Talker backend server.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Setup Instructions

### 1. Navigate to the Backend Directory

```bash
cd backend
```

### 2. Set Up a Virtual Environment (Optional but Recommended)

```bash
python -m venv venv
```

Activate the virtual environment:

- On Windows:
```bash
venv\Scripts\activate
```

- On macOS/Linux:
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirement.txt
```

### 4. Run the Server

Start the FastAPI server using uvicorn:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at http://127.0.0.1:8000

- `--reload`: Enables auto-reload when code changes (development mode)
- You can add `--host 0.0.0.0` to make the server accessible on your local network

## API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## Environment Variables

The backend may require certain environment variables to be set. Please check the `app/core/config.py` file for details on required environment variables.