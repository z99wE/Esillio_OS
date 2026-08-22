from supabase import create_client, Client
from app.config import settings

def get_supabase_client() -> Client:
    url: str = settings.SUPABASE_URL
    key: str = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
    if not url or not key:
        raise ValueError("SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY must be set in environment variables (.env)")
    return create_client(url, key)

try:
    supabase: Client = get_supabase_client()
except ValueError:
    # Allow the app to start without Supabase for tests or until configured
    supabase = None
