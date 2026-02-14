# ProviDATA - Backup da Configuração Evolution API

**Data:** 2026-02-14
**Responsável:** Equipe ProviDATA

---

## 1. Infraestrutura Google Cloud

| Item | Valor |
|------|-------|
| Projeto GCP | providata |
| VM | evoution-api (e2-small) |
| Zona | southamerica-east1-a |
| IP Externo | 34.39.236.69 |
| Tipo | PREEMPTÍVEL (precisa migrar para standard) |
| SO | Debian/Ubuntu |

---

## 2. Docker Containers

### 2.1 Container: evolution-api

```bash
sudo /usr/bin/docker run -d \
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
```

**Variáveis críticas para correção do bug do QR Code:**
- `NODE_OPTIONS="--network-family-autoselection-attempt-timeout=1000"` (Issue #2388)
- `CONFIG_SESSION_PHONE_VERSION="2.3000.1028450369"` (Issue #2367)
- `--network host` (acesso direto à rede do host)

### 2.2 Container: evolution-postgres

```bash
sudo /usr/bin/docker run -d \
  --name evolution-postgres \
  --restart always \
  --network evolution-net \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=evolution_db_pass \
  -e POSTGRES_DB=evolution \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15
```

### 2.3 Container: evolution-redis (opcional, removido na config atual)

```bash
sudo /usr/bin/docker run -d \
  --name evolution-redis \
  --restart always \
  --network evolution-net \
  -p 6379:6379 \
  redis:7
```

---

## 3. Instância WhatsApp Conectada

| Item | Valor |
|------|-------|
| Instance Name | DATA-RO |
| Instance ID | 89d44948-9254-4724-977d-88d54820db22 |
| Status | open (conectado) |
| Owner JID | 556999089202@s.whatsapp.net |
| Número | +55 69 99908-9202 |
| Token da Instância | 896874AE-3BB3-43DB-83B2-A5B192FAFA4C |
| Integration | WHATSAPP-BAILEYS |
| Client Name | evolution_exchange |
| Contatos | 13 |
| Chats | 20 |
| Mensagens | 3.226 |
| Criada em | 2026-02-14T03:12:11.023Z |

---

## 4. Credenciais

| Serviço | Credencial |
|---------|-----------|
| API Key Global | providata-evolution-key-2026 |
| Token da Instância DATA-RO | 896874AE-3BB3-43DB-83B2-A5B192FAFA4C |
| PostgreSQL User | postgres |
| PostgreSQL Password | evolution_db_pass |
| PostgreSQL Database | evolution |
| PostgreSQL Port | 5432 |

---

## 5. Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| http://34.39.236.69:8080/ | GET | Status da API |
| http://34.39.236.69:8080/manager | GET | Manager Web |
| http://34.39.236.69:8080/instance/fetchInstances | GET | Listar instâncias |
| http://34.39.236.69:8080/instance/connect/{name} | GET | Conectar/QR Code |
| http://34.39.236.69:8080/instance/connectionState/{name} | GET | Estado da conexão |
| http://34.39.236.69:8080/message/sendText/{name} | POST | Enviar mensagem |

**Header obrigatório:** `apikey: providata-evolution-key-2026`

---

## 6. Bug Fix Aplicado

**Problema:** QR Code não era gerado — Baileys entrava em loop infinito de reconexão (Issues #2367, #2388, PR #2365).

**Solução aplicada:**
1. Adicionada variável `NODE_OPTIONS="--network-family-autoselection-attempt-timeout=1000"`
2. Adicionada variável `CONFIG_SESSION_PHONE_VERSION="2.3000.1028450369"`
3. Container configurado com `--network host`

---

## 7. Redes Docker

```bash
# Rede criada para comunicação entre containers
sudo /usr/bin/docker network create evolution-net
```

**Nota:** Com `--network host`, o container evolution-api usa a rede do host diretamente. O PostgreSQL ainda usa a rede evolution-net mas é acessível via localhost:5432.
