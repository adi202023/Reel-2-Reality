# Reel to Reality

A **social challenge platform** with a web app (React + TypeScript), native mobile app (Expo), and Express backend — all in one repo.

---

## Tech stack

| Layer   | Stack |
|--------|--------|
| **Web** | React 19, TypeScript, React Router, Tailwind-style (NativeWind), Expo Web |
| **Native** | Expo (React Native), React Navigation, NativeWind |
| **Backend** | Express, JWT, bcrypt, JSON file storage in `server/data/` |

---

## Prerequisites

- **Node.js** ≥ 16  
- **npm** ≥ 8  

---

## Setup

```bash
# Root (web + native)
npm install

# Backend
cd server && npm install && cd ..
```

---

## Run

### Single server (API + web on one port)

```bash
npm start
```

Builds the web app and serves it with the API at **http://localhost:3001**.

### Development (hot reload)

| Command        | Description                    | Port  |
|----------------|--------------------------------|-------|
| `npm run dev`  | Expo web dev server            | 8081  |
| `npm run fix`  | Backend only                   | 3001  |
| `npm run serve`| Serve built app (run after build) | 3001 |

### Native (Expo)

```bash
npm run web
# or: npx expo start — then press i (iOS) or a (Android)
```

---

## Project layout

| Path | Purpose |
|------|--------|
| `App.js` | Entry: web → `src/App.tsx`, native → screens + navigation |
| `src/` | Web app (pages, components, context, services) |
| `screens/` | Native (Expo) screens |
| `server/` | Express API; `server/data/*.json` for storage |
| `scripts/` | start, restart, fix, frontend helpers |
| `context/`, `navigation/`, `data/` | Native app context, tabs, mock data |
| `public/` | Static assets for web |
| `dist/` | Web build output (generated) |

---

## Demo

- **App:** http://localhost:3001  
- **Business auth:** http://localhost:3001/business-auth  
- **Demo login:** `demo@business.com` / `password123`

---

## Deploy to Vercel

1. Push the repo to GitHub and [import the project in Vercel](https://vercel.com).
2. Use the repo’s **Build Command** and **Output Directory** from `vercel.json` (or Vercel defaults).
3. Deploy. One URL serves the static frontend and API.

No extra env vars are required. The API uses `/tmp` on Vercel for storage (resets on cold starts).

---

## Repository

**GitHub:** [adi202023/Reel-2-Reality](https://github.com/adi202023/Reel-2-Reality)

---

## License

MIT (or as specified in the repo).
