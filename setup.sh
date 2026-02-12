#!/bin/bash
# ============================================================
# Mining Monitor Bot — Setup Script
# Интерактивная настройка бота на Ubuntu VPS
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo ""
echo -e "${BOLD}⛏️  Mining Monitor Bot — Настройка${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================================
# 1. Check prerequisites
# ============================================================

echo -e "${YELLOW}[1/5]${NC} Проверка зависимостей..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker не найден. Устанавливаю...${NC}"
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Docker установлен${NC}"
    echo -e "${YELLOW}⚠️  Перезайдите в SSH-сессию, чтобы применить группу docker${NC}"
else
    echo -e "${GREEN}✅ Docker установлен$(docker --version | grep -oP 'version \K[^,]+')${NC}"
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null 2>&1; then
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${YELLOW}Docker Compose не найден. Устанавливаю плагин...${NC}"
        sudo apt-get update -qq && sudo apt-get install -y -qq docker-compose-plugin
        echo -e "${GREEN}✅ Docker Compose установлен${NC}"
    fi
fi

echo ""

# ============================================================
# 2. Create .env file with secrets
# ============================================================

echo -e "${YELLOW}[2/5]${NC} Настройка секретов (.env)..."
echo ""

if [ -f .env ]; then
    echo -e "${YELLOW}Файл .env уже существует.${NC}"
    read -p "Перезаписать? (y/N): " overwrite
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
        echo "Пропускаю настройку .env"
        echo ""
    fi
fi

if [ ! -f .env ] || [[ "$overwrite" =~ ^[Yy]$ ]]; then
    echo -e "${BOLD}Введите данные (они будут сохранены ТОЛЬКО в .env на этом сервере):${NC}"
    echo ""

    read -p "🤖 Telegram Bot Token (от @BotFather): " TELEGRAM_TOKEN
    read -p "👤 Ваш Telegram User ID (от @userinfobot): " TELEGRAM_USER_ID
    read -p "🔑 ViaBTC API Key: " VIABTC_API_KEY
    read -p "🔐 ViaBTC Secret Key: " VIABTC_SECRET_KEY
    read -p "🧠 OpenAI API Key (Enter чтобы пропустить): " OPENAI_API_KEY

    cat > .env << EOF
# Mining Monitor Bot — Secrets
# Создан: $(date '+%Y-%m-%d %H:%M:%S')
# ⚠️ НИКОГДА не коммитьте этот файл в Git!

TELEGRAM_TOKEN=${TELEGRAM_TOKEN}
TELEGRAM_USER_ID=${TELEGRAM_USER_ID}
VIABTC_API_KEY=${VIABTC_API_KEY}
VIABTC_SECRET_KEY=${VIABTC_SECRET_KEY}
OPENAI_API_KEY=${OPENAI_API_KEY}
EOF

    chmod 600 .env
    echo ""
    echo -e "${GREEN}✅ Файл .env создан (права: 600 — только владелец)${NC}"
fi

echo ""

# ============================================================
# 3. Create config.json with miners
# ============================================================

echo -e "${YELLOW}[3/5]${NC} Настройка майнеров (config.json)..."
echo ""

if [ -f config.json ]; then
    echo -e "${YELLOW}Файл config.json уже существует.${NC}"
    read -p "Перезаписать? (y/N): " overwrite_config
    if [[ ! "$overwrite_config" =~ ^[Yy]$ ]]; then
        echo "Пропускаю настройку config.json"
        echo ""
    fi
fi

if [ ! -f config.json ] || [[ "$overwrite_config" =~ ^[Yy]$ ]]; then
    read -p "💡 Цена электричества (руб/кВт·ч) [5.7]: " ELEC_PRICE
    ELEC_PRICE=${ELEC_PRICE:-5.7}

    read -p "⏰ Час отправки отчёта (МСК, 0-23) [8]: " REPORT_HOUR
    REPORT_HOUR=${REPORT_HOUR:-8}

    echo ""
    echo -e "${BOLD}Добавьте майнеры (введите 'done' для завершения):${NC}"
    echo ""

    MINERS="["
    FIRST=true

    while true; do
        read -p "Модель майнера (или 'done'): " MINER_NAME
        if [ "$MINER_NAME" = "done" ] || [ -z "$MINER_NAME" ]; then
            break
        fi

        read -p "  Монета (BTC/LTC): " MINER_COIN
        MINER_COIN=${MINER_COIN:-BTC}

        read -p "  Мощность (Вт): " MINER_POWER
        MINER_POWER=${MINER_POWER:-3000}

        read -p "  Количество [1]: " MINER_COUNT
        MINER_COUNT=${MINER_COUNT:-1}

        if [ "$FIRST" = true ]; then
            FIRST=false
        else
            MINERS="${MINERS},"
        fi

        MINERS="${MINERS}
    {
      \"name\": \"${MINER_NAME}\",
      \"coin\": \"${MINER_COIN^^}\",
      \"power_w\": ${MINER_POWER},
      \"count\": ${MINER_COUNT}
    }"
        echo -e "  ${GREEN}✅ Добавлен: ${MINER_NAME} (${MINER_COIN^^}, ${MINER_POWER}W x${MINER_COUNT})${NC}"
        echo ""
    done

    MINERS="${MINERS}
  ]"

    cat > config.json << EOF
{
  "electricity_price_rub_kwh": ${ELEC_PRICE},
  "report_hour": ${REPORT_HOUR},
  "report_minute": 0,
  "miners": ${MINERS}
}
EOF

    echo ""
    echo -e "${GREEN}✅ Файл config.json создан${NC}"
fi

echo ""

# ============================================================
# 4. Build and start
# ============================================================

echo -e "${YELLOW}[4/5]${NC} Сборка и запуск бота..."
echo ""

docker compose build --no-cache
docker compose up -d

echo ""
echo -e "${GREEN}✅ Бот запущен!${NC}"

echo ""

# ============================================================
# 5. Verify
# ============================================================

echo -e "${YELLOW}[5/5]${NC} Проверка..."
echo ""

sleep 3
if docker compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Контейнер работает${NC}"
    echo ""
    echo -e "${BOLD}Логи бота:${NC}"
    docker compose logs --tail=10
else
    echo -e "${RED}❌ Контейнер не запустился. Проверьте логи:${NC}"
    docker compose logs --tail=30
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BOLD}🎉 Готово!${NC}"
echo ""
echo "Полезные команды:"
echo "  docker compose logs -f          — смотреть логи"
echo "  docker compose restart           — перезапустить"
echo "  docker compose down              — остановить"
echo "  docker compose up -d --build     — пересобрать и запустить"
echo ""
echo "Откройте бота в Telegram и отправьте /start"
echo ""
