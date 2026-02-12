"""
ViaBTC Mining Profitability Telegram Bot

Main bot module with command handlers, daily report scheduler,
and interactive features.
"""

import json
import logging
import os
import sys
from datetime import datetime, date
from pathlib import Path
from zoneinfo import ZoneInfo

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, BotCommand
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
    MessageHandler,
    filters,
)
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from viabtc_api import ViaBTCClient
from price_api import PriceClient
from profitability import ProfitabilityCalculator
from database import Database
from ai_analyst import AIAnalyst

# ============================================================
# Configuration
# ============================================================

CONFIG_PATH = Path(__file__).parent / "config.json"

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)


def load_config() -> dict:
    """Load configuration from config.json file."""
    if not CONFIG_PATH.exists():
        logger.error(f"Config file not found: {CONFIG_PATH}")
        sys.exit(1)

    with open(CONFIG_PATH, "r") as f:
        config = json.load(f)

    # Validate required fields
    required = ["telegram_token", "viabtc_api_key", "viabtc_secret_key"]
    for field in required:
        value = config.get(field, "")
        if not value or value.startswith("YOUR_"):
            logger.warning(f"Config field '{field}' is not set!")

    return config


# ============================================================
# Report Generation
# ============================================================

async def generate_full_report(config: dict) -> str:
    """Generate a complete mining profitability report with AI analysis.
    
    Returns formatted message text for Telegram.
    """
    db = Database()

    # Initialize clients
    viabtc = ViaBTCClient(
        api_key=config["viabtc_api_key"],
        secret_key=config["viabtc_secret_key"],
    )
    price_client = PriceClient()
    calculator = ProfitabilityCalculator(
        electricity_price_rub_kwh=config.get("electricity_price_rub_kwh", 5.7),
        miners=config.get("miners", []),
    )

    # Determine which coins to track based on miners config
    coins = list(set(m.get("coin", "BTC").upper() for m in config.get("miners", [])))
    if not coins:
        coins = ["BTC", "LTC"]

    # 1. Fetch ViaBTC mining data
    logger.info("Fetching ViaBTC mining data...")
    viabtc_data = viabtc.get_all_mining_data(coins=coins)

    # 2. Fetch current prices
    logger.info("Fetching current prices...")
    price_coins = coins.copy()
    if "LTC" in coins and "DOGE" not in price_coins:
        price_coins.append("DOGE")
    prices = price_client.get_prices(coins=price_coins, vs_currencies=["usd"])

    # 3. Get USDT/RUB rate
    usdt_rub_rate = price_client.get_usdt_rub_rate()
    if usdt_rub_rate <= 0:
        usdt_rub_rate = 92.0  # Fallback rate
        logger.warning("Using fallback USDT/RUB rate: 92.0")

    # 4. Get market overview
    market_overview = price_client.get_market_overview()

    # 5. Get difficulty data
    difficulty_data = price_client.get_mining_difficulty_data()

    # 6. Calculate profitability
    logger.info("Calculating profitability...")
    report = calculator.calculate_net_profit(
        viabtc_data=viabtc_data,
        prices=prices,
        usdt_rub_rate=usdt_rub_rate,
    )

    # 7. Save to database
    today = date.today()
    for coin, coin_data in report.get("coins", {}).items():
        coin_data["usdt_rub_rate"] = usdt_rub_rate
        db.save_daily_report(today, coin, coin_data)

    # Save prices
    for coin, price_data in prices.items():
        db.save_price(
            today, coin,
            price_usd=price_data.get("usd", 0),
            price_change_24h=price_data.get("usd_24h_change", 0),
            market_cap_usd=price_data.get("usd_market_cap", 0),
        )

    # 8. Generate AI analysis
    logger.info("Generating AI analysis...")
    openai_key = config.get("openai_api_key")
    if openai_key and not openai_key.startswith("YOUR_"):
        ai = AIAnalyst(api_key=openai_key)
    else:
        # Try using environment variable
        ai = AIAnalyst()

    ai_result = ai.generate_analysis(
        profitability_report=report,
        prices=prices,
        market_overview=market_overview,
        difficulty_data=difficulty_data,
    )

    # Save AI recommendation
    db.save_ai_recommendation(
        today,
        recommendation=ai_result.get("analysis", ""),
        market_summary=json.dumps(market_overview),
        news_summary=json.dumps(ai_result.get("news_used", [])),
    )

    # 9. Format the message
    message = format_report_message(report, prices, usdt_rub_rate, ai_result, market_overview)

    return message


def format_report_message(
    report: dict,
    prices: dict,
    usdt_rub_rate: float,
    ai_result: dict,
    market_overview: dict,
) -> str:
    """Format the complete report as a Telegram message."""

    now = datetime.now(ZoneInfo("Europe/Moscow"))
    header = f"📋 *ЕЖЕДНЕВНЫЙ ОТЧЁТ О МАЙНИНГЕ*\n"
    header += f"📅 {now.strftime('%d.%m.%Y %H:%M')} (МСК)\n"
    header += "━" * 32 + "\n\n"

    # Prices section
    prices_section = "💰 *ТЕКУЩИЕ КУРСЫ*\n"
    for coin, price_data in prices.items():
        usd_price = price_data.get("usd", 0)
        change = price_data.get("usd_24h_change", 0)
        emoji = "🟢" if change >= 0 else "🔴"
        prices_section += f"  {emoji} {coin}: ${usd_price:,.2f} ({change:+.1f}%)\n"
    prices_section += f"  💵 USDT/RUB: {usdt_rub_rate:.2f}\n\n"

    # Mining profitability section
    mining_section = "⛏️ *ПРИБЫЛЬНОСТЬ МАЙНИНГА*\n"
    for coin, data in report.get("coins", {}).items():
        status = "✅" if data.get("profitable") else "❌"
        mining_section += f"\n  *{coin}* {status}\n"
        mining_section += f"  ├ Доход: {data.get('revenue_crypto', 0):.8f} {coin}\n"
        mining_section += f"  ├ Доход: {data.get('revenue_usdt', 0):.2f} USDT\n"
        mining_section += f"  ├ Электричество: {data.get('electricity_cost_usdt', 0):.2f} USDT"
        mining_section += f" ({data.get('electricity_cost_rub', 0):.0f} ₽)\n"
        mining_section += f"  └ Чистая прибыль: *{data.get('net_profit_usdt', 0):.2f} USDT*\n"

    # Totals
    totals = report.get("totals", {})
    total_status = "✅ ПРИБЫЛЬНО" if totals.get("profitable") else "❌ УБЫТОЧНО"
    mining_section += f"\n{'━' * 32}\n"
    mining_section += f"📊 *ИТОГО: {total_status}*\n"
    mining_section += f"  ├ Доход: {totals.get('total_revenue_usdt', 0):.2f} USDT\n"
    mining_section += f"  ├ Расходы: {totals.get('total_electricity_usdt', 0):.2f} USDT"
    mining_section += f" ({totals.get('total_electricity_rub', 0):.0f} ₽)\n"
    net = totals.get('total_net_profit_usdt', 0)
    mining_section += f"  └ *Чистая прибыль: {net:+.2f} USDT*\n\n"

    # Market overview
    market_section = ""
    if market_overview:
        fng = ai_result.get("fear_greed_index", {})
        fng_value = fng.get("value", 0)
        fng_class = fng.get("classification", "")
        fng_emoji = "😱" if fng_value < 25 else "😰" if fng_value < 45 else "😐" if fng_value < 55 else "😊" if fng_value < 75 else "🤑"

        market_section = "🌍 *РЫНОК*\n"
        market_section += f"  ├ Капитализация: ${market_overview.get('total_market_cap_usd', 0)/1e12:.2f}T"
        market_section += f" ({market_overview.get('market_cap_change_24h', 0):+.1f}%)\n"
        market_section += f"  ├ Доминация BTC: {market_overview.get('btc_dominance', 0):.1f}%\n"
        market_section += f"  └ Страх/Жадность: {fng_emoji} {fng_value} ({fng_class})\n\n"

    # AI Analysis section
    ai_section = ""
    analysis = ai_result.get("analysis", "")
    if analysis:
        ai_section = f"🤖 *AI-АНАЛИТИКА*\n{'━' * 32}\n{analysis}\n"

    # Compose full message
    full_message = header + prices_section + mining_section + market_section + ai_section

    # Telegram message limit is 4096 chars
    if len(full_message) > 4000:
        # Split into parts if needed
        full_message = full_message[:3990] + "\n\n_...продолжение в следующем сообщении_"

    return full_message


# ============================================================
# Bot Command Handlers
# ============================================================

async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command."""
    keyboard = [
        [
            InlineKeyboardButton("📊 Отчёт", callback_data="report"),
            InlineKeyboardButton("💰 Цены", callback_data="prices"),
        ],
        [
            InlineKeyboardButton("⛏️ Хешрейт", callback_data="hashrate"),
            InlineKeyboardButton("🤖 AI-Анализ", callback_data="ai_analysis"),
        ],
        [
            InlineKeyboardButton("📈 История", callback_data="history"),
            InlineKeyboardButton("⚙️ Настройки", callback_data="settings"),
        ],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    welcome_text = (
        "👋 *Добро пожаловать в Mining Monitor Bot!*\n\n"
        "Я помогу отслеживать прибыльность вашего майнинга на ViaBTC.\n\n"
        "📊 *Возможности:*\n"
        "• Ежедневные отчёты о прибыльности\n"
        "• Текущие курсы BTC, LTC, DOGE\n"
        "• AI-анализ рынка и рекомендации\n"
        "• История прибыльности\n"
        "• Уведомления о важных изменениях\n\n"
        "📌 *Команды:*\n"
        "/report — Полный отчёт\n"
        "/prices — Текущие курсы\n"
        "/hashrate — Статус хешрейта\n"
        "/ai — AI-анализ и рекомендации\n"
        "/history — История за 7 дней\n"
        "/settings — Настройки\n"
        "/help — Помощь\n\n"
        "⏰ Ежедневный отчёт отправляется автоматически в 08:00 МСК"
    )

    await update.message.reply_text(
        welcome_text,
        parse_mode="Markdown",
        reply_markup=reply_markup,
    )


async def cmd_report(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /report command — generate full report."""
    config = load_config()
    user_id = config.get("user_id", "")

    # Check authorization
    if user_id and str(update.effective_user.id) != str(user_id):
        await update.message.reply_text("⛔ Доступ запрещён.")
        return

    msg = await update.message.reply_text("⏳ Генерирую отчёт, подождите 15-30 секунд...")

    try:
        report_text = await generate_full_report(config)

        # Check if message is too long, split if needed
        if len(report_text) > 4096:
            parts = split_message(report_text, 4096)
            await msg.delete()
            for part in parts:
                await update.message.reply_text(part, parse_mode="Markdown")
        else:
            await msg.edit_text(report_text, parse_mode="Markdown")

    except Exception as e:
        logger.error(f"Report generation failed: {e}", exc_info=True)
        await msg.edit_text(f"❌ Ошибка генерации отчёта:\n`{str(e)}`", parse_mode="Markdown")


async def cmd_prices(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /prices command — show current prices."""
    msg = await update.message.reply_text("⏳ Загружаю курсы...")

    try:
        price_client = PriceClient()
        prices = price_client.get_prices(
            coins=["BTC", "LTC", "DOGE"],
            vs_currencies=["usd"],
        )
        usdt_rub = price_client.get_usdt_rub_rate()

        text = "💰 *ТЕКУЩИЕ КУРСЫ*\n\n"
        for coin, data in prices.items():
            usd = data.get("usd", 0)
            change = data.get("usd_24h_change", 0)
            mcap = data.get("usd_market_cap", 0)
            emoji = "🟢" if change >= 0 else "🔴"
            text += f"{emoji} *{coin}*: ${usd:,.2f}\n"
            text += f"  ├ 24ч: {change:+.2f}%\n"
            text += f"  └ Капитализация: ${mcap/1e9:.1f}B\n\n"

        text += f"💵 *USDT/RUB*: {usdt_rub:.2f}\n"
        text += f"\n_Обновлено: {datetime.now(ZoneInfo('Europe/Moscow')).strftime('%H:%M МСК')}_"

        await msg.edit_text(text, parse_mode="Markdown")

    except Exception as e:
        await msg.edit_text(f"❌ Ошибка: {e}")


async def cmd_hashrate(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /hashrate command — show current hashrate."""
    config = load_config()
    msg = await update.message.reply_text("⏳ Загружаю данные о хешрейте...")

    try:
        viabtc = ViaBTCClient(
            api_key=config["viabtc_api_key"],
            secret_key=config["viabtc_secret_key"],
        )

        coins = list(set(m.get("coin", "BTC").upper() for m in config.get("miners", [])))
        if not coins:
            coins = ["BTC", "LTC"]

        text = "⛏️ *СТАТУС ХЕШРЕЙТА*\n\n"

        for coin in coins:
            hashrate = viabtc.get_account_hashrate(coin)
            miners = viabtc.get_miner_hashrate(coin)

            if hashrate.get("code") == 0:
                hr_data = hashrate.get("data", {})
                text += f"*{coin}*\n"
                text += f"  ├ Хешрейт (10мин): {hr_data.get('hashrate_10min', 'N/A')}\n"
                text += f"  ├ Хешрейт (1ч): {hr_data.get('hashrate_1hour', 'N/A')}\n"
                text += f"  └ Хешрейт (24ч): {hr_data.get('hashrate_1day', 'N/A')}\n\n"
            else:
                text += f"*{coin}*: ⚠️ {hashrate.get('message', 'Error')}\n\n"

            if miners.get("code") == 0:
                miners_data = miners.get("data", {})
                miner_list = miners_data if isinstance(miners_data, list) else miners_data.get("data", [])
                if miner_list:
                    text += f"  *Майнеры {coin}:*\n"
                    for m in miner_list[:10]:
                        name = m.get("miner", "Unknown")
                        status = "🟢" if m.get("status", "") == "active" else "🔴"
                        hr = m.get("hashrate_1day", "N/A")
                        text += f"  {status} {name}: {hr}\n"
                    text += "\n"

        text += f"_Обновлено: {datetime.now(ZoneInfo('Europe/Moscow')).strftime('%H:%M МСК')}_"
        await msg.edit_text(text, parse_mode="Markdown")

    except Exception as e:
        await msg.edit_text(f"❌ Ошибка: {e}")


async def cmd_ai(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /ai command — get AI analysis only."""
    config = load_config()
    msg = await update.message.reply_text("🤖 Генерирую AI-анализ рынка...")

    try:
        price_client = PriceClient()
        prices = price_client.get_prices(coins=["BTC", "LTC", "DOGE"])
        market_overview = price_client.get_market_overview()
        difficulty_data = price_client.get_mining_difficulty_data()

        # Create a simplified profitability report for AI
        calculator = ProfitabilityCalculator(
            electricity_price_rub_kwh=config.get("electricity_price_rub_kwh", 5.7),
            miners=config.get("miners", []),
        )
        usdt_rub = price_client.get_usdt_rub_rate() or 92.0

        # Minimal ViaBTC data for AI context
        viabtc = ViaBTCClient(
            api_key=config["viabtc_api_key"],
            secret_key=config["viabtc_secret_key"],
        )
        coins = list(set(m.get("coin", "BTC").upper() for m in config.get("miners", [])))
        viabtc_data = viabtc.get_all_mining_data(coins=coins)

        report = calculator.calculate_net_profit(viabtc_data, prices, usdt_rub)

        openai_key = config.get("openai_api_key")
        if openai_key and not openai_key.startswith("YOUR_"):
            ai = AIAnalyst(api_key=openai_key)
        else:
            ai = AIAnalyst()

        ai_result = ai.generate_analysis(
            profitability_report=report,
            prices=prices,
            market_overview=market_overview,
            difficulty_data=difficulty_data,
        )

        analysis = ai_result.get("analysis", "Анализ недоступен")
        fng = ai_result.get("fear_greed_index", {})

        text = f"🤖 *AI-АНАЛИЗ РЫНКА*\n"
        text += f"📅 {datetime.now(ZoneInfo('Europe/Moscow')).strftime('%d.%m.%Y %H:%M')} МСК\n"
        text += f"{'━' * 32}\n\n"
        text += analysis

        if len(text) > 4096:
            parts = split_message(text, 4096)
            await msg.delete()
            for part in parts:
                await update.message.reply_text(part, parse_mode="Markdown")
        else:
            await msg.edit_text(text, parse_mode="Markdown")

    except Exception as e:
        logger.error(f"AI analysis failed: {e}", exc_info=True)
        await msg.edit_text(f"❌ Ошибка AI-анализа: {e}")


async def cmd_history(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /history command — show profit history."""
    db = Database()
    reports = db.get_recent_reports(days=7)

    if not reports:
        await update.message.reply_text("📭 История пока пуста. Запустите /report для создания первого отчёта.")
        return

    text = "📈 *ИСТОРИЯ ПРИБЫЛЬНОСТИ (7 дней)*\n\n"

    # Group by date
    by_date = {}
    for r in reports:
        d = r.get("report_date", "")
        if d not in by_date:
            by_date[d] = []
        by_date[d].append(r)

    for report_date, records in sorted(by_date.items(), reverse=True):
        text += f"📅 *{report_date}*\n"
        daily_total = 0
        for r in records:
            coin = r.get("coin", "")
            net = r.get("net_profit_usdt", 0)
            daily_total += net
            emoji = "✅" if net > 0 else "❌"
            text += f"  {emoji} {coin}: {net:+.2f} USDT\n"
        total_emoji = "✅" if daily_total > 0 else "❌"
        text += f"  {total_emoji} Итого: *{daily_total:+.2f} USDT*\n\n"

    await update.message.reply_text(text, parse_mode="Markdown")


async def cmd_settings(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /settings command."""
    config = load_config()

    text = "⚙️ *НАСТРОЙКИ*\n\n"
    text += f"💡 Цена электричества: {config.get('electricity_price_rub_kwh', 0)} руб/кВт·ч\n"
    text += f"⏰ Ежедневный отчёт: 08:00 МСК\n\n"

    text += "⛏️ *Майнеры:*\n"
    for m in config.get("miners", []):
        text += f"  • {m.get('name', 'Unknown')} — {m.get('coin', '?')}"
        text += f" ({m.get('power_w', 0)}W"
        if m.get("count", 1) > 1:
            text += f" x{m['count']}"
        text += ")\n"

    text += "\n📝 Для изменения настроек отредактируйте `config.json`"
    text += "\n\n_Команды:_\n"
    text += "/set\\_electricity `<цена>` — изменить цену электричества\n"
    text += "/set\\_time `<HH:MM>` — изменить время отчёта"

    await update.message.reply_text(text, parse_mode="Markdown")


async def cmd_set_electricity(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /set_electricity command."""
    if not context.args:
        await update.message.reply_text("Использование: /set\\_electricity `5.7`", parse_mode="Markdown")
        return

    try:
        new_price = float(context.args[0])
        config = load_config()
        config["electricity_price_rub_kwh"] = new_price

        with open(CONFIG_PATH, "w") as f:
            json.dump(config, f, indent=2, ensure_ascii=False)

        await update.message.reply_text(
            f"✅ Цена электричества обновлена: *{new_price} руб/кВт·ч*",
            parse_mode="Markdown",
        )
    except ValueError:
        await update.message.reply_text("❌ Неверный формат. Пример: /set\\_electricity 5.7")


async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /help command."""
    text = (
        "ℹ️ *ПОМОЩЬ*\n\n"
        "*Основные команды:*\n"
        "/report — Полный отчёт о прибыльности с AI-анализом\n"
        "/prices — Текущие курсы BTC, LTC, DOGE\n"
        "/hashrate — Статус хешрейта на ViaBTC\n"
        "/ai — AI-анализ рынка и рекомендации\n"
        "/history — История прибыльности за 7 дней\n\n"
        "*Настройки:*\n"
        "/settings — Текущие настройки\n"
        "/set\\_electricity `<цена>` — Изменить цену электричества\n\n"
        "*Автоматические отчёты:*\n"
        "Бот автоматически отправляет полный отчёт каждый день в 08:00 МСК.\n\n"
        "*Источники данных:*\n"
        "• ViaBTC API — данные о майнинге\n"
        "• CoinGecko — курсы криптовалют\n"
        "• OpenAI GPT — AI-аналитика\n"
        "• Fear & Greed Index — настроение рынка\n"
    )
    await update.message.reply_text(text, parse_mode="Markdown")


# ============================================================
# Callback Query Handler (inline buttons)
# ============================================================

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle inline button presses."""
    query = update.callback_query
    await query.answer()

    if query.data == "report":
        await query.message.reply_text("⏳ Генерирую отчёт...")
        config = load_config()
        try:
            report_text = await generate_full_report(config)
            if len(report_text) > 4096:
                parts = split_message(report_text, 4096)
                for part in parts:
                    await query.message.reply_text(part, parse_mode="Markdown")
            else:
                await query.message.reply_text(report_text, parse_mode="Markdown")
        except Exception as e:
            await query.message.reply_text(f"❌ Ошибка: {e}")

    elif query.data == "prices":
        # Reuse prices logic
        price_client = PriceClient()
        prices = price_client.get_prices(coins=["BTC", "LTC", "DOGE"])
        usdt_rub = price_client.get_usdt_rub_rate()

        text = "💰 *КУРСЫ*\n\n"
        for coin, data in prices.items():
            usd = data.get("usd", 0)
            change = data.get("usd_24h_change", 0)
            emoji = "🟢" if change >= 0 else "🔴"
            text += f"{emoji} *{coin}*: ${usd:,.2f} ({change:+.1f}%)\n"
        text += f"\n💵 USDT/RUB: {usdt_rub:.2f}"
        await query.message.reply_text(text, parse_mode="Markdown")

    elif query.data == "hashrate":
        await query.message.reply_text("Используйте команду /hashrate")

    elif query.data == "ai_analysis":
        await query.message.reply_text("Используйте команду /ai")

    elif query.data == "history":
        await query.message.reply_text("Используйте команду /history")

    elif query.data == "settings":
        await query.message.reply_text("Используйте команду /settings")


# ============================================================
# Scheduled Tasks
# ============================================================

async def scheduled_daily_report(app: Application):
    """Send daily report to the configured user."""
    config = load_config()
    user_id = config.get("user_id", "")

    if not user_id or user_id.startswith("YOUR_"):
        logger.warning("User ID not configured, skipping scheduled report")
        return

    try:
        report_text = await generate_full_report(config)

        if len(report_text) > 4096:
            parts = split_message(report_text, 4096)
            for part in parts:
                await app.bot.send_message(
                    chat_id=user_id,
                    text=part,
                    parse_mode="Markdown",
                )
        else:
            await app.bot.send_message(
                chat_id=user_id,
                text=report_text,
                parse_mode="Markdown",
            )

        logger.info(f"Daily report sent to user {user_id}")

    except Exception as e:
        logger.error(f"Failed to send daily report: {e}", exc_info=True)
        try:
            await app.bot.send_message(
                chat_id=user_id,
                text=f"❌ Ошибка генерации ежедневного отчёта:\n`{str(e)}`",
                parse_mode="Markdown",
            )
        except Exception:
            pass


# ============================================================
# Utility Functions
# ============================================================

def split_message(text: str, max_length: int = 4096) -> list:
    """Split a long message into parts respecting Telegram limits."""
    if len(text) <= max_length:
        return [text]

    parts = []
    while text:
        if len(text) <= max_length:
            parts.append(text)
            break

        # Find a good split point
        split_at = text.rfind("\n", 0, max_length)
        if split_at == -1:
            split_at = max_length

        parts.append(text[:split_at])
        text = text[split_at:].lstrip("\n")

    return parts


# ============================================================
# Main
# ============================================================

def main():
    """Start the bot."""
    config = load_config()
    token = config.get("telegram_token", "")

    if not token or token.startswith("YOUR_"):
        logger.error("Telegram bot token not configured!")
        print("❌ Пожалуйста, установите telegram_token в config.json")
        sys.exit(1)

    # Build application
    app = Application.builder().token(token).build()

    # Register command handlers
    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("report", cmd_report))
    app.add_handler(CommandHandler("prices", cmd_prices))
    app.add_handler(CommandHandler("hashrate", cmd_hashrate))
    app.add_handler(CommandHandler("ai", cmd_ai))
    app.add_handler(CommandHandler("history", cmd_history))
    app.add_handler(CommandHandler("settings", cmd_settings))
    app.add_handler(CommandHandler("set_electricity", cmd_set_electricity))
    app.add_handler(CommandHandler("help", cmd_help))
    app.add_handler(CallbackQueryHandler(button_handler))

    # Setup scheduler for daily reports
    scheduler = AsyncIOScheduler(timezone="Europe/Moscow")
    scheduler.add_job(
        scheduled_daily_report,
        CronTrigger(hour=8, minute=0, timezone="Europe/Moscow"),
        args=[app],
        id="daily_report",
        name="Daily Mining Report",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Scheduler started: daily report at 08:00 MSK")

    # Set bot commands
    async def post_init(application: Application):
        await application.bot.set_my_commands([
            BotCommand("start", "Главное меню"),
            BotCommand("report", "Полный отчёт о прибыльности"),
            BotCommand("prices", "Текущие курсы криптовалют"),
            BotCommand("hashrate", "Статус хешрейта"),
            BotCommand("ai", "AI-анализ и рекомендации"),
            BotCommand("history", "История за 7 дней"),
            BotCommand("settings", "Настройки"),
            BotCommand("help", "Помощь"),
        ])

    app.post_init = post_init

    # Start polling
    logger.info("Bot starting...")
    print("🤖 Mining Monitor Bot запущен!")
    print("📊 Ежедневный отчёт: 08:00 МСК")
    print("Нажмите Ctrl+C для остановки")

    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
