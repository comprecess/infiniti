"""
ViaBTC Pool API Client
Documentation: https://github.com/viabtc/viapool_api/wiki
"""

import hashlib
import hmac
import time
import requests
import logging

logger = logging.getLogger(__name__)

BASE_URL = "https://www.viabtc.net"


class ViaBTCClient:
    """Client for interacting with ViaBTC Pool API."""

    def __init__(self, api_key: str, secret_key: str):
        self.api_key = api_key
        self.secret_key = secret_key
        self.session = requests.Session()
        self.session.headers.update({
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json",
        })

    def _sign_request(self, params: dict) -> str:
        """Generate HMAC SHA256 signature for request parameters."""
        tonce = int(time.time() * 1000)
        params["tonce"] = tonce
        query_string = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
        signature = hmac.new(
            self.secret_key.encode("utf-8"),
            query_string.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        return signature, tonce

    def _get(self, path: str, params: dict = None, signed: bool = False) -> dict:
        """Make a GET request to ViaBTC API."""
        if params is None:
            params = {}

        headers = {}
        if signed:
            signature, tonce = self._sign_request(params)
            params["tonce"] = tonce
            headers["X-SIGNATURE"] = signature

        try:
            url = f"{BASE_URL}{path}"
            resp = self.session.get(url, params=params, headers=headers, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            if data.get("code") != 0:
                logger.error(f"ViaBTC API error: {data.get('message')} (code: {data.get('code')})")
            return data
        except requests.RequestException as e:
            logger.error(f"ViaBTC API request failed: {e}")
            return {"code": -1, "message": str(e), "data": None}

    # ============================================================
    # Account API
    # ============================================================

    def get_account_info(self) -> dict:
        """Get account information."""
        return self._get("/res/openapi/v1/account")

    def get_subaccount_list(self) -> dict:
        """Get list of subaccounts."""
        return self._get("/res/openapi/v1/subaccount")

    # ============================================================
    # Hashrate API
    # ============================================================

    def get_account_hashrate(self, coin: str) -> dict:
        """Get current account hashrate for a specific coin."""
        return self._get("/res/openapi/v1/hashrate", params={"coin": coin.upper()})

    def get_account_hashrate_history(self, coin: str, page: int = 1, limit: int = 30) -> dict:
        """Get account hashrate history."""
        return self._get("/res/openapi/v1/hashrate/history", params={
            "coin": coin.upper(),
            "page": page,
            "limit": limit,
        })

    def get_miner_hashrate(self, coin: str) -> dict:
        """Get all miners hashrate for a specific coin."""
        return self._get("/res/openapi/v1/miner/hashrate", params={"coin": coin.upper()})

    def get_miner_hashrate_info(self, coin: str, miner: str) -> dict:
        """Get specific miner hashrate info."""
        return self._get("/res/openapi/v1/miner/hashrate/info", params={
            "coin": coin.upper(),
            "miner": miner,
        })

    # ============================================================
    # Wallet / Profit API
    # ============================================================

    def get_profit_summary(self, coin: str) -> dict:
        """Get profit summary for a specific coin.
        
        Response data includes:
        - pplns_profit: PPLNS profit
        - pps_profit: PPS+ profit
        - solo_profit: Solo profit
        - total_profit: Total profit
        """
        return self._get("/res/openapi/v1/profit", params={"coin": coin.upper()})

    def get_profit_history(self, coin: str, page: int = 1, limit: int = 30) -> dict:
        """Get profit history for a specific coin.
        
        Returns daily profit records.
        """
        return self._get("/res/openapi/v1/profit/history", params={
            "coin": coin.upper(),
            "page": page,
            "limit": limit,
        })

    def get_reward_history(self, coin: str, page: int = 1, limit: int = 30) -> dict:
        """Get reward history (block rewards)."""
        return self._get("/res/openapi/v1/reward/history", params={
            "coin": coin.upper(),
            "page": page,
            "limit": limit,
        })

    def get_payment_history(self, coin: str, page: int = 1, limit: int = 30) -> dict:
        """Get payment history (actual payouts)."""
        return self._get("/res/openapi/v1/payment/history", params={
            "coin": coin.upper(),
            "page": page,
            "limit": limit,
        })

    # ============================================================
    # Convenience methods
    # ============================================================

    def get_all_mining_data(self, coins: list = None) -> dict:
        """Fetch comprehensive mining data for all specified coins.
        
        Returns a dict with coin names as keys, each containing:
        - hashrate: current hashrate info
        - profit_summary: total profit summary
        - profit_history: recent daily profits (last 7 days)
        - miners: list of active miners
        """
        if coins is None:
            coins = ["BTC", "LTC"]

        result = {}
        for coin in coins:
            coin_data = {}

            # Get hashrate
            hashrate_resp = self.get_account_hashrate(coin)
            if hashrate_resp.get("code") == 0:
                coin_data["hashrate"] = hashrate_resp.get("data", {})
            else:
                coin_data["hashrate"] = None
                logger.warning(f"Failed to get hashrate for {coin}: {hashrate_resp.get('message')}")

            # Get profit summary
            profit_resp = self.get_profit_summary(coin)
            if profit_resp.get("code") == 0:
                coin_data["profit_summary"] = profit_resp.get("data", {})
            else:
                coin_data["profit_summary"] = None
                logger.warning(f"Failed to get profit summary for {coin}: {profit_resp.get('message')}")

            # Get recent profit history (last 7 entries)
            history_resp = self.get_profit_history(coin, page=1, limit=7)
            if history_resp.get("code") == 0:
                coin_data["profit_history"] = history_resp.get("data", [])
            else:
                coin_data["profit_history"] = None
                logger.warning(f"Failed to get profit history for {coin}: {history_resp.get('message')}")

            # Get miners list
            miners_resp = self.get_miner_hashrate(coin)
            if miners_resp.get("code") == 0:
                coin_data["miners"] = miners_resp.get("data", [])
            else:
                coin_data["miners"] = None
                logger.warning(f"Failed to get miners for {coin}: {miners_resp.get('message')}")

            result[coin] = coin_data

        return result
