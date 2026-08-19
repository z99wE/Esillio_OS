import json
import uuid
from datetime import datetime, timezone

from app.config import settings
from app.storage.database import database


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
        cursor = database.connection.cursor()
        cursor.execute(
            """
            SELECT COALESCE(SUM(credits), 0) AS credits_used
            FROM usage_ledger
            WHERE user_id = ? AND usage_date = ? AND status = 'consumed'
            """,
            (user_id, self._today()),
        )
        row = cursor.fetchone()
        credits_used = int(row["credits_used"] if row else 0)
        limit = self._limit_for(user_id)
        return {
            "user_id": user_id,
            "usage_date": self._today(),
            "credits_used": credits_used,
            "credits_remaining": max(limit - credits_used, 0),
            "daily_limit": limit,
        }

    def can_consume(self, user_id: str, credits: int = 1) -> bool:
        usage = self.get_usage(user_id)
        return usage["credits_used"] + credits <= usage["daily_limit"]

    def consume(self, user_id: str, action: str, credits: int = 1, metadata: dict | None = None) -> dict:
        usage = self.get_usage(user_id)
        if usage["credits_used"] + credits > usage["daily_limit"]:
            return {
                "ok": False,
                "reason": "daily_limit_reached",
                "usage": usage,
            }

        cursor = database.connection.cursor()
        cursor.execute(
            """
            INSERT INTO usage_ledger
            (id, user_id, action, credits, status, metadata, created_at, usage_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(uuid.uuid4()),
                user_id,
                action,
                credits,
                "consumed",
                json.dumps(metadata or {}, ensure_ascii=False),
                datetime.now(timezone.utc).isoformat(),
                self._today(),
            ),
        )
        database.connection.commit()
        return {
            "ok": True,
            "usage": self.get_usage(user_id),
        }


usage_service = UsageService()
