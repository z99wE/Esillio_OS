"""
builder.build

Runs the complete Forge build pipeline.
"""

from builder.compile import create_database
from builder.knowledge import build as build_knowledge
from builder.validate import validate
from builder.optimize import optimize
from builder.export import export


def build():

    print()
    print("=" * 60)
    print("Starting EsiWell Forge")
    print("=" * 60)

    create_database()

    build_knowledge()

    validate()

    optimize()

    export()

    print()
    print("=" * 60)
    print("Forge Build Complete")
    print("=" * 60)


if __name__ == "__main__":
    build()