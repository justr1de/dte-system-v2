#!/bin/bash
# ProviDATA - Script de Restauração da Evolution API
# Data: 2026-02-14
# Uso: sudo bash restore-evolution-api.sh

echo "=== ProviDATA - Restauração Evolution API ==="

# 1. Criar rede Docker
echo "[1/4] Criando rede Docker..."
docker network create evolution-net 2>/dev/null || echo "Rede já existe"

# 2. Subir PostgreSQL
echo "[2/4] Iniciando PostgreSQL..."
docker stop evolution-postgres 2>/dev/null
docker rm evolution-postgres 2>/dev/null
docker run -d \
  --name evolution-postgres \
  --restart always \
  --network evolution-net \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=evolution_db_pass \
  -e POSTGRES_DB=evolution \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15

echo "Aguardando PostgreSQL inicializar..."
sleep 10

# 3. Subir Redis (opcional)
echo "[3/4] Iniciando Redis..."
docker stop evolution-redis 2>/dev/null
docker rm evolution-redis 2>/dev/null
docker run -d \
  --name evolution-redis \
  --restart always \
  --network evolution-net \
  -p 6379:6379 \
  redis:7

sleep 3

# 4. Subir Evolution API
echo "[4/4] Iniciando Evolution API..."
docker stop evolution-api 2>/dev/null
docker rm evolution-api 2>/dev/null
docker run -d \
  --name evolution-api \
  --restart always \
  --network host \
  --dns 8.8.8.8 \
  -e NODE_OPTIONS="--network-family-autoselection-attempt-timeout=1000" \
  -e CONFIG_SESSION_PHONE_VERSION="2.3000.1028450369" \
  -e DATABASE_SAVE_DATA_INSTANCE=true \
  -e DATABASE_SAVE_DATA_CHATS=true \
  -e DATABASE_SAVE_DATA_CONTACTS=true \
  -e DATABASE_SAVE_DATA_NEW_MESSAGE=true \
  -e DATABASE_CONNECTION_URI="postgresql://postgres:evolution_db_pass@localhost:5432/evolution" \
  -e SERVER_URL="http://34.39.236.69:8080" \
  -e DATABASE_ENABLED=true \
  -e DEL_INSTANCE=false \
  -e AUTHENTICATION_API_KEY="providata-evolution-key-2026" \
  -e QRCODE_LIMIT=30 \
  -e AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true \
  -e CONFIG_SESSION_PHONE_CLIENT="ProviDATA" \
  -e WEBHOOK_GLOBAL_ENABLED=false \
  -e LOG_LEVEL=WARN \
  -e DATABASE_PROVIDER=postgresql \
  -e TZ=America/Sao_Paulo \
  atendai/evolution-api:v2.2.3

echo ""
echo "=== Restauração concluída! ==="
echo "Aguarde 30 segundos para a API inicializar."
echo "Acesse: http://34.39.236.69:8080/manager"
echo "API Key: providata-evolution-key-2026"
echo ""
echo "NOTA: Após a restauração, será necessário reconectar o WhatsApp via QR Code."
