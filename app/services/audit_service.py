import uuid
import logging
from datetime import datetime
from app.storage.supabase_client import supabase

logger = logging.getLogger(__name__)

class AuditService:
    def log_action(self, user_id: str, action: str, resource_type: str | None = None, resource_id: str | None = None, metadata: dict | None = None):
        if not supabase:
            logger.warning(f"Audit log skipped (no supabase client): {action} by {user_id}")
            return
            
        try:
            data = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "action": action,
                "resource_type": resource_type,
                "resource_id": resource_id,
                "metadata": metadata or {},
                "created_at": datetime.now().isoformat()
            }
            supabase.table("audit_logs").insert(data).execute()
        except Exception as e:
            logger.error(f"Failed to write audit log: {e}")

audit_service = AuditService()
