# test-api

Sample Node.js Express API — used for testing APD-Deploy's repo scanning,
env var detection, and Dockerfile generation.

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | – | Health check (ALB target) |
| POST | /auth/token | – | Issue JWT access + refresh tokens |
| GET | /items | Bearer | List items |
| GET | /items/:id | Bearer | Get one item |
| POST | /items | Bearer | Create item |

## Local dev

```bash
cp .env.example .env
# Fill in values
npm install
npm run dev
```

## Tests

```bash
npm test
```

## Environment variables

See `.env.example` for the full reference.

Runtime vars are read in `src/config.js`. Build-time args are documented
in `.env.example` under the "Build-time variables" section.
