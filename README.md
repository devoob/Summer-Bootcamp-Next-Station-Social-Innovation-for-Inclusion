# MTR Access+ — Hong Kong MTR Accessibility Guide

A mobile-first web app designed for elderly users, wheelchair users, and travelers with heavy luggage to find step-free routes, lifts, and escalators at Hong Kong MTR stations.

Built for the Summer Bootcamp: Next Station — Social Innovation for Inclusion hackathon.

## Features

- **Station Directory** — Search and browse MTR stations with detailed exit-by-exit accessibility info (lifts, escalators, stairs)
- **AI Chat Assistant** — Ask about lifts and step-free routes at any station. Works offline with local station data, plus live lookups from MTR's official barrier-free database (80+ stations)
- **AR Indoor Navigation** — Step-by-step wayfinding with live camera overlay and simulated corridor view
- **Voice Input & Output** — Speech-to-text dictation for queries, text-to-speech for reading answers aloud
- **Elderly-Friendly UX** — Large fonts (16px+), big tap targets (52px+), high contrast, light theme, mobile-optimized for iPhone 14 Pro

## Stations Covered

Currently 6 stations with detailed exit data:

| Station | Exits with Lifts |
|---------|-----------------|
| Central (中環) | A, G, H, K |
| Mong Kok (旺角) | C3, E1 |
| Admiralty (金鐘) | E |
| Tsim Sha Tsui (尖沙咀) | A1, H |
| HKU (香港大學) | A1, A2, B2, C1 |
| Kennedy Town (堅尼地城) | A, B |

Live lookups for 80+ additional stations via MTR's Barrier-Free Facilities Search API.

## Tech Stack

- **React 19** with TypeScript
- **Vite 6** bundler
- **Tailwind CSS v4**
- **Express** server
- **Lucide React** icons
- **Motion** (Framer Motion fork) for animations
- **Web Speech API** for voice input/output

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser. No API keys required — everything works offline.

## Build for Production

```bash
npm run build
npm start
```
