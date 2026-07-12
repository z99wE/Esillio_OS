import os
import sqlite3

DB_PATH = "data/esillio.db"


class Database:

    def __init__(self):

        os.makedirs(
            "data",
            exist_ok=True,
        )

        self.connection = sqlite3.connect(
            DB_PATH,
            check_same_thread=False,
        )

        self.connection.row_factory = sqlite3.Row

        self.initialize()

    ##########################################################

    def initialize(self):

        cursor = self.connection.cursor()

        ######################################################
        # Users
        ######################################################

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users(

                id TEXT PRIMARY KEY,

                email TEXT UNIQUE NOT NULL,

                password_hash TEXT NOT NULL,
                
                created_at TEXT NOT NULL
            )
            """
        )

        ######################################################
        # Health Events
        ######################################################

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS health_events(

                id TEXT PRIMARY KEY,

                patient_id TEXT,

                title TEXT NOT NULL,

                category TEXT,

                source TEXT,

                description TEXT,

                timestamp TEXT,

                confidence REAL
            )
            """
        )

        ######################################################
        # AI Settings
        ######################################################

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS ai_settings(

                id INTEGER PRIMARY KEY CHECK(id = 1),

                provider TEXT NOT NULL,

                base_url TEXT,

                api_key TEXT,

                model TEXT
            )
            """
        )

        ######################################################
        # Insert Default Settings
        ######################################################

        cursor.execute(
            """
            INSERT OR IGNORE INTO ai_settings
            (
                id,
                provider,
                base_url,
                api_key,
                model
            )
            VALUES
            (
                1,
                'local',
                'https://api.openai.com/v1',
                '',
                'gpt-4.1'
            )
            """
        )

        self.connection.commit()


database = Database()