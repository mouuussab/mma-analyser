# RIVUS

RIVUS is an AI-powered web app for exploring, transforming, and visualizing MMA-related data.

It combines:
- **Python backend** for data processing and API routes
- **React + Vite frontend** for interactive analysis and charts
- **Agent-style workflows** to help derive insights from raw datasets

---

## Run in Development Mode

### 1) Install dependencies

```bash
uv sync
yarnpkg install
```

### 2) Start backend (terminal 1)

```bash
uv run rivus-ai --dev
```

### 3) Start frontend (terminal 2)

```bash
yarnpkg start
```

Open the app at: **http://localhost:5173**

---

## Requirements

- Python 3.11+
- [uv](https://docs.astral.sh/uv/)
- Node.js + npm
- yarnpkg

---

## Notes

- `--dev` runs backend-only mode for local frontend development.
- Frontend requests are proxied to the backend through Vite config.
