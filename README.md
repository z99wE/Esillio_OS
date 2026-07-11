# Esillio OS

> **The Persistence Layer for Human Biology.**
>
> **Your body remembers.**

Esillio is a local-first health memory compiler built for the AMD Developer Hackathon: ACT II (Unicorn Track).

It converts scattered health artifacts — PDFs, clinical notes, lab results, supplements, symptoms, wearables — into a private biological continuity graph that stays on-device.

## Why this exists

Healthcare is fragmented into snapshots.
Esillio turns those snapshots into continuity.

## Core features

- Local-first health memory compiler
- Timeline of biomarkers, medications, symptoms, and notes
- Glassmorphism UI for the hackathon demo
- AMD-accelerated model prep story
- Optional informational pill interaction checker
- Strong privacy/disclaimer layer

## Tech stack

- FastAPI
- React + Vite
- Tailwind CSS
- Docker
- SQLite
- ChromaDB
- Transformers / open-source models
- AMD GPU development workflow

## Running locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docker

```bash
docker compose up --build
```

## Notes

This project is an informational health memory system, not medical advice.
Always verify medication interactions and clinical decisions with a qualified professional.
