import pytest
from unittest.mock import MagicMock
from app.runtime.capabilities.task_generator import TaskGeneratorCapability, TaskGeneratorOutput, FollowUpTask

def test_task_generator_capability_success():
    # Mock LLM provider
    mock_llm = MagicMock()
    
    # Mock response
    mock_response = TaskGeneratorOutput(
        tasks=[
            FollowUpTask(
                title="Schedule Blood Test",
                description="Get CBC and Lipid panel done before next visit",
                task_type="lab_followup",
                checklist=["Fast for 12 hours before test", "Drink plenty of water"]
            )
        ]
    )
    mock_llm.invoke.return_value = mock_response
    
    capability = TaskGeneratorCapability(llm=mock_llm)
    result = capability.run(clinical_text="Patient needs a CBC and Lipid panel. Must fast for 12 hours.")
    
    assert "tasks" in result
    assert len(result["tasks"]) == 1
    assert result["tasks"][0]["title"] == "Schedule Blood Test"
    assert result["tasks"][0]["task_type"] == "lab_followup"
    assert "Fast for 12 hours before test" in result["tasks"][0]["checklist"]
    
    # Ensure llm was called
    mock_llm.invoke.assert_called_once()

def test_task_generator_capability_empty():
    mock_llm = MagicMock()
    mock_response = TaskGeneratorOutput(tasks=[])
    mock_llm.invoke.return_value = mock_response
    
    capability = TaskGeneratorCapability(llm=mock_llm)
    result = capability.run(clinical_text="Patient is doing well. No follow up needed.")
    
    assert "tasks" in result
    assert len(result["tasks"]) == 0
