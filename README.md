# GTA6Hub

Comunidade brasileira do GTA 6 — clãs, PSN IDs, feed e muito mais.

## Stack

- Next.js 14 (App Router)
- Turso (libSQL)
- NextAuth v5
- Tailwind CSS
- Vercel (deploy)

## Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha `.env.local`:

```env
TURSO_DATABASE_URL=libsql://seu-banco.turso.io
TURSO_AUTH_TOKEN=seu-token
AUTH_SECRET=gere-com-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

> Para gerar o AUTH_SECRET:
> ```bash
> openssl rand -base64 32
> ```

### 3. Criar banco no Turso

```bash
# Instalar CLI do Turso (se não tiver)
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Criar banco
turso db create gta6hub

# Pegar URL e token
turso db show gta6hub --url
turso db tokens create gta6hub
```

### 4. Rodar migração

```bash
npm run db:migrate
```

### 5. Iniciar o servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

## Estrutura de pastas

```
src/
├── app/
│   ├── auth/
│   │   ├── login/         # Página de login
│   │   └── register/      # Página de registro
│   ├── feed/              # Feed principal (próxima etapa)
│   ├── clans/             # Listagem e criação de clãs
│   ├── profile/           # Perfis de usuário
│   ├── posts/             # Posts individuais
│   └── api/
│       ├── auth/          # NextAuth + registro
│       ├── posts/         # CRUD de posts
│       └── clans/         # CRUD de clãs
├── components/
│   ├── ui/                # Botões, inputs, badges
│   ├── layout/            # Navbar, Sidebar
│   ├── feed/              # PostCard, ComposeBox
│   ├── clans/             # ClanCard, ClanPage
│   └── profile/           # ProfileHeader, PSN Badge
├── lib/
│   ├── db.ts              # Cliente Turso
│   ├── auth.ts            # Configuração NextAuth
│   └── migrate.js         # Script de migração
└── middleware.ts           # Proteção de rotas
```

## Etapas do desenvolvimento

- [x] **Etapa 1** — Base, Auth, Schema
- [ ] **Etapa 2** — Perfis de usuário com PSN ID
- [ ] **Etapa 3** — Clãs (criar, buscar, entrar/sair)
- [ ] **Etapa 4** — Feed e posts
- [ ] **Etapa 5** — Comentários
- [ ] **Etapa 6** — Polimento e deploy na Vercel
