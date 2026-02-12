"""
Cryptocurrency Price API Client
Uses CoinGecko free API for price data and USDT/RUB rates.
"""

import requests
import logging

logger = logging.getLogger(__name__)

COINGECKO_BASE = "https://api.coingecko.com/api/v3"

# Mapping of coin tickers to CoinGecko IDs
COIN_IDS = {
    "BTC": "bitcoin",
    "LTC": "litecoin",
    "DOGE": "dogecoin",
    "USDT": "tether",
}


class PriceClient:
    """Client for fetching cryptocurrency prices from CoinGecko."""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/json",
        })
        self._cache = {}
        self._cache_time = 0

    def get_prices(self, coins: list = None, vs_currencies: list = None) -> dict:
        """Get current prices for specified coins.
        
        Args:
            coins: List of coin tickers (e.g., ["BTC", "LTC", "DOGE"])
            vs_currencies: List of fiat/crypto currencies (e.g., ["usd", "rub"])
            
        Returns:
            Dict with structure: {"BTC": {"usd": 97000, "rub": 8500000}, ...}
        """
        if coins is None:
            coins = ["BTC", "LTC", "DOGE"]
        if vs_currencies is None:
            vs_currencies = ["usd"]

        # Convert tickers to CoinGecko IDs
        ids = []
        ticker_to_id = {}
        for coin in coins:
            cg_id = COIN_IDS.get(coin.upper())
            if cg_id:
                ids.append(cg_id)
                ticker_to_id[cg_id] = coin.upper()
            else:
                logger.warning(f"Unknown coin ticker: {coin}")

        if not ids:
            return {}

        try:
            resp = self.session.get(
                f"{COINGECKO_BASE}/simple/price",
                params={
                    "ids": ",".join(ids),
                    "vs_currencies": ",".join(vs_currencies),
                    "include_24hr_change": "true",
                    "include_market_cap": "true",
                },
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()

            # Remap CoinGecko IDs back to tickers
            result = {}
            for cg_id, prices in data.items():
                ticker = ticker_to_id.get(cg_id, cg_id)
                result[ticker] = prices

            return result

        except requests.RequestException as e:
            logger.error(f"CoinGecko API request failed: {e}")
            return {}

    def get_usdt_rub_rate(self) -> float:
        """Get current USDT/RUB exchange rate.
        
        Returns the price of 1 USDT in RUB.
        """
        try:
            resp = self.session.get(
                f"{COINGECKO_BASE}/simple/price",
                params={
                    "ids": "tether",
                    "vs_currencies": "rub",
                },
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()
            return data.get("tether", {}).get("rub", 0)
        except requests.RequestException as e:
            logger.error(f"Failed to get USDT/RUB rate: {e}")
            return 0

    def get_market_overview(self) -> dict:
        """Get a broader market overview including BTC dominance and total market cap."""
        try:
            resp = self.session.get(
                f"{COINGECKO_BASE}/global",
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json().get("data", {})
            return {
                "total_market_cap_usd": data.get("total_market_cap", {}).get("usd", 0),
                "btc_dominance": data.get("market_cap_percentage", {}).get("btc", 0),
                "market_cap_change_24h": data.get("market_cap_change_percentage_24h_usd", 0),
                "active_cryptocurrencies": data.get("active_cryptocurrencies", 0),
            }
        except requests.RequestException as e:
            logger.error(f"Failed to get market overview: {e}")
            return {}

    def get_mining_difficulty_data(self) -> dict:
        """Get Bitcoin network stats (difficulty, hashrate) from public APIs."""
        try:
            # Use blockchain.info for BTC network stats
            resp = self.session.get(
                "https://blockchain.info/q/getdifficulty",
                timeout=15,
            )
            resp.raise_for_status()
            btc_difficulty = float(resp.text)

            resp2 = self.session.get(
                "https://blockchain.info/q/hashrate",
                timeout=15,
            )
            resp2.raise_for_status()
            btc_hashrate = float(resp2.text)

            return {
                "btc_difficulty": btc_difficulty,
                "btc_network_hashrate_gh": btc_hashrate,
            }
        except Exception as e:
            logger.error(f"Failed to get mining difficulty data: {e}")
            return {}
