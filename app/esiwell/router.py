import logging
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends
from app.api.auth import get_current_user

from .schemas import CompileRequest, ChatRequest

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/esiwell",
    tags=["EsiWell"]
)

###############################################################
# Local classifier fallback (offline / no API key)
###############################################################

_classifier = None

def _get_classifier():
    """
    Lazily load the local transformers classifier.
    Returns None if model files don't exist.
    """
    global _classifier
    if _classifier is not None:
        return _classifier

    model_dir = Path(__file__).parent / "model"
    if not model_dir.exists():
        return None

    try:
        from transformers import pipeline as hf_pipeline
        _classifier = hf_pipeline(
            "text-classification",
            model=str(model_dir),
            tokenizer=str(model_dir),
        )
        logger.info("Local EsiWell classifier loaded.")
        return _classifier
    except Exception:
        logger.warning("Local classifier unavailable.", exc_info=True)
        return None


def _local_classify(text: str) -> dict:
    """
    Run the local classifier and return a human-readable result dict.
    """
    classifier = _get_classifier()
    if classifier is None:
        return {
            "source": "demo",
            "category": "Health Event",
            "summary": (
                "Your document has been received. Connect an AI provider in "
                "Settings to unlock full clinical intelligence."
            ),
        }

    result = classifier(text[:512])[0]  # truncate for speed
    label = result["label"]

    # Map raw model labels to readable strings
    label_map = {
        "routine_checkup": "Routine Check-up",
        "blood_test": "Blood Test",
        "medication_change": "Medication Update",
        "chronic_condition": "Chronic Condition Management",
        "acute_event": "Acute Health Event",
        "wellness": "Wellness Event",
        "LABEL_0": "Health Event",
        "LABEL_1": "Clinical Finding",
        "LABEL_2": "Medication Record",
    }
    readable = label_map.get(label, label.replace("_", " ").title())

    return {
        "source": "local_model",
        "category": readable,
        "summary": (
            f"This document has been classified as: {readable}. "
            "Connect an AI provider in Settings for full multi-agent intelligence."
        ),
    }


###############################################################
# Multi-agent orchestration via runtime engine
###############################################################

def _run_orchestration(request: CompileRequest) -> dict:
    """
    Route the request through the configured AI runtime engine.
    Constructs the full prompt from system_prompt + patient_context + user text.
    Falls back to local classifier on any error.
    """
    from app.runtime.engine import get_runtime

    runtime = get_runtime()

    # Detect stub provider (no key configured)
    provider = runtime.provider
    if hasattr(provider, "__class__") and provider.__class__.__name__ == "_StubProvider":
        # No key — fall back to local classifier and return hint
        local = _local_classify(request.text)
        local["ai_response"] = provider.generate("")
        return local

    import concurrent.futures

    def _call_agent(agent_name: str, role_desc: str) -> str:
        parts = [
            f"You are {agent_name}, an expert in {role_desc}. You are part of the Esillio Health orchestration team.",
            "Rules:",
            "1. Ground your response in the patient's medical timeline.",
            "2. Write a substantial 3-4 paragraph response.",
            "3. Never diagnose or prescribe. Be therapeutic and educational.",
        ]
        if request.system_prompt:
            parts.append(f"\nUser System Prompt Override: {request.system_prompt}")

        if request.patient_context:
            parts.append(f"\n\n--- PATIENT CONTEXT ---\n{request.patient_context}\n--- END CONTEXT ---\n")

        parts.append(f"\nUser message: {request.text}")
        full_prompt = "\n".join(parts)
        
        try:
            return runtime.analyze_text(prompt=full_prompt)
        except Exception as e:
            logger.exception(f"{agent_name} failed.")
            return f"Error connecting to {agent_name}: {str(e)}"

    agent_configs = {
        "EsiDiet": "Nutrition, diet planning, food choices, hydration",
        "EsiActive": "Fitness, movement, exercise, mobility, rehabilitation",
        "EsiCalm": "Mental wellness, stress management, sleep, emotional health",
    }
    
    agent_responses = {}
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            future_to_agent = {
                executor.submit(_call_agent, name, desc): name
                for name, desc in agent_configs.items()
            }
            for future in concurrent.futures.as_completed(future_to_agent):
                agent_name = future_to_agent[future]
                try:
                    agent_responses[agent_name] = future.result()
                except Exception as exc:
                    agent_responses[agent_name] = f"Agent failed: {exc}"

        # Build fallback ai_response string to not break old frontend versions
        ai_response_str = "\n\n".join(f"{k}:\n{v}" for k, v in agent_responses.items())

        return {
            "source": "ai_runtime",
            "ai_response": ai_response_str,
            "agent_responses": agent_responses,
            "patient_id": request.patient_id,
        }
    except Exception:
        logger.exception("AI runtime orchestration failed — falling back to local classifier.")
        result = _local_classify(request.text)
        result["error"] = "AI runtime unavailable. Showing local classification."
        return result


###############################################################
# Routes
###############################################################

@router.post("/compile")
def compile_health_note(request: CompileRequest, user_id: str = Depends(get_current_user)):
    """
    Primary multi-agent endpoint.
    
    Routes through the configured AI provider (OpenAI, Gemini, Ollama, etc.)
    with the full system prompt + patient context. Falls back to the local
    transformers classifier if no provider is configured.
    """
    request.patient_id = user_id
    return _run_orchestration(request)


@router.post("/chat")
def chat_with_documents(request: ChatRequest, user_id: str = Depends(get_current_user)):
    """
    Free-form chat with the patient's compiled health documents.

    The patient context (timeline / memory summary) is injected as background
    so the AI responds grounded in the patient's actual history.
    """
    system_prompt = (
        "You are Esillio, a personal health intelligence assistant. "
        "You have access to the patient's compiled health history provided below. "
        "Answer the user's question based on their specific health context. "
        "Be clear, empathetic, and educational. Never diagnose or prescribe. "
        "If you are unsure, tell the user to consult a healthcare professional. "
        "Keep responses thorough, grounded in the patient's actual data, and avoid generic answers."
    )

    compile_req = CompileRequest(
        text=request.message,
        system_prompt=system_prompt,
        patient_context=request.patient_context,
        patient_id=user_id,
    )

    return _run_orchestration(compile_req)


@router.get("/health")
def esiwell_health():
    """Health check for the EsiWell service."""
    from app.runtime.engine import get_runtime
    runtime = get_runtime()
    provider_class = runtime.provider.__class__.__name__
    return {
        "status": "healthy",
        "provider": provider_class,
        "ai_ready": provider_class != "_StubProvider",
    }
