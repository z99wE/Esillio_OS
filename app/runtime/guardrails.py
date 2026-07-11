from copy import deepcopy


class Guardrails:
    """
    Central safety and legal protection layer.

    Every AI-generated response should pass through this class
    before being returned to the frontend.

    Responsibilities
    ----------------
    • Add legal disclaimer
    • Mark AI-generated content
    • Require clinician review
    • Detect emergency keywords
    """

    DISCLAIMER = (
        "This information is AI-generated for educational purposes "
        "only. It is not a medical diagnosis, medical advice, or a "
        "substitute for consultation with a licensed healthcare "
        "professional."
    )

    EMERGENCY_KEYWORDS = {
        "heart attack",
        "stroke",
        "chest pain",
        "loss of consciousness",
        "difficulty breathing",
        "sepsis",
        "pulmonary embolism",
        "anaphylaxis",
        "internal bleeding",
        "cardiac arrest",
        "suicidal",
        "overdose",
    }

    ########################################################

    @classmethod
    def apply(cls, payload: dict) -> dict:

        result = deepcopy(payload)

        result["ai_generated"] = True

        result["educational_only"] = True

        result["requires_clinician_review"] = True

        result["medical_disclaimer"] = cls.DISCLAIMER

        ####################################################
        # Emergency detection
        ####################################################

        searchable = str(result).lower()

        emergency = any(
            keyword in searchable
            for keyword in cls.EMERGENCY_KEYWORDS
        )

        result["urgent_attention"] = emergency

        if emergency:

            result["urgent_message"] = (
                "Potential emergency-related findings were detected. "
                "If symptoms are severe, rapidly worsening, or life-"
                "threatening, seek immediate emergency medical care "
                "or contact your local emergency services."
            )

        return result