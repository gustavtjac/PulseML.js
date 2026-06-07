# PulseML.js

PulseML.js is a browser-based fitness game platform that turns your webcam into a controller. Using [MediaPipe](https://developers.google.com/mediapipe) for real-time pose tracking and [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/) for ML-based movement classification, it tracks exercises like push-ups and squats directly in the browser — no plugins or extra hardware required.

Players can create an account, play games using their body as the controller, save their high scores, and compete on live leaderboards (updated in real time via WebSockets).

## Tech stack

- **Client**: Svelte 5 + Vite, MediaPipe Tasks Vision, ONNX Runtime Web, Socket.IO client
- **Server**: Node.js + Express, better-sqlite3, express-session, Socket.IO, Resend (email)

## Getting started

### Prerequisites

- Node.js
- npm

### 1. Clone the repository

```bash
git clone https://github.com/gustavtjac/PulseML.js
cd PulseML.js
```

### 2. Set up the server

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```
SESSION_SECRET=     # a long random string used to sign session cookies
PORT=               # port the server should run on, e.g. 8080
ADMIN_PASSWORD=     # password for seeding/managing admin access
RESEND_API_KEY=     # API key from resend.com, used for sending emails
CLIENT_URL=         # URL of the running client, e.g. http://localhost:5173
```

Create and seed the database, then start the server:

```bash
npm run database:create
npm start
```

### 3. Set up the client

The server serves the client's production build directly from `client/dist` (see `app.use(express.static('../client/dist'))` in `server/app.js`), so build the client before starting the server:

```bash
cd client
npm install
npm run build
```

Once built, the whole app is available at the URL/port the server is running on (configured via `PORT` in `.env`).

> If you're actively developing the client, you can instead run `npm run dev` to use Vite's dev server with hot-reloading at `http://localhost:5173`.

## Useful scripts

**Server** (`server/`)
- `npm start` — update the database and start the server
- `npm run database:create` — create (and reset) the database
- `npm run database:update` — apply database updates without resetting
- `npm run lint` — format and lint the server code

**Client** (`client/`)
- `npm run dev` — start the Vite dev server
- `npm run build` — build the client for production
- `npm run preview` — preview the production build
- `npm run lint` — format and lint the client code
