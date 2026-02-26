# Miner's Guard – Smart Mining Helmet Frontend

Modern React front-end for the Smart Mining Helmet: live dashboard, home and contact pages, wired to the Miner's Guard API.

## Design

- **Palette:** White (#FFFFFF), Light Green (#90EE90), Dark Grey (#333333)
- **Pages:** Home (hero, features), Dashboard (live values, charts, alerts), Contact (form, info, map)
- **Responsive:** Mobile-first with sticky header and touch-friendly controls

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # serve dist/
```

## API

Base URL: **https://minersgaurdhelmet.onrender.com/api** (override with `VITE_API_BASE` in `.env`).

### Schema (SensorData)

| Field        | Type    | Notes                          |
|-------------|---------|---------------------------------|
| temperature | Number  |                                 |
| humidity    | Number  |                                 |
| gasValue    | Number  |                                 |
| flameStatus | Number  |                                 |
| irValue     | Number  |                                 |
| accelX      | Number  |                                 |
| accelY      | Number  |                                 |
| location    | String  |                                 |
| emergency   | Boolean |                                 |
| reason      | String  |                                 |
| timestamp   | Date    | Default: Date.now on save       |

All fields are optional; send only what the device (e.g. ESP32) provides.

### Endpoints

- **POST /api/data** – Save one sensor payload (JSON body). Response: `201 { success, message }`.
- **GET /api/data** – Get 15 most recent records (newest first). Response: `200 { success, count, data }`.

## Tech

- React 19, Vite 7, react-router-dom, recharts (line charts on dashboard).
