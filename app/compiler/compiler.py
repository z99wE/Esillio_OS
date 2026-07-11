from app.compiler.parser import BiologicalContinuityParser


class BiologicalContinuityCompiler:

    def __init__(self):
        self.parser = BiologicalContinuityParser()

    def compile(self, payload):

        event = self.parser.compile_manual_event(
            title=payload.title,
            category=payload.category,
            source=payload.source,
            description=payload.description,
        )

        return event