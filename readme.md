# EquityExplorer

A full-stack stock market explorer built with **React + TypeScript** (frontend) and **FastAPI + Python** (backend), powered by the yfinance API.

---

## Project Structure

```
SWE_final_project/
├── Frontend/
│   └── EquityExplorer/        # React + Vite app
└── Backend/
    └── Python/                # FastAPI server
```

---

## Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.9 or higher)
- pip (comes with Python)

---

## Backend Setup (FastAPI)

### 1. Navigate to the backend directory

```bash
cd Backend/Python
```

### 2. (Optional but recommended) Create a virtual environment

```bash
python -m venv venv
```

Activate it:

- **Windows:**
  ```bash
  venv\Scripts\activate
  ```
- **Mac/Linux:**
  ```bash
  source venv/bin/activate
  ```

### 3. Install dependencies

```bash
pip install fastapi uvicorn yfinance
```

### 4. Run the FastAPI server

```bash
python -m fastapi dev main.py
```

To expose it on your local network (accessible from other devices):

```bash
python -m fastapi dev main.py --host 0.0.0.0
```

The API will be available at:
- Local: `http://127.0.0.1:8000`
- Network: `http://<your-ip>:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

---

## Frontend Setup (React + Vite)

### 1. Navigate to the frontend directory

```bash
cd Frontend/EquityExplorer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the React development server

```bash
npm run dev
```

To expose it on your local network (accessible from other devices):

```bash
npm run dev -- --host
```

The app will be available at:
- Local: `http://localhost:5173`
- Network: `http://<your-ip>:5173`

---

## Running Both Servers

You need **two terminal windows** running simultaneously:

**Terminal 1 — Backend:**
```bash
cd Backend/Python
python -m fastapi dev main.py
```

**Terminal 2 — Frontend:**
```bash
cd Frontend/EquityExplorer
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/stock/{symbol}` | Get stock info for a ticker |
| GET | `/api/timeseries/{symbol}` | Get historical price data |

### Query Parameters for `/api/timeseries/{symbol}`

| Parameter | Default | Options |
|-----------|---------|---------|
| `period` | `1mo` | `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `2y`, `5y`, `max` |
| `interval` | `1d` | `1m`, `5m`, `15m`, `1h`, `1d`, `1wk`, `1mo` |

**Example:**
```
GET http://127.0.0.1:8000/api/timeseries/AAPL?period=6mo&interval=1wk
```

---

## Common Issues

**`fastapi` is not recognized**
→ Use `python -m fastapi dev main.py` instead of `fastapi dev`

**Failed to fetch / CORS error**
→ Make sure the FastAPI server is running and CORS middleware is configured in `main.py`

**`recharts` or other packages not found**
→ Make sure you ran `npm install` inside the `Frontend/EquityExplorer` directory