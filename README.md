# DTE - Data Tracking Eleitoral

<p align="center">
  <img src="client/public/logo.svg" alt="DTE Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Sistema de análise e acompanhamento de dados eleitorais para campanhas políticas 2026</strong>
</p>

<p align="center">
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#instalação">Instalação</a> •
  <a href="#configuração">Configuração</a> •
  <a href="#uso">Uso</a> •
  <a href="#contribuição">Contribuição</a>
</p>

---

## Sobre o Projeto

O **DTE (Data Tracking Eleitoral)** é uma plataforma completa para análise de dados eleitorais, desenvolvida para auxiliar campanhas políticas nas eleições de 2026. O sistema permite importar, visualizar e analisar dados do TSE (Tribunal Superior Eleitoral), incluindo informações sobre eleitorado, resultados eleitorais e estatísticas por região.

## Funcionalidades

### Dashboard Principal
- Visão geral dos dados eleitorais com métricas em tempo real
- Gráficos de distribuição por faixa etária e escolaridade
- Estatísticas de eleitores, zonas eleitorais e municípios

### Gestão de Eleitorado
- Importação de dados do TSE em formato CSV
- Filtros avançados por município, zona, seção e perfil demográfico
- Exportação de dados filtrados

### Análise de Resultados
- Visualização de resultados eleitorais por cargo e ano
- Comparativo entre candidatos e partidos
- Análise de votos nulos e brancos

### Mapas Eleitorais
- Visualização geográfica dos dados
- Mapas de calor por região
- Análise de concentração de votos

### Área Administrativa
- **Gestão de Usuários**: Controle de acesso com perfis (admin, gestor, político, demo)
- **Relatórios Gerenciais**: Métricas de uso do sistema
- **Dashboard Comparativo**: Análise de tendências entre períodos
- **Logs de Auditoria**: Histórico completo de ações
- **Backup de Dados**: Exportação em CSV/JSON
- **Backups Agendados**: Configuração de backups automáticos
- **Central de Notificações**: Alertas para administradores
- **Configurações do Sistema**: Personalização de aparência e integrações

### Perfil de Usuário
- Upload de foto de perfil
- Histórico de atividades
- Alteração de senha

## Tecnologias

### Frontend
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **shadcn/ui** - Componentes de interface
- **Recharts** - Gráficos e visualizações
- **Wouter** - Roteamento

### Backend
- **Node.js 22** - Runtime
- **Express 4** - Framework web
- **tRPC 11** - API type-safe
- **Drizzle ORM** - Acesso ao banco de dados

### Banco de Dados
- **MySQL/TiDB** - Banco de dados principal
- **Supabase** (opcional) - Backend as a Service

### DevOps
- **Vitest** - Testes unitários
- **GitHub Actions** - CI/CD
- **pnpm** - Gerenciador de pacotes

## Instalação

### Pré-requisitos
- Node.js 22 ou superior
- pnpm 9 ou superior
- MySQL 8 ou TiDB

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/ArcticRBS/dte-system.git
cd dte-system
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Execute as migrações do banco**
```bash
pnpm db:push
```

5. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

O sistema estará disponível em `http://localhost:3000`

## Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `DATABASE_URL` | String de conexão do banco MySQL/TiDB | Sim |
| `JWT_SECRET` | Chave secreta para tokens JWT | Sim |
| `VITE_APP_ID` | ID da aplicação Manus OAuth | Sim |
| `OAUTH_SERVER_URL` | URL do servidor OAuth | Sim |
| `VITE_OAUTH_PORTAL_URL` | URL do portal de login | Sim |
| `SUPABASE_URL` | URL do projeto Supabase | Não |
| `SUPABASE_DATABASE_URL` | String de conexão PostgreSQL | Não |

### Configuração do GitHub Actions

Para ativar o CI/CD, configure os seguintes secrets no repositório GitHub:

1. Acesse **Settings > Secrets and variables > Actions**
2. Adicione os seguintes secrets:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `VITE_APP_ID`
   - `SUPABASE_URL` (opcional)
   - `SUPABASE_DATABASE_URL` (opcional)

## Uso

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Compila o projeto para produção |
| `pnpm test` | Executa os testes unitários |
| `pnpm check` | Verifica erros de TypeScript |
| `pnpm db:push` | Aplica migrações no banco de dados |
| `pnpm db:studio` | Abre o Drizzle Studio para gerenciar o banco |

### Perfis de Usuário

| Perfil | Permissões |
|--------|------------|
| **Admin** | Acesso total ao sistema, incluindo área administrativa |
| **Gestor** | Importação de dados e relatórios |
| **Político** | Visualização de dados e dashboards |
| **Demo** | Acesso limitado para demonstração |

## Estrutura do Projeto

```
dte-system/
├── client/                 # Frontend React
│   ├── public/            # Arquivos estáticos
│   └── src/
│       ├── components/    # Componentes reutilizáveis
│       ├── contexts/      # Contextos React
│       ├── hooks/         # Hooks customizados
│       ├── lib/           # Utilitários e configurações
│       └── pages/         # Páginas da aplicação
├── server/                # Backend Express + tRPC
│   ├── _core/            # Configurações do framework
│   ├── db.ts             # Funções de acesso ao banco
│   └── routers.ts        # Rotas tRPC
├── drizzle/              # Schema e migrações
├── shared/               # Tipos e constantes compartilhados
└── .github/workflows/    # Configurações de CI/CD
```

## Testes

O projeto utiliza Vitest para testes unitários. Para executar:

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar testes com cobertura
pnpm test:coverage
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Convenções de Commit

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

**Desenvolvido para campanhas políticas 2026**

- Repositório: [github.com/ArcticRBS/dte-system](https://github.com/ArcticRBS/dte-system)

---

<p align="center">
  Feito com ❤️ para a democracia brasileira
</p>
