from app.storage.database import database


class HealthRepository:

    def create_event(self, event):

        cursor = database.connection.cursor()

        cursor.execute(
            """
            INSERT INTO health_events
            (
                id,
                title,
                category,
                source,
                description,
                timestamp,
                confidence
            )
            VALUES (?,?,?,?,?,?,?)
            """,
            (
                event.id,
                event.title,
                event.category,
                event.source,
                event.description,
                str(event.timestamp),
                event.confidence,
            ),
        )

        database.connection.commit()

    def list_events(self):

        cursor = database.connection.cursor()

        cursor.execute(
            """
            SELECT *
            FROM health_events
            ORDER BY timestamp DESC
            """
        )

        rows = cursor.fetchall()

        return [dict(row) for row in rows]


repository = HealthRepository()