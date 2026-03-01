# Reel to Reality

Social challenge platform: **web** (React + TypeScript) and **native** (Expo). Backend: Express in `server/`.

## Setup

```bash
npm install
cd server && npm install && cd ..
```

## Run

**Single server (API + web app on one port):**
```bash
npm start
```
Builds the web app, then serves everything at **http://localhost:3001**

**Dev (hot reload):**
```bash
npm run dev          # Expo web dev (port 8081)
npm run fix          # backend only (port 3001)
npm run serve        # server only (run after npm run build)
```

**Native:**
```bash
npm run web          # or expo start, then i/a for iOS/Android
```

## Project layout

| Path | Purpose |
|------|--------|
| `App.js` | Entry: web → `src/App.tsx`, native → screens + navigation |
| `src/` | Web app (pages, components, context, services) |
| `screens/` | Native screens (Expo) |
| `server/` | Express API + `data/*.json` |
| `scripts/` | start, restart, fix, frontend |
| `context/`, `navigation/`, `data/` | Native app context, tabs, mock data |

## Demo

- **App:** http://localhost:3001  
- **Business:** http://localhost:3001/business-auth  
- Demo: `demo@business.com` / `password123`

## Deploy to Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Leave **Build Command** and **Output Directory** as in `vercel.json` (or use defaults; the repo’s `vercel.json` is enough).
3. Deploy. The app (static frontend + API) will be served from one Vercel URL.

No extra env vars are required. API uses `/tmp` on Vercel for storage (resets on cold starts).
