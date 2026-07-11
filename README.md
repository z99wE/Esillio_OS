<div align="center">

# 🧬 Esillio OS

### The Longitudinal Intelligence Layer for Human Health

*Because healthcare should remember.*

---

**AMD Developer Challenge 2026** · Local-First · Private · Bring Your Own AI

</div>

---

## Why Esillio?

Healthcare is fragmented.

Every consultation starts from scratch. Every lab report lives in a different PDF. Every prescription gets forgotten. Every doctor sees a snapshot instead of the full story.

**Esillio transforms scattered medical documents into a continuously evolving health intelligence layer — a persistent biological memory that grows with every medical interaction.**

---

## AMD Compute & Local AI Architecture

> **Use high-performance GPU infrastructure to build and optimise the intelligence once, then deploy it as a completely local-first application.**

Rather than relying on permanent cloud inference, Esillio uses AMD GPU compute during **development and optimisation** while allowing end users to retain full ownership of their health data without recurring cloud costs.

The GPU-accelerated optimisation pipeline includes:

| Phase | Description |
|---|---|
| Preprocessing | Synthetic longitudinal health datasets |
| Embedding generation | Vectorisation of medical documents |
| Inference benchmarking | Latency & throughput profiling |
| Model evaluation | Accuracy assessment across document types |
| Local model packaging | Preparing optimised weights for local deployment |
| Quantisation experiments | INT4/INT8 compression for CPU inference |
| Compiler validation | End-to-end BCC pipeline correctness checks |

This enables the application to remain lightweight while preserving full local inference capability on any machine.

---

## Biological Continuity Compiler™

The core technology behind Esillio is the **Biological Continuity Compiler™ (BCC)**.

Instead of treating health documents as isolated files, the compiler converts heterogeneous medical information into a unified structured representation.

```
Blood Test Report   →
Clinical Note       →   Biological Continuity Compiler™   →   HealthEvent   →   Timeline
Medication Log      →
Wearable Summary    →
```

**Supported input types:**

- Blood test reports
- Clinical notes & consultation summaries
- Symptom logs
- Medication history & prescriptions
- Lifestyle events
- Wearable summaries
- Nutrition records

Each document is transformed into a normalised **HealthEvent** object with a canonical schema:

```json
{
  "id": "evt-001",
  "title": "HbA1c Check",
  "date": "2026-06-15",
  "category": "Biomarker",
  "description": "HbA1c at 5.6%, within normal range...",
  "tags": ["Blood Test", "Routine"]
}
```

---

## Biological Continuity Graph™

Every compiled HealthEvent contributes to a persistent graph describing long-term biological history.

```
               ┌──────────────────────────────────┐
               │   Biological Continuity Graph™   │
               └──────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   Biomarkers         Symptoms         Medications
        │                 │                 │
  Activities           Sleep         Clinical Events
        │
   Nutrition
```

This graph enables **longitudinal reasoning** instead of isolated document analysis — allowing the system to detect trends, flag anomalies, and generate advice grounded in a patient's actual history.

---

## Local-First AI

Esillio intentionally avoids cloud-dependent health inference.

| Feature | Status |
|---|---|
| Local document processing | ✅ |
| Offline health memory | ✅ |
| Local timeline generation | ✅ |
| Local semantic search (ChromaDB) | ✅ |
| Local structured health graph | ✅ |
| Zero recurring inference infrastructure | ✅ |

Users retain complete ownership of their data. No health information ever leaves the machine unless the user explicitly chooses to connect a cloud inference key.

---

## What Esillio Does

Upload any of the following:

- Blood reports
- Prescriptions
- Clinical summaries
- Lab reports
- Consultation notes
- Medical documents
- Voice notes (Web Speech API)

Esillio automatically:

✅ Extracts medical information via the BCC pipeline  
✅ Understands clinical context with structured reasoning  
✅ Generates educational wellness guidance via multi-agent orchestration  
✅ Produces clinician-friendly summaries  
✅ Builds a longitudinal health memory  
✅ Updates a living, queryable medical timeline  

---

## Clinical Intelligence Pipeline

```
Upload
  │
  ▼
Document Intelligence (OCR + Parsing)
  │
  ▼
Medical Extraction (Conditions, Medications, Biomarkers, Symptoms)
  │
  ▼
Clinical Reasoning (Trends, Flags, Follow-up Suggestions)
  │
  ▼
Wellness Intelligence (Nutrition, Exercise, Sleep, Lifestyle)
  │
  ▼
Esillio Guardian™ (Second-pass Safety & Priority Review)
  │
  ▼
Clinical Memory (SQLite + ChromaDB)
  │
  ▼
Timeline Engine
```

---

## Modular Agent Architecture

Esillio separates reasoning into independent specialised agents:

| Agent | Responsibility |
|---|---|
| **Biological Continuity Compiler** | Document → HealthEvent transformation |
| **Timeline Agent** | Chronological event ordering & display |
| **Health Memory Agent** | Persistent semantic memory via ChromaDB |
| **Biomarker Agent** | Lab result extraction & trend analysis |
| **Medication Information Agent** | Drug interactions & prescription logging |
| **Trend Detection Agent** | Longitudinal pattern detection |
| **EsiDiet** | Nutrition & dietary planning |
| **EsiActive** | Fitness & mobility planning |
| **EsiCalm** | Mental wellness & stress management |

This modular design allows future capabilities to be added without changing the underlying data model.

---

## EsiWell Orchestrator

The **EsiWell Orchestrator** is Esillio's multi-agent wellness interface.

When a user submits a lifestyle or wellness query, the orchestrator:

1. Reads the patient's compiled medical timeline from context
2. Injects it as grounding context into a system prompt with prompt injection guardrails
3. Dispatches the query to three specialised agents simultaneously
4. Returns personalised, evidence-grounded responses from each agent

With an API key connected, the orchestrator leverages your chosen inference provider. Without one, a demo fallback returns patient-specific responses grounded in their timeline data.

---

## Bring Your Own AI

Esillio is provider-agnostic. Connect your own inference key in the Settings page:

| Provider | Supported |
|---|---|
| OpenAI (GPT-4o, GPT-4) | ✅ |
| Anthropic (Claude) | ✅ |
| Google Gemini | ✅ |
| Local Ollama / LM Studio | ✅ |
| OpenRouter | ✅ |
| Groq | ✅ |
| Any OpenAI-compatible API | ✅ |

API keys are stored in browser localStorage and injected as request headers — never sent to any third-party server.

---

## Privacy by Design

Esillio was designed with privacy as a first principle.

- **Local-first processing** — documents never leave the machine by default
- **No mandatory cloud storage** — SQLite is your database
- **User-controlled data** — you own every bit
- **Offline-capable architecture** — works without internet
- **Portable SQLite storage** — single file, easy backup
- **Local semantic memory** — ChromaDB runs entirely on-device
- **Prompt injection guardrails** — system prompts are hardened against manipulation

---

## Architecture Overview

```
┌──────────────────────────────────────────┐
│             React / Vite Frontend        │
│  Timeline · Upload · Intelligence ·      │
│  EsiWell Orchestrator · Settings         │
└──────────────────┬───────────────────────┘
                   │ HTTP / REST
┌──────────────────▼───────────────────────┐
│            FastAPI Backend               │
│                                          │
│  /upload  /timeline  /esiwell/compile    │
│  /memory  /settings/ai  /events          │
└──────┬──────────────────────┬────────────┘
       │                      │
┌──────▼──────┐      ┌────────▼────────────┐
│   SQLite    │      │   ChromaDB          │
│  (Events,  │      │  (Semantic Memory,  │
│  Timeline) │      │   Vector Search)    │
└─────────────┘      └─────────────────────┘
       │
┌──────▼─────────────────────────────────────┐
│       Biological Continuity Compiler™      │
│                                            │
│  BCC · Timeline Agent · Memory Agent      │
│  Biomarker Agent · Medication Agent       │
│  Trend Agent · Guardian™                  │
└──────────────────────────────────────────┘
       │
┌──────▼─────────────────────────┐
│   Inference Runtime (BYOAI)    │
│  OpenAI · Anthropic · Gemini   │
│  Local (Ollama / LM Studio)    │
└────────────────────────────────┘
```

---

## Technology Stack

### Backend

- **Python 3.11+**
- **FastAPI** — async REST API
- **SQLite** — portable local persistence
- **ChromaDB** — local vector / semantic memory
- **Transformers** — local embedding generation

### Frontend

- **React 18** + **Vite**
- **TailwindCSS** — utility-first styling
- **HealthContext** — shared global patient state
- **Web Speech API** — browser-native audio dictation

### AI / ML

- Local Gemma / Ollama compatible models
- OpenAI-compatible runtime abstraction
- Modular provider factory with runtime hot reload

### Infrastructure

- Docker-ready deployment (`docker/`)
- `.env`-based configuration
- Offline-capable by default

---

## Repository Structure

```
Esillio-Latest/
│
├── app/                        # FastAPI backend
│   ├── api/                    # Route handlers
│   ├── compiler/               # Biological Continuity Compiler™
│   ├── runtime/                # BYOAI provider abstraction
│   ├── services/               # Business logic
│   ├── storage/                # SQLite layer
│   ├── memory/                 # ChromaDB semantic memory
│   ├── timeline/               # Timeline engine
│   └── schemas/                # Pydantic data models
│
├── web/                        # React / Vite frontend
│   └── src/
│       ├── pages/              # Timeline, Upload, Intelligence, EsiWell
│       ├── components/         # GlassCard, Layout, Sidebar
│       ├── context/            # HealthContext (global state)
│       ├── api/                # axios client + interceptors
│       └── utils/              # dummyData, helpers
│
├── Esillio-Compiler/           # AMD GPU optimisation pipeline
├── models/                     # Local model weights
├── data/                       # Synthetic training data
├── docker/                     # Docker configuration
├── docs/                       # Documentation
├── assets/                     # Branding assets
├── .env.example                # Environment template
└── README.md
```

---

## Running Locally

### Prerequisites

- Python 3.11+
- Node.js 18+
- (Optional) Ollama for local inference

### Backend

```bash
cd Esillio-Latest

cp .env.example .env
# Edit .env — set your BYOAI keys if desired

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend available at `http://localhost:8000`

### Frontend

```bash
cd web

npm install

npm run dev
```

Frontend available at `http://localhost:5173`

The app runs in **Demo Mode** automatically if the backend is unreachable — all pages will display rich patient data without any configuration.

---

## API Reference

| Endpoint | Method | Purpose |
|---|---|---|
| `/upload` | POST | Upload medical documents |
| `/events` | GET | List compiled HealthEvents |
| `/timeline` | GET | Chronological health timeline |
| `/esiwell/compile` | POST | Multi-agent wellness orchestration |
| `/memory/current` | GET | Current clinical memory state |
| `/settings/ai` | GET/POST | BYOAI provider configuration |

---

## Future Optimisation Path

The architecture is designed to support continued optimisation of the Biological Continuity Compiler using open-weight models.

Planned improvements:

- Improved document extraction accuracy
- Faster local embedding generation
- INT4/INT8 model quantisation for CPU deployment
- Multimodal health document understanding (charts, handwriting)
- Richer longitudinal reasoning with graph traversal
- FHIR interoperability
- Wearables integration (Apple Health, Garmin)
- Patient-to-provider secure sharing
- Differential timeline comparison

Because inference remains local-first, these improvements can be distributed without requiring permanent cloud infrastructure.

---

## Roadmap

- [ ] Multi-user authentication
- [ ] FHIR interoperability
- [ ] Wearables integration
- [ ] Clinical Graph Database
- [ ] Longitudinal biomarker analytics
- [ ] Patient-to-provider sharing
- [ ] Local multimodal vision models
- [ ] Medical RAG with semantic chunking
- [ ] Differential timeline comparison
- [ ] Offline PWA packaging

---

## Medical Disclaimer

Esillio is an **educational** clinical intelligence platform.

It does **not** diagnose disease.  
It does **not** prescribe treatment.  
It does **not** replace licensed medical professionals.  

Users should always consult qualified healthcare providers before making any medical decisions.

---

<div align="center">

### Built for the AMD Developer Challenge 2026

**Because your body remembers.**

*Private · Local-First · GPU-Optimised · Bring Your Own AI*

</div>
