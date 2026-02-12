"""
Mining Profitability Calculator

Calculates daily revenue, electricity costs, and net profit/loss
for mining operations based on ViaBTC data and current market prices.
"""

import logging
from datetime import datetime, timedelta
from typing import Optional

logger = logging.getLogger(__name__)


class ProfitabilityCalculator:
    """Calculates mining profitability based on actual and estimated data."""

    def __init__(self, electricity_price_rub_kwh: float, miners: list):
        """
        Args:
            electricity_price_rub_kwh: Cost of electricity in RUB per kWh
            miners: List of miner configurations, each with:
                - name: Miner model name
                - coin: Mining coin (BTC, LTC)
                - power_w: Power consumption in watts
                - count: Number of units (default 1)
        """
        self.electricity_price_rub_kwh = electricity_price_rub_kwh
        self.miners = miners

    def calculate_daily_electricity_cost_rub(self) -> dict:
        """Calculate daily electricity cost in RUB for each coin type.
        
        Returns:
            Dict with coin as key and daily cost in RUB as value.
            Also includes 'total' key for total cost.
        """
        costs = {}
        total = 0.0

        for miner in self.miners:
            coin = miner.get("coin", "BTC").upper()
            power_w = miner.get("power_w", 0)
            count = miner.get("count", 1)

            # Daily kWh = (watts * count * 24 hours) / 1000
            daily_kwh = (power_w * count * 24) / 1000
            daily_cost_rub = daily_kwh * self.electricity_price_rub_kwh

            if coin in costs:
                costs[coin] += daily_cost_rub
            else:
                costs[coin] = daily_cost_rub

            total += daily_cost_rub

        costs["total"] = total
        return costs

    def calculate_daily_electricity_cost_usdt(self, usdt_rub_rate: float) -> dict:
        """Calculate daily electricity cost in USDT.
        
        Args:
            usdt_rub_rate: Current USDT/RUB exchange rate (1 USDT = X RUB)
            
        Returns:
            Dict with coin as key and daily cost in USDT as value.
        """
        costs_rub = self.calculate_daily_electricity_cost_rub()
        if usdt_rub_rate <= 0:
            logger.error("Invalid USDT/RUB rate, cannot convert")
            return {k: 0 for k in costs_rub}

        return {k: round(v / usdt_rub_rate, 2) for k, v in costs_rub.items()}

    def calculate_revenue_usdt(self, viabtc_data: dict, prices: dict) -> dict:
        """Calculate daily revenue in USDT from ViaBTC mining data.
        
        Args:
            viabtc_data: Mining data from ViaBTC API (get_all_mining_data result)
            prices: Current prices from CoinGecko (e.g., {"BTC": {"usd": 97000}, ...})
            
        Returns:
            Dict with coin as key and revenue info as value.
        """
        revenue = {}

        for coin, data in viabtc_data.items():
            profit_summary = data.get("profit_summary")
            if not profit_summary:
                revenue[coin] = {
                    "crypto_amount": 0,
                    "usdt_value": 0,
                    "error": "No profit data available",
                }
                continue

            total_profit_crypto = float(profit_summary.get("total_profit", 0))
            
            # Get USD price for this coin
            coin_price_usd = prices.get(coin, {}).get("usd", 0)

            usdt_value = total_profit_crypto * coin_price_usd

            revenue[coin] = {
                "crypto_amount": total_profit_crypto,
                "usdt_value": round(usdt_value, 2),
                "price_usd": coin_price_usd,
                "pps_profit": float(profit_summary.get("pps_profit", 0)),
                "pplns_profit": float(profit_summary.get("pplns_profit", 0)),
                "solo_profit": float(profit_summary.get("solo_profit", 0)),
            }

            # For LTC, also account for DOGE merged mining revenue
            if coin == "LTC" and "DOGE" in prices:
                # DOGE merged mining data might be in a separate field or needs separate API call
                # This will be populated if DOGE data is available
                doge_price = prices.get("DOGE", {}).get("usd", 0)
                revenue[coin]["doge_price_usd"] = doge_price

        return revenue

    def calculate_net_profit(
        self,
        viabtc_data: dict,
        prices: dict,
        usdt_rub_rate: float,
    ) -> dict:
        """Calculate complete profitability report.
        
        Args:
            viabtc_data: Mining data from ViaBTC API
            prices: Current prices from CoinGecko
            usdt_rub_rate: Current USDT/RUB rate
            
        Returns:
            Comprehensive profitability report dict.
        """
        electricity_costs_usdt = self.calculate_daily_electricity_cost_usdt(usdt_rub_rate)
        electricity_costs_rub = self.calculate_daily_electricity_cost_rub()
        revenue = self.calculate_revenue_usdt(viabtc_data, prices)

        report = {
            "timestamp": datetime.utcnow().isoformat(),
            "usdt_rub_rate": usdt_rub_rate,
            "electricity_price_rub_kwh": self.electricity_price_rub_kwh,
            "coins": {},
            "totals": {
                "total_revenue_usdt": 0,
                "total_electricity_usdt": electricity_costs_usdt.get("total", 0),
                "total_electricity_rub": electricity_costs_rub.get("total", 0),
                "total_net_profit_usdt": 0,
            },
        }

        total_revenue = 0
        total_electricity = 0

        for coin in viabtc_data.keys():
            coin_revenue = revenue.get(coin, {})
            coin_electricity_usdt = electricity_costs_usdt.get(coin, 0)
            coin_electricity_rub = electricity_costs_rub.get(coin, 0)
            coin_revenue_usdt = coin_revenue.get("usdt_value", 0)
            net_profit = coin_revenue_usdt - coin_electricity_usdt

            # Get hashrate info
            hashrate_data = viabtc_data[coin].get("hashrate", {})

            # Get miner info for this coin
            coin_miners = [m for m in self.miners if m.get("coin", "").upper() == coin]
            total_power_w = sum(m.get("power_w", 0) * m.get("count", 1) for m in coin_miners)

            report["coins"][coin] = {
                "revenue_crypto": coin_revenue.get("crypto_amount", 0),
                "revenue_usdt": coin_revenue_usdt,
                "price_usd": coin_revenue.get("price_usd", 0),
                "electricity_cost_usdt": coin_electricity_usdt,
                "electricity_cost_rub": coin_electricity_rub,
                "net_profit_usdt": round(net_profit, 2),
                "profitable": net_profit > 0,
                "hashrate": hashrate_data,
                "total_power_w": total_power_w,
                "miners_count": sum(m.get("count", 1) for m in coin_miners),
                "pps_profit": coin_revenue.get("pps_profit", 0),
                "pplns_profit": coin_revenue.get("pplns_profit", 0),
            }

            total_revenue += coin_revenue_usdt
            total_electricity += coin_electricity_usdt

        report["totals"]["total_revenue_usdt"] = round(total_revenue, 2)
        report["totals"]["total_electricity_usdt"] = round(total_electricity, 2)
        report["totals"]["total_net_profit_usdt"] = round(total_revenue - total_electricity, 2)
        report["totals"]["profitable"] = (total_revenue - total_electricity) > 0

        return report

    def format_profit_history(self, viabtc_data: dict, prices: dict) -> list:
        """Format profit history for display.
        
        Returns list of daily profit records.
        """
        history = []
        for coin, data in viabtc_data.items():
            profit_hist = data.get("profit_history")
            if not profit_hist:
                continue
            
            # profit_history can be a dict with 'data' key or a list
            records = profit_hist if isinstance(profit_hist, list) else profit_hist.get("data", [])
            
            for record in records:
                history.append({
                    "coin": coin,
                    "date": record.get("date", ""),
                    "profit": float(record.get("total_profit", 0)),
                    "pps_profit": float(record.get("pps_profit", 0)),
                    "pplns_profit": float(record.get("pplns_profit", 0)),
                })

        return sorted(history, key=lambda x: x.get("date", ""), reverse=True)
