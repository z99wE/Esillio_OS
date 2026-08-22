"""
Shared pytest fixtures and markers for the EsiWell backend test suite.

Several contract tests exercise endpoints that require a configured Supabase
backend (data export, account deletion, admin metrics). In CI there is no
Supabase available, so those tests are skipped rather than failing.
"""
import pytest

from app.storage.supabase_client import supabase

# Skip integration tests when no Supabase backend is configured
# (e.g. in CI, where no .env / credentials are present).
requires_supabase = pytest.mark.skipif(
    supabase is None,
    reason="Supabase backend not configured",
)
