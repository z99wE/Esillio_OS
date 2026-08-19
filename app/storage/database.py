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
        # Usage Ledger
        ######################################################

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS usage_ledger(

                id TEXT PRIMARY KEY,

                user_id TEXT NOT NULL,

                action TEXT NOT NULL,

                credits INTEGER NOT NULL,

                status TEXT NOT NULL,

                metadata TEXT,

                created_at TEXT NOT NULL,

                usage_date TEXT NOT NULL
            )
            """
        )

        ######################################################
        # Audit Logs
        ######################################################

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS audit_logs(

                id TEXT PRIMARY KEY,

                user_id TEXT,

                action TEXT NOT NULL,

                resource_type TEXT,

                resource_id TEXT,

                metadata TEXT,

                created_at TEXT NOT NULL
            )
            """
        )

        ######################################################
        # Clinician Review Queue
        ######################################################

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS clinician_reviews(

                id TEXT PRIMARY KEY,

                patient_id TEXT NOT NULL,

                author_id TEXT,

                status TEXT NOT NULL,

                title TEXT NOT NULL,

                body TEXT NOT NULL,

                source_event_id TEXT,

                approved_at TEXT,

                created_at TEXT NOT NULL
            )
            """
        )

        ######################################################
        # Patient Education Cards
        ######################################################

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS education_cards(

                id TEXT PRIMARY KEY,

                patient_id TEXT NOT NULL,

                review_id TEXT,

                title TEXT NOT NULL,

                summary TEXT NOT NULL,

                status TEXT NOT NULL,

                source_refs TEXT,

                approved_at TEXT,

                created_at TEXT NOT NULL,

                updated_at TEXT NOT NULL
            )
            """
        )

        ######################################################
        # Sharing Permissions
        ######################################################

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS share_permissions(

                id TEXT PRIMARY KEY,

                owner_id TEXT NOT NULL,

                shared_with TEXT NOT NULL,

                scope TEXT NOT NULL,

                status TEXT NOT NULL,

                expires_at TEXT,

                created_at TEXT NOT NULL
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
