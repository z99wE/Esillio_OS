import logging
from typing import Any, Dict

from app.memory import clinical_memory

from app.esiwell.engine import get_esiwell

from app.runtime.capabilities import (
    MedicalExtractionCapability,
    ClinicalReasoningCapability,
    WellnessCapability,
    ClinicalGuardianCapability,
)

logger = logging.getLogger(__name__)


class ClinicalPipeline:
    """
    Esillio Clinical Intelligence Pipeline

    Flow

        Medical Extraction
                ↓
             EsiWell
                ↓
        Clinical Reasoning
                ↓
            Wellness
                ↓
            Guardian
                ↓
        Clinical Memory
    """

    def __init__(self):

        self.medical_extractor = MedicalExtractionCapability()

        self.esiwell = get_esiwell()

        self.reasoner = ClinicalReasoningCapability()

        self.wellness = WellnessCapability()

        self.guardian = ClinicalGuardianCapability()

    ############################################################

    def process(
        self,
        document_text: str,
        patient_id: str = "anonymous",
    ) -> Dict[str, Any]:

        results = {}

        errors = []

        ########################################################
        # Medical Extraction
        ########################################################

        extraction = {}

        try:

            logger.info(
                "Running Medical Extraction..."
            )

            extraction = self.medical_extractor.run(
                document_text
            )

            results["medical_extraction"] = extraction

        except Exception:

            logger.exception(
                "Medical Extraction failed."
            )

            errors.append(
                "Medical Extraction failed."
            )

            results["medical_extraction"] = {}

        ########################################################
        # EsiWell Runtime
        ########################################################

        try:

            logger.info(
                "Running EsiWell..."
            )

            extraction = self.esiwell.enrich(
                extraction
            )

            results["esiwell"] = extraction.get(
                "esiwell",
                {},
            )

        except Exception:

            logger.exception(
                "EsiWell failed."
            )

            errors.append(
                "EsiWell failed."
            )

            results["esiwell"] = {}

        ########################################################
        # Clinical Reasoning
        ########################################################

        reasoning = {}

        try:

            logger.info(
                "Running Clinical Reasoning..."
            )

            reasoning = self.reasoner.run(
                extraction
            )

            results["clinical_reasoning"] = reasoning

        except Exception:

            logger.exception(
                "Clinical Reasoning failed."
            )

            errors.append(
                "Clinical Reasoning failed."
            )

            results["clinical_reasoning"] = {}

        ########################################################
        # Wellness
        ########################################################

        wellness = {}

        try:

            logger.info(
                "Running Wellness..."
            )

            wellness = self.wellness.run(
                extraction
            )

            results["wellness"] = wellness

        except Exception:

            logger.exception(
                "Wellness failed."
            )

            errors.append(
                "Wellness failed."
            )

            results["wellness"] = {}

        ########################################################
        # Guardian
        ########################################################

        guardian = {}

        try:

            logger.info(
                "Running Guardian..."
            )

            guardian = self.guardian.run(
                extraction
            )

            results["guardian"] = guardian

        except Exception:

            logger.exception(
                "Guardian failed."
            )

            errors.append(
                "Guardian failed."
            )

            results["guardian"] = {}

        ########################################################
        # Clinical Memory
        ########################################################

        memory = {}

        try:

            logger.info(
                "Updating Clinical Memory..."
            )

            from app.memory.clinical_memory import get_memory
            memory_instance = get_memory(patient_id)

            memory = memory_instance.update(
                extraction=extraction,
                reasoning=reasoning,
                wellness=wellness,
            )

            results["clinical_memory"] = memory

        except Exception:

            logger.exception(
                "Clinical Memory update failed."
            )

            errors.append(
                "Clinical Memory update failed."
            )

            results["clinical_memory"] = {}

        ########################################################

        results["pipeline_status"] = (

            "success"

            if not errors

            else "partial_success"

        )

        results["errors"] = errors

        return results


pipeline = ClinicalPipeline()