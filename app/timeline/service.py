from app.storage.repository import repository


class TimelineService:

    def get_timeline(self, category=None):

        events = repository.list_events()

        if category:
            events = [
                event for event in events
                if event["category"].lower() == category.lower()
            ]

        events.sort(
            key=lambda event: event["timestamp"],
            reverse=True,
        )

        return events


timeline_service = TimelineService()