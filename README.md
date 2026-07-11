# 🧬 Esillio OS

<div align="center">

# The Longitudinal Intelligence Layer for Human Health

### *Because healthcare should remember.*

---

**AMD Developer Challenge 2026**

Private • Local-first • AI Powered • Bring Your Own AI

</div>

---

# Why Esillio?

Healthcare is fragmented.

Every consultation starts from scratch.

Every lab report lives in a different PDF.

Every prescription gets forgotten.

Every doctor sees a snapshot instead of the full story.

**Esillio transforms scattered medical documents into a continuously evolving health intelligence layer that helps patients understand their longitudinal health journey.**

---

# What Esillio Does

Upload:

- Blood reports
- Prescriptions
- Clinical summaries
- Lab reports
- Consultation notes
- Medical documents

Esillio automatically:

✅ Extracts medical information

✅ Understands clinical context

✅ Generates educational wellness guidance

✅ Produces clinician-friendly summaries

✅ Builds a longitudinal health memory

✅ Updates a living medical timeline

---

# Key Features

## 🧠 Clinical Intelligence Pipeline

Every uploaded document flows through multiple AI capabilities.

```
Upload
      │
      ▼
Document Intelligence
      │
      ▼
Medical Extraction
      │
      ▼
Clinical Reasoning
      │
      ▼
Wellness Intelligence
      │
      ▼
Guardian Clinical Review
      │
      ▼
Clinical Memory
      │
      ▼
Timeline
```

---

## 🩺 Medical Extraction

Automatically extracts structured medical information including:

- Conditions
- Medications
- Symptoms
- Procedures
- Biomarkers
- Allergies
- Family History
- Lifestyle Factors
- Follow-up Recommendations

---

## 🔬 Clinical Reasoning

Generates educational clinical insights such as:

- Important findings
- Possible trends
- Questions for clinicians
- Suggested follow-up discussions
- Patient-friendly summaries

---

## 🌿 Wellness Intelligence

Creates personalized educational guidance around:

- Nutrition
- Exercise
- Sleep
- Hydration
- Preventive care
- Lifestyle improvements

---

## 🛡️ Esillio Guardian™

A second-pass clinical intelligence engine that:

- Prioritizes significant findings
- Reviews biomarker abnormalities
- Highlights possible medication concerns
- Produces executive summaries
- Generates clinician discussion points

Guardian is educational only and never replaces professional medical advice.

---

## 🧠 Clinical Memory

Instead of treating uploads independently, Esillio continuously builds a structured health memory.

Every new upload contributes to a longitudinal understanding of:

- Medical history
- Biomarker evolution
- Medication history
- Clinical events
- Health timeline

---

## 📅 Timeline Engine

Automatically creates a chronological health timeline across multiple uploads.

Instead of isolated PDFs, users see their medical journey over time.

---

# Bring Your Own AI

One of Esillio's core principles is provider independence.

Users can connect their own inference provider without modifying the application.

Supported architecture:

- Local Gemma
- OpenAI
- OpenAI-Compatible APIs
- OpenRouter
- Groq
- Lightning AI
- Future providers

The runtime automatically switches providers without restarting the application.

---

# Architecture

```text
Frontend
    │
    ▼
FastAPI Backend
    │
    ├──────────────┐
    │              │
Upload API     Settings API
    │              │
    ▼              ▼
Clinical Pipeline Runtime
    │
    ├── Medical Extraction
    ├── Clinical Reasoning
    ├── Wellness
    ├── Guardian
    └── Vision Intelligence
            │
            ▼
SQLite Clinical Memory
            │
            ▼
Timeline
```

---

# Technology Stack

## Backend

- FastAPI
- Python
- SQLite

## AI Runtime

- Local Gemma
- OpenAI Compatible Runtime
- Modular Provider Factory
- Runtime Hot Reload

## AI Capabilities

- Clinical Extraction
- Clinical Reasoning
- Wellness Intelligence
- Guardian Review
- Vision Intelligence

## Frontend

- React
- Vite
- TailwindCSS

---

# Privacy First

Esillio is designed around privacy.

Medical documents remain under user control.

Users may choose between:

- Local inference
- Self-hosted inference
- Their own AI provider
- Cloud inference using their own API key

No vendor lock-in.

---

# Medical Disclaimer

Esillio is an educational clinical intelligence platform.

It does **not** diagnose disease.

It does **not** prescribe treatment.

It does **not** replace licensed medical professionals.

Users should always consult qualified healthcare providers before making medical decisions.

---

# Roadmap

- Multi-user authentication
- FHIR interoperability
- Wearables integration
- Clinical Graph Database
- Longitudinal biomarker analytics
- Patient-to-provider sharing
- Local multimodal vision models
- Medical RAG
- Differential timeline comparison

---

# Repository Structure

```
app/

api/
runtime/
services/
storage/
memory/
timeline/
compiler/
schemas/

uploads/
```

---

# Running Locally

## Backend

```bash
pip install -r requirements.txt

uvicorn app.main:app --reload
```

## Frontend

```bash
npm install

npm run dev
```

---

# API Overview

| Endpoint | Purpose |
|-----------|----------|
| `/upload` | Upload medical documents |
| `/events` | Clinical events |
| `/timeline` | Health timeline |
| `/compiler` | Biological compiler |
| `/settings/ai` | Bring Your Own AI configuration |
| `/clinical_memory` | Longitudinal clinical memory |

---

# Vision

Healthcare shouldn't begin from zero every appointment.

Esillio gives patients a continuously evolving, structured health memory that grows with every medical interaction.

---

<div align="center">

### Built for the AMD Developer Challenge 2026

**Because your body remembers.**

</div>
