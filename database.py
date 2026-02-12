"""
SQLite Database Module for storing mining profitability history.
"""

import sqlite3
import json
import logging
from datetime import datetime, date
from pathlib import Path

logger = logging.getLogger(__name__)

DB_PATH = Path(__file__).parent / "mining_data.db"


class Database:
    """SQLite database for storing mining reports and history."""

    def __init__(self, db_path: str = None):
        self.db_path = db_path or str(DB_PATH)
        self._init_db()

    def _get_conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        """Initialize database tables."""
        conn = self._get_conn()
        try:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS daily_reports (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    report_date DATE NOT NULL,
                    coin TEXT NOT NULL,
                    hashrate_avg TEXT,
                    revenue_crypto REAL DEFAULT 0,
                    revenue_usdt REAL DEFAULT 0,
                    price_usd REAL DEFAULT 0,
                    electricity_cost_rub REAL DEFAULT 0,
                    electricity_cost_usdt REAL DEFAULT 0,
                    net_profit_usdt REAL DEFAULT 0,
                    usdt_rub_rate REAL DEFAULT 0,
                    raw_data TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(report_date, coin)
                );

                CREATE TABLE IF NOT EXISTS ai_recommendations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    report_date DATE NOT NULL,
                    recommendation TEXT,
                    market_summary TEXT,
                    news_summary TEXT,
                    confidence TEXT,
                    raw_prompt TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS price_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    record_date DATE NOT NULL,
                    coin TEXT NOT NULL,
                    price_usd REAL DEFAULT 0,
                    price_change_24h REAL DEFAULT 0,
                    market_cap_usd REAL DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(record_date, coin)
                );

                CREATE TABLE IF NOT EXISTS user_settings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    key TEXT UNIQUE NOT NULL,
                    value TEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()
            logger.info("Database initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
        finally:
            conn.close()

    def save_daily_report(self, report_date: date, coin: str, data: dict):
        """Save or update a daily mining report."""
        conn = self._get_conn()
        try:
            conn.execute("""
                INSERT OR REPLACE INTO daily_reports 
                (report_date, coin, hashrate_avg, revenue_crypto, revenue_usdt, 
                 price_usd, electricity_cost_rub, electricity_cost_usdt, 
                 net_profit_usdt, usdt_rub_rate, raw_data)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                report_date.isoformat(),
                coin,
                json.dumps(data.get("hashrate", {})),
                data.get("revenue_crypto", 0),
                data.get("revenue_usdt", 0),
                data.get("price_usd", 0),
                data.get("electricity_cost_rub", 0),
                data.get("electricity_cost_usdt", 0),
                data.get("net_profit_usdt", 0),
                data.get("usdt_rub_rate", 0),
                json.dumps(data),
            ))
            conn.commit()
            logger.info(f"Saved daily report for {coin} on {report_date}")
        except Exception as e:
            logger.error(f"Failed to save daily report: {e}")
        finally:
            conn.close()

    def save_ai_recommendation(self, report_date: date, recommendation: str,
                                market_summary: str = "", news_summary: str = "",
                                confidence: str = "", raw_prompt: str = ""):
        """Save AI-generated recommendation."""
        conn = self._get_conn()
        try:
            conn.execute("""
                INSERT INTO ai_recommendations 
                (report_date, recommendation, market_summary, news_summary, confidence, raw_prompt)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                report_date.isoformat(),
                recommendation,
                market_summary,
                news_summary,
                confidence,
                raw_prompt,
            ))
            conn.commit()
        except Exception as e:
            logger.error(f"Failed to save AI recommendation: {e}")
        finally:
            conn.close()

    def get_recent_reports(self, days: int = 7) -> list:
        """Get recent daily reports."""
        conn = self._get_conn()
        try:
            cursor = conn.execute("""
                SELECT * FROM daily_reports 
                ORDER BY report_date DESC 
                LIMIT ?
            """, (days * 3,))  # *3 for multiple coins
            return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            logger.error(f"Failed to get recent reports: {e}")
            return []
        finally:
            conn.close()

    def get_profit_trend(self, coin: str, days: int = 30) -> list:
        """Get profit trend for a specific coin over N days."""
        conn = self._get_conn()
        try:
            cursor = conn.execute("""
                SELECT report_date, revenue_usdt, electricity_cost_usdt, net_profit_usdt, price_usd
                FROM daily_reports 
                WHERE coin = ?
                ORDER BY report_date DESC 
                LIMIT ?
            """, (coin, days))
            return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            logger.error(f"Failed to get profit trend: {e}")
            return []
        finally:
            conn.close()

    def save_price(self, record_date: date, coin: str, price_usd: float,
                   price_change_24h: float = 0, market_cap_usd: float = 0):
        """Save price history record."""
        conn = self._get_conn()
        try:
            conn.execute("""
                INSERT OR REPLACE INTO price_history 
                (record_date, coin, price_usd, price_change_24h, market_cap_usd)
                VALUES (?, ?, ?, ?, ?)
            """, (record_date.isoformat(), coin, price_usd, price_change_24h, market_cap_usd))
            conn.commit()
        except Exception as e:
            logger.error(f"Failed to save price: {e}")
        finally:
            conn.close()

    def get_setting(self, key: str, default: str = None) -> str:
        """Get a user setting value."""
        conn = self._get_conn()
        try:
            cursor = conn.execute(
                "SELECT value FROM user_settings WHERE key = ?", (key,)
            )
            row = cursor.fetchone()
            return row["value"] if row else default
        except Exception as e:
            logger.error(f"Failed to get setting: {e}")
            return default
        finally:
            conn.close()

    def set_setting(self, key: str, value: str):
        """Set a user setting value."""
        conn = self._get_conn()
        try:
            conn.execute("""
                INSERT OR REPLACE INTO user_settings (key, value, updated_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
            """, (key, value))
            conn.commit()
        except Exception as e:
            logger.error(f"Failed to set setting: {e}")
        finally:
            conn.close()
