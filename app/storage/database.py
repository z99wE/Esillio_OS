import sqlite3
import os

DB_PATH = "data/esillio.db"


class Database:

    def __init__(self):
        os.makedirs("data", exist_ok=True)

        self.connection = sqlite3.connect(
            DB_PATH,
            check_same_thread=False
        )

        self.connection.row_factory = sqlite3.Row

        self.initialize()

    def initialize(self):

        cursor = self.connection.cursor()

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS health_events(

            id TEXT PRIMARY KEY,

            title TEXT NOT NULL,

            category TEXT,

            source TEXT,

            description TEXT,

            timestamp TEXT,

            confidence REAL
        )
        """)

        self.connection.commit()


database = Database()