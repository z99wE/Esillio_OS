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

## AMD Compute & Gemma 4 Architecture

> **Esillio OS leverages AMD Instinct™ accelerators via ROCm to deploy Gemma 4 locally, ensuring healthcare AI remains completely sovereign, incredibly fast, and uncompromised on privacy.**

Rather than relying on permanent cloud inference with recurring costs and massive data privacy risks, Esillio uses AMD GPU compute to run **Gemma 4** locally. This forms the bedrock of our business model—delivering high-performance, private health reasoning without exposing PHI (Personal Health Information) to third-party APIs.

The AMD-powered pipeline includes:

| Phase | Description |
|---|---|
| Hardware Target | AMD Instinct™ GPUs using ROCm for uncompromising local performance |
| Foundational Model | **Gemma 4** (4-bit quantised) serving as the core clinical reasoning engine |
| Preprocessing | Synthetic longitudinal health datasets compiled locally |
| Embedding generation | Vectorisation of medical documents using ROCm-accelerated Transformers |
| Inference benchmarking | Low-latency inference ideal for rapid multi-agent execution |
| Local model packaging | Preparing highly optimised Gemma 4 weights for edge deployment |

This architecture ensures Esillio OS runs effortlessly on scalable hardware, forming a robust foundation for our B2B2C go-to-market strategy.

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
✅ **Clinician One-Pager:** Generates instant, physician-ready printable summaries of top conditions, medications, and biomarkers.  
✅ **Proactive Anomaly Detection:** Monitors biomarker trajectories to automatically flag deteriorating trends with actionable AI insights.  
✅ **Wearables Integration:** Parses Apple Health & Oura CSV exports seamlessly into the clinical timeline.  
✅ Generates educational wellness guidance via multi-agent orchestration  
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

## Strategic Advantage & Ecosystem

While Esillio is deeply committed to a private, local-first consumer experience, this architecture inherently creates a powerful distribution wedge. By solving the "cold start" problem of fragmented health history, Esillio transforms scattered documents into high-signal structured data.

This high-retention, patient-owned data ecosystem unlocks massive B2B2C potential. Empowered patients become the ultimate integration point for wearable manufacturers, digital therapeutics, clinical trials, and telemedicine platforms. By prioritizing the user first, Esillio builds a scalable, highly defensible intelligence layer positioned at the center of the modern health economy.

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

## Quickstart: Running via Docker

For the AMD Developer Challenge 2026, the entire application is containerized and extremely simple to run.

### Prerequisites

- Docker and Docker Compose installed on your system.

### Startup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/z99wE/Esillio_OS.git
   cd Esillio_OS
   ```

2. **Launch the containers:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - **Frontend:** http://localhost:5173
   - **Backend API Docs:** http://localhost:8000/docs

The application will automatically boot in **Demo Mode**, populated with rich patient data, ensuring judges can evaluate the UI, architecture, and UX immediately without requiring API keys.

---

## API Reference

| Endpoint | Method | Purpose |
|---|---|---|
| `/upload` | POST | Upload medical documents |
| `/upload/csv` | POST | **[NEW]** Import Apple Health / Oura CSV data |
| `/events` | GET | List compiled HealthEvents |
| `/timeline` | GET | Chronological health timeline |
| `/esiwell/compile` | POST | Multi-agent wellness orchestration |
| `/export/clinician` | GET | **[NEW]** Generate JSON for physician-ready summaries |
| `/intelligence/trends` | GET | **[NEW]** AI-powered biomarker anomaly detection |
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

- [x] Multi-user authentication (100% Free SQLite JWT Auth)
- [x] Wearables integration (Apple Health, Oura CSV exports)
- [x] Longitudinal biomarker analytics (Proactive Trend Detection)
- [x] Clinician-ready export functionality (Printable One-Pager)
- [ ] FHIR interoperability
- [ ] Clinical Graph Database
- [ ] Patient-to-provider sharing
- [ ] Local multimodal vision models
- [ ] Medical RAG with semantic chunking
- [ ] Differential timeline comparison
- [ ] Offline PWA packaging

---

## 🚀 Zero-Cost Global Deployment (Hobby Plan)

Esillio OS can be deployed completely for free without any credit card, maintaining its local-first privacy architecture:

### 1. Backend: Hugging Face Spaces (Free)
Hugging Face gives you a Docker environment with 16GB of RAM absolutely for free.
- Go to [Hugging Face Spaces](https://huggingface.co/spaces) and create a **Docker** Space.
- Link it to your GitHub repository.
- The included `Dockerfile` will automatically start the FastAPI backend.
- (Optional) Enable **Persistent Storage** for `/data` in Space Settings to persist `esillio.db`.

### 2. Frontend: Vercel (Free)
Vercel's Hobby plan is free forever for personal projects.
- Import your repository on Vercel.
- Framework Preset: **Vite**, Root Directory: **web**
- Set `VITE_API_URL` to your Hugging Face Space URL.
- Deploy.

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
