"""
AI Analyst Module

Uses OpenAI GPT to analyze market conditions, news, and mining data
to generate actionable recommendations for the miner.
"""

import json
import logging
import requests
from datetime import datetime
from openai import OpenAI

logger = logging.getLogger(__name__)


class CryptoNewsClient:
    """Fetches cryptocurrency news from free sources."""

    def __init__(self):
        self.session = requests.Session()

    def get_crypto_news(self, limit: int = 10) -> list:
        """Fetch latest crypto news from CryptoPanic (free, no auth for basic)."""
        news = []

        # Try CryptoPanic public feed
        try:
            resp = self.session.get(
                "https://cryptopanic.com/api/free/v1/posts/",
                params={
                    "auth_token": "free",
                    "public": "true",
                    "filter": "important",
                },
                timeout=15,
            )
            if resp.status_code == 200:
                data = resp.json()
                for item in data.get("results", [])[:limit]:
                    news.append({
                        "title": item.get("title", ""),
                        "source": item.get("source", {}).get("title", ""),
                        "url": item.get("url", ""),
                        "published_at": item.get("published_at", ""),
                        "currencies": [c.get("code", "") for c in item.get("currencies", [])],
                    })
        except Exception as e:
            logger.warning(f"CryptoPanic fetch failed: {e}")

        # Fallback: try CoinGecko trending
        if not news:
            try:
                resp = self.session.get(
                    "https://api.coingecko.com/api/v3/search/trending",
                    timeout=15,
                )
                if resp.status_code == 200:
                    data = resp.json()
                    for item in data.get("coins", [])[:limit]:
                        coin = item.get("item", {})
                        news.append({
                            "title": f"Trending: {coin.get('name', '')} ({coin.get('symbol', '')}) - Rank #{coin.get('market_cap_rank', 'N/A')}",
                            "source": "CoinGecko Trending",
                            "url": "",
                            "published_at": datetime.utcnow().isoformat(),
                            "currencies": [coin.get("symbol", "")],
                        })
            except Exception as e:
                logger.warning(f"CoinGecko trending fetch failed: {e}")

        return news

    def get_btc_fear_greed_index(self) -> dict:
        """Get Bitcoin Fear & Greed Index."""
        try:
            resp = self.session.get(
                "https://api.alternative.me/fng/?limit=1&format=json",
                timeout=15,
            )
            if resp.status_code == 200:
                data = resp.json()
                fng = data.get("data", [{}])[0]
                return {
                    "value": int(fng.get("value", 0)),
                    "classification": fng.get("value_classification", "Unknown"),
                    "timestamp": fng.get("timestamp", ""),
                }
        except Exception as e:
            logger.warning(f"Fear & Greed Index fetch failed: {e}")
        return {"value": 0, "classification": "Unknown"}


class AIAnalyst:
    """AI-powered market analyst using OpenAI GPT."""

    def __init__(self, api_key: str = None, model: str = "gpt-4.1-mini"):
        """
        Args:
            api_key: OpenAI API key (if None, uses environment variable)
            model: GPT model to use
        """
        self.client = OpenAI(api_key=api_key) if api_key else OpenAI()
        self.model = model
        self.news_client = CryptoNewsClient()

    def generate_analysis(
        self,
        profitability_report: dict,
        prices: dict,
        market_overview: dict = None,
        difficulty_data: dict = None,
    ) -> dict:
        """Generate comprehensive AI analysis and recommendations.
        
        Args:
            profitability_report: Output from ProfitabilityCalculator.calculate_net_profit()
            prices: Current crypto prices
            market_overview: Market overview data
            difficulty_data: Network difficulty data
            
        Returns:
            Dict with analysis, recommendations, and market summary.
        """
        # Gather additional context
        news = self.news_client.get_crypto_news(limit=10)
        fear_greed = self.news_client.get_btc_fear_greed_index()

        # Build the analysis prompt
        prompt = self._build_prompt(
            profitability_report, prices, market_overview,
            difficulty_data, news, fear_greed
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": self._get_system_prompt(),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.7,
                max_tokens=2000,
            )

            analysis_text = response.choices[0].message.content

            return {
                "analysis": analysis_text,
                "news_used": [n.get("title", "") for n in news[:5]],
                "fear_greed_index": fear_greed,
                "model_used": self.model,
                "timestamp": datetime.utcnow().isoformat(),
                "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
                "completion_tokens": response.usage.completion_tokens if response.usage else 0,
            }

        except Exception as e:
            logger.error(f"AI analysis generation failed: {e}")
            return {
                "analysis": f"⚠️ AI-анализ временно недоступен: {str(e)}",
                "news_used": [],
                "fear_greed_index": fear_greed,
                "model_used": self.model,
                "timestamp": datetime.utcnow().isoformat(),
                "error": str(e),
            }

    def _get_system_prompt(self) -> str:
        return """Ты — профессиональный аналитик криптовалютного рынка и майнинга. 
Твоя задача — анализировать данные о прибыльности майнинга, текущие рыночные условия и новости, 
и давать конкретные, практичные рекомендации майнеру.

Формат ответа:

📊 РЫНОЧНАЯ СВОДКА
[Краткий обзор текущего состояния рынка, ключевые тренды]

⛏️ АНАЛИЗ ПРИБЫЛЬНОСТИ
[Анализ текущей прибыльности майнинга, сравнение с расходами]

📰 КЛЮЧЕВЫЕ НОВОСТИ
[Топ-3 новости, влияющие на майнинг BTC/LTC/DOGE]

💡 РЕКОМЕНДАЦИИ
[Конкретные рекомендации:]
- Продавать/Держать/Накапливать для каждой монеты
- Оптимальное время для продажи
- Стоит ли конвертировать в другие активы
- Прогноз на ближайшую неделю

⚠️ РИСКИ
[Основные риски и на что обратить внимание]

Отвечай на русском языке. Будь конкретным — указывай цифры, проценты, уровни цен.
Не используй общие фразы типа "рынок волатилен" — давай конкретику."""

    def _build_prompt(
        self,
        profitability_report: dict,
        prices: dict,
        market_overview: dict,
        difficulty_data: dict,
        news: list,
        fear_greed: dict,
    ) -> str:
        """Build detailed prompt for GPT analysis."""

        # Format profitability data
        coins_info = ""
        for coin, data in profitability_report.get("coins", {}).items():
            coins_info += f"""
--- {coin} ---
Доход за день: {data.get('revenue_crypto', 0)} {coin} (~{data.get('revenue_usdt', 0)} USDT)
Цена {coin}: ${data.get('price_usd', 0)}
Расходы на электричество: {data.get('electricity_cost_usdt', 0)} USDT ({data.get('electricity_cost_rub', 0)} RUB)
Чистая прибыль: {data.get('net_profit_usdt', 0)} USDT
Прибыльно: {'Да ✅' if data.get('profitable') else 'Нет ❌'}
Мощность оборудования: {data.get('total_power_w', 0)} Вт
Количество майнеров: {data.get('miners_count', 0)}
"""

        totals = profitability_report.get("totals", {})
        totals_info = f"""
=== ИТОГО ===
Общий доход: {totals.get('total_revenue_usdt', 0)} USDT
Общие расходы на электричество: {totals.get('total_electricity_usdt', 0)} USDT ({totals.get('total_electricity_rub', 0)} RUB)
Чистая прибыль: {totals.get('total_net_profit_usdt', 0)} USDT
Общая прибыльность: {'Да ✅' if totals.get('profitable') else 'Нет ❌'}
"""

        # Format prices
        prices_info = ""
        for coin, price_data in prices.items():
            usd_price = price_data.get("usd", 0)
            change_24h = price_data.get("usd_24h_change", 0)
            prices_info += f"  {coin}: ${usd_price:,.2f} (24ч: {change_24h:+.2f}%)\n"

        # Format market overview
        market_info = ""
        if market_overview:
            market_info = f"""
Общая капитализация рынка: ${market_overview.get('total_market_cap_usd', 0):,.0f}
Доминация BTC: {market_overview.get('btc_dominance', 0):.1f}%
Изменение капитализации за 24ч: {market_overview.get('market_cap_change_24h', 0):+.2f}%
"""

        # Format difficulty
        diff_info = ""
        if difficulty_data:
            diff_info = f"""
Сложность BTC: {difficulty_data.get('btc_difficulty', 0):,.0f}
Хешрейт сети BTC: {difficulty_data.get('btc_network_hashrate_gh', 0):,.0f} GH/s
"""

        # Format news
        news_info = ""
        for i, n in enumerate(news[:10], 1):
            currencies = ", ".join(n.get("currencies", []))
            news_info += f"  {i}. [{currencies}] {n.get('title', '')}\n"

        # Fear & Greed
        fng_info = f"Индекс страха и жадности: {fear_greed.get('value', 'N/A')} ({fear_greed.get('classification', 'Unknown')})"

        prompt = f"""Проанализируй текущую ситуацию с майнингом и дай рекомендации.

=== ДАННЫЕ О ПРИБЫЛЬНОСТИ МАЙНИНГА ===
Цена электричества: {profitability_report.get('electricity_price_rub_kwh', 0)} руб/кВт·ч
Курс USDT/RUB: {profitability_report.get('usdt_rub_rate', 0)}

{coins_info}
{totals_info}

=== ТЕКУЩИЕ ЦЕНЫ ===
{prices_info}

=== РЫНОЧНАЯ ОБСТАНОВКА ===
{market_info}
{fng_info}

=== ДАННЫЕ О СЕТИ ===
{diff_info}

=== ПОСЛЕДНИЕ НОВОСТИ ===
{news_info}

Дай развёрнутый анализ и конкретные рекомендации по каждой монете (BTC, LTC, DOGE):
- Продавать сейчас или держать?
- Если держать — до какого уровня цены?
- Стоит ли конвертировать в другие активы?
- Прогноз прибыльности майнинга на ближайшую неделю
- Есть ли смысл продолжать майнинг при текущих условиях?
"""
        return prompt
