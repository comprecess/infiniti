# ⛏️ Mining Monitor Bot

**Telegram-бот для ежедневного мониторинга прибыльности майнинга на ViaBTC с AI-аналитикой.**

Бот автоматически отслеживает прибыльность вашего майнинга BTC и LTC/DOGE на пуле ViaBTC, рассчитывает чистую прибыль с учётом расходов на электричество и предоставляет AI-рекомендации по управлению добытой криптовалютой.

---

## 📊 Возможности

- **Ежедневные автоматические отчёты** — полный отчёт каждый день в 08:00 МСК
- **Расчёт прибыльности** — доход минус расходы на электричество в USDT
- **Текущие курсы** — BTC, LTC, DOGE в реальном времени
- **Мониторинг хешрейта** — статус всех майнеров через ViaBTC API
- **AI-аналитика** — анализ рынка и рекомендации на основе GPT
- **Fear & Greed Index** — индикатор настроения рынка
- **История прибыльности** — тренды за последние 7/30 дней
- **Уведомления** — оповещения о важных изменениях

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────┐
│              Telegram Bot                    │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │Commands │  │Scheduler │  │ Callbacks │  │
│  └────┬────┘  └────┬─────┘  └─────┬─────┘  │
│       └────────────┼──────────────┘         │
│                    ▼                         │
│          ┌─────────────────┐                │
│          │ Report Generator │                │
│          └────────┬────────┘                │
│       ┌───────────┼───────────┐             │
│       ▼           ▼           ▼             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ViaBTC   │ │CoinGecko│ │ OpenAI  │       │
│  │  API    │ │  API    │ │  GPT    │       │
│  └─────────┘ └─────────┘ └─────────┘       │
│                    │                         │
│                    ▼                         │
│            ┌──────────────┐                 │
│            │  SQLite DB   │                 │
│            └──────────────┘                 │
└─────────────────────────────────────────────┘
```

## 🚀 Быстрый старт

### 1. Клонирование

```bash
git clone https://github.com/comprecess/infiniti.git
cd infiniti
```

### 2. Создание Telegram-бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot` и следуйте инструкциям
3. Скопируйте полученный **Bot Token**

### 3. Получение ViaBTC API Key

1. Войдите на [viabtc.com](https://www.viabtc.com/)
2. Перейдите в **Account Management → API Management**
3. Нажмите **Create API Key**
4. Скопируйте **API Key** и **Secret Key**
5. Настройте **IP whitelist** (добавьте IP вашего сервера)

### 4. Получение OpenAI API Key

1. Зарегистрируйтесь на [platform.openai.com](https://platform.openai.com/)
2. Создайте API Key в разделе **API Keys**

### 5. Настройка конфигурации

Скопируйте и отредактируйте файл конфигурации:

```bash
cp config.json.example config.json
nano config.json
```

```json
{
  "telegram_token": "7123456789:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "viabtc_api_key": "ваш_api_key_от_viabtc",
  "viabtc_secret_key": "ваш_secret_key_от_viabtc",
  "openai_api_key": "sk-ваш_openai_api_key",
  "user_id": "ваш_telegram_user_id",
  "electricity_price_rub_kwh": 5.7,
  "miners": [
    {
      "name": "Antminer L7",
      "coin": "LTC",
      "hashrate_mh": 9500,
      "power_w": 3425,
      "count": 1
    },
    {
      "name": "Antminer S19 Pro",
      "coin": "BTC",
      "hashrate_th": 110,
      "power_w": 3250,
      "count": 1
    }
  ]
}
```

> **Как узнать свой Telegram User ID?** Отправьте сообщение боту [@userinfobot](https://t.me/userinfobot) — он вернёт ваш ID.

### 6. Запуск

#### Вариант A: Docker (рекомендуется)

```bash
docker-compose up -d
```

#### Вариант B: Напрямую через Python

```bash
# Создайте виртуальное окружение
python3 -m venv venv
source venv/bin/activate

# Установите зависимости
pip install -r requirements.txt

# Запустите бота
python bot.py
```

#### Вариант C: Systemd-сервис (для VPS)

```bash
sudo nano /etc/systemd/system/mining-bot.service
```

```ini
[Unit]
Description=Mining Monitor Telegram Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/infiniti
ExecStart=/home/ubuntu/infiniti/venv/bin/python bot.py
Restart=always
RestartSec=10
Environment=OPENAI_API_KEY=sk-your-key-here

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable mining-bot
sudo systemctl start mining-bot
sudo systemctl status mining-bot
```

## 📱 Команды бота

| Команда | Описание |
|---------|----------|
| `/start` | Главное меню с кнопками |
| `/report` | Полный отчёт о прибыльности с AI-анализом |
| `/prices` | Текущие курсы BTC, LTC, DOGE |
| `/hashrate` | Статус хешрейта на ViaBTC |
| `/ai` | AI-анализ рынка и рекомендации |
| `/history` | История прибыльности за 7 дней |
| `/settings` | Текущие настройки |
| `/set_electricity <цена>` | Изменить цену электричества |
| `/help` | Справка |

## 📋 Пример отчёта

```
📋 ЕЖЕДНЕВНЫЙ ОТЧЁТ О МАЙНИНГЕ
📅 12.02.2026 08:00 (МСК)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 ТЕКУЩИЕ КУРСЫ
  🟢 BTC: $97,250.00 (+2.3%)
  🟢 LTC: $128.50 (+1.1%)
  🟢 DOGE: $0.185 (+3.5%)
  💵 USDT/RUB: 92.50

⛏️ ПРИБЫЛЬНОСТЬ МАЙНИНГА

  BTC ✅
  ├ Доход: 0.00025000 BTC
  ├ Доход: 24.31 USDT
  ├ Электричество: 5.77 USDT (534 ₽)
  └ Чистая прибыль: 18.54 USDT

  LTC ❌
  ├ Доход: 0.08000000 LTC
  ├ Доход: 10.28 USDT
  ├ Электричество: 6.08 USDT (563 ₽)
  └ Чистая прибыль: 4.20 USDT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ИТОГО: ✅ ПРИБЫЛЬНО
  ├ Доход: 34.59 USDT
  ├ Расходы: 11.85 USDT (1097 ₽)
  └ Чистая прибыль: +22.74 USDT

🤖 AI-АНАЛИТИКА
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 РЫНОЧНАЯ СВОДКА
BTC торгуется выше $97K с бычьим импульсом...

💡 РЕКОМЕНДАЦИИ
- BTC: ДЕРЖАТЬ до $100K, частичная фиксация 20%
- LTC: НАКАПЛИВАТЬ, ожидается рост к халвингу
- DOGE: ПРОДАТЬ 50%, конвертировать в BTC
```

## 🔧 Настройка майнеров

В файле `config.json` в массиве `miners` укажите все ваши устройства:

```json
{
  "miners": [
    {
      "name": "Antminer S19 Pro",
      "coin": "BTC",
      "hashrate_th": 110,
      "power_w": 3250,
      "count": 3
    },
    {
      "name": "Antminer L7",
      "coin": "LTC",
      "hashrate_mh": 9500,
      "power_w": 3425,
      "count": 2
    }
  ]
}
```

Поле `count` указывает количество одинаковых устройств.

## 📡 Используемые API

| API | Назначение | Лимиты |
|-----|-----------|--------|
| [ViaBTC Pool API](https://github.com/viabtc/viapool_api/wiki) | Данные о майнинге, хешрейт, прибыль | Требуется API Key |
| [CoinGecko API](https://www.coingecko.com/en/api) | Курсы криптовалют, рыночные данные | 10K запросов/мес (free) |
| [OpenAI API](https://platform.openai.com/) | AI-анализ и рекомендации | По тарифу |
| [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/) | Fear & Greed Index | Бесплатно |
| [Blockchain.info](https://blockchain.info/) | Сложность сети BTC | Бесплатно |

## 📁 Структура проекта

```
infiniti/
├── bot.py              # Основной файл бота (команды, планировщик)
├── viabtc_api.py       # Клиент ViaBTC Pool API
├── price_api.py        # Клиент CoinGecko + blockchain.info
├── profitability.py    # Калькулятор прибыльности
├── ai_analyst.py       # AI-аналитик (OpenAI GPT + новости)
├── database.py         # SQLite база данных
├── config.json         # Конфигурация (не коммитится)
├── config.json.example # Пример конфигурации
├── requirements.txt    # Python зависимости
├── Dockerfile          # Docker образ
├── docker-compose.yml  # Docker Compose конфигурация
├── .env.example        # Пример переменных окружения
├── .gitignore          # Git ignore
└── README.md           # Документация
```

## 🔒 Безопасность

- Файл `config.json` содержит секретные ключи и **не коммитится** в Git
- Используйте **IP whitelist** в настройках ViaBTC API
- Рекомендуется запускать бота на выделенном VPS
- Для OpenAI API установите лимиты расходов

## 📄 Лицензия

MIT License

---

*Разработано с помощью Manus AI*
