# hello-world-api

Minimal Express API for testing APD-Deploy env var injection.

## Endpoints

| Path | Returns |
|------|---------|
| `GET /` | JSON showing build-time and runtime vars |
| `GET /health` | `{ "status": "ok" }` |

## Expected response after deploy

```json
{
  "message": "Hello, World!",
  "buildTime": {
    "description": "Baked into the image at docker build time — fixed until next build",
    "vars": {
      "version": "1.0.0",
      "buildDate": "2025-05-29",
      "gitCommit": "abc1234"
    }
  },
  "runtime": {
    "description": "Injected by the platform at container start — change in Config tab, then redeploy",
    "vars": {
      "APP_GREETING": "Hello",
      "APP_NAME": "World",
      "APP_COLOR": "blue"
    }
  }
}
```

## Local dev

```bash
npm install
APP_GREETING=Hey APP_NAME=Oliver APP_COLOR=green node src/index.js
curl http://localhost:3000/
```
