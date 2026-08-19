import json
import uuid
from datetime import datetime, timezone

from app.config import settings
from app.storage.supabase_client import supabase


class UsageService:
    """
    Tracks daily AI usage so the app can stay cost-bounded.
    """

    def _today(self) -> str:
        return datetime.now(timezone.utc).date().isoformat()

    def _limit_for(self, user_id: str) -> int:
        if settings.ADMIN_EMAIL and user_id == settings.ADMIN_EMAIL:
            return settings.PAID_DAILY_CREDITS
        return settings.FREE_DAILY_CREDITS

    def get_usage(self, user_id: str) -> dict:
        if not supabase:
            limit = self._limit_for(user_id)
            return {
                "user_id": user_id,
                "usage_date": self._today(),
                "credits_used": 0,
                "credits_remaining": limit,
                "daily_limit": limit,
                "cost_usd": 0.0,
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "downgrade": False,
            }
            
        response = supabase.table("usage_ledger").select("credits, cost_usd, prompt_tokens, completion_tokens").eq("user_id", user_id).eq("usage_date", self._today()).eq("status", "consumed").execute()
        
        credits_used = sum(row.get("credits", 0) for row in response.data)
        cost_usd = sum(row.get("cost_usd", 0.0) for row in response.data)
        prompt_tokens = sum(row.get("prompt_tokens", 0) for row in response.data)
        completion_tokens = sum(row.get("completion_tokens", 0) for row in response.data)
        
        limit = self._limit_for(user_id)
        downgrade = credits_used >= (limit * 0.8)
        
        return {
            "user_id": user_id,
            "usage_date": self._today(),
            "credits_used": credits_used,
            "credits_remaining": max(limit - credits_used, 0),
            "daily_limit": limit,
            "cost_usd": cost_usd,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "downgrade": downgrade,
        }

    def can_consume(self, user_id: str, credits: int = 1, byok_active: bool = False) -> bool:
        if byok_active:
            return True
        usage = self.get_usage(user_id)
        return usage["credits_used"] + credits <= usage["daily_limit"]

    def consume(self, user_id: str, action: str, credits: int = 1, metadata: dict | None = None, cost_usd: float = 0.0, prompt_tokens: int = 0, completion_tokens: int = 0, byok_active: bool = False) -> dict:
        usage = self.get_usage(user_id)
        if not byok_active and usage["credits_used"] + credits > usage["daily_limit"]:
            return {
                "ok": False,
                "reason": "daily_limit_reached",
                "usage": usage,
            }

        if supabase:
            data = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "action": action,
                "credits": credits,
                "cost_usd": cost_usd,
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "status": "consumed",
                "metadata": metadata or {},
                "created_at": datetime.now(timezone.utc).isoformat(),
                "usage_date": self._today()
            }
            supabase.table("usage_ledger").insert(data).execute()
            
        return {
            "ok": True,
            "usage": self.get_usage(user_id),
        }

usage_service = UsageService()
