# Portfolio Retro Cube — Felipe de Paula

Portfólio interativo com visual retro/PS2: um cubo 3D girando com habilidades, sobre, carreira e educação. Construído com Next.js 16 (App Router), React 19, Tailwind CSS 4 e Framer Motion.

> Branch `portfolio-retro-cube` — deploy via Docker Compose.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy com Docker

A aplicação usa a saída `standalone` do Next.js e roda atrás de um nginx como reverse proxy.

### Pré-requisitos

- Docker + Docker Compose

### Subir a aplicação

```bash
docker compose up -d --build
```

A aplicação estará disponível em `http://localhost` (porta 80 via nginx).

### Verificar status

```bash
docker compose ps
docker compose logs -f app      # logs do Next.js
docker compose logs -f nginx    # logs do nginx
```

### Atualizar para uma nova versão

```bash
git pull
docker compose up -d --build
```

### Parar/remover

```bash
docker compose down            # para os serviços
docker compose down -v         # para e remove os volumes
```

## HTTPS

Por padrão o nginx roda em HTTP na porta 80. Para habilitar HTTPS:

1. Coloque seus certificados SSL em `nginx/certs/` (`fullchain.pem` e `privkey.pem`).
2. Descomente o bloco `server` HTTPS no `nginx/nginx.conf`.
3. Descomente o redirect HTTP -> HTTPS.
4. Reinicie: `docker compose up -d --build`.

## Estrutura

```
src/app/            # rotas e layout (App Router)
src/components/     # CubeScreen, TerminalLoader, SectionView, PS2MeteorBackground
src/lib/            # utils (cn)
nginx/              # configuração do reverse proxy
Dockerfile          # build multi-stage (standalone)
docker-compose.yml  # orquestração app + nginx
```