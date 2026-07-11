from app.storage.database import database


class SettingsRepository:
    """
    Repository for AI Runtime settings.

    Stores a single runtime configuration that can be
    updated from the frontend.

    Future:
    This can easily be extended to support per-user settings.
    """

    ##########################################################

    def get_settings(self):

        cursor = database.connection.cursor()

        cursor.execute(
            """
            SELECT
                provider,
                base_url,
                api_key,
                model
            FROM ai_settings
            WHERE id = 1
            """
        )

        row = cursor.fetchone()

        if row is None:

            return {
                "provider": "local",
                "base_url": "https://api.openai.com/v1",
                "api_key": "",
                "model": "gpt-4.1",
            }

        return dict(row)

    ##########################################################

    def save_settings(
        self,
        provider: str,
        base_url: str,
        api_key: str,
        model: str,
    ):

        cursor = database.connection.cursor()

        cursor.execute(
            """
            UPDATE ai_settings
            SET
                provider=?,
                base_url=?,
                api_key=?,
                model=?
            WHERE id=1
            """,
            (
                provider,
                base_url,
                api_key,
                model,
            ),
        )

        database.connection.commit()

        return self.get_settings()


############################################################

settings_repository = SettingsRepository()




