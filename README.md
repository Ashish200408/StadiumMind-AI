# StadiumMind AI

StadiumMind AI is a next-generation unified intelligence platform designed for complex venue and stadium operations. It fuses deterministic physics-based simulations, domain-specific intelligence engines, and the Google Gemini Operations Copilot into a single cohesive brain.

## Problem Statement
Modern stadiums generate massive amounts of IoT data (crowd flow, gate throughput, temperature). Human operators struggle to parse this raw data during crises. Relying solely on AI to manage this data introduces the risk of "hallucinations" affecting critical safety operations (e.g., an AI incorrectly telling security to open a broken gate).

**Our Solution**: A strict "Clean Architecture" where deterministic rules handle the math and physics, and Gemini AI handles the explainability, reporting, and natural language interfaces.

## Features
- **Deterministic Simulation Engine**: Simulates realistic stadium IoT data (Crowds, Weather, Incidents).
- **5 Intelligence Core Engines**: Crowd, Mobility, Emergency, Sustainability, and Accessibility.
- **Executive Command Center**: A real-time dashboard visualizing overall venue health and risks.
- **AI Explainability Panel**: Select any operational alert and ask Gemini *why* the system flagged it, referencing exact data points.
- **Automated Reporting**: One-click generation of After-Action, Sustainability, and Shift reports via Gemini.
- **Application Health Dashboard**: Diagnostics and observability built-in.

## Architecture & AI Workflow
1. **Simulation Layer** generates data.
2. **Intelligence Engines** apply strict thresholds (e.g. density > 80% = Crush Risk).
3. **Unified Intelligence Core** bundles all alerts into a single JSON payload.
4. **Gemini Copilot** reads this JSON as context and generates human-readable explanations and reports.

*For detailed technical architecture, see `docs/architecture.md` and `docs/system-flow.md`.*

## Folder Structure
```
src/
├── components/       # Reusable UI components
├── config/           # Environment and Firebase configurations
├── features/         # Feature-based modular architecture
│   ├── ai-copilot/
│   ├── crowd-intelligence/
│   ├── emergency-intelligence/
│   ├── executive-intelligence/
│   ├── intelligence-core/
│   ├── mobility-intelligence/
│   ├── simulation/
│   └── sustainability-intelligence/
├── layouts/          # Dashboard and Auth wrappers
├── pages/            # Routable pages
└── utils/            # Logging and telemetry
```

## Installation & Running Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add the following:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Screenshots
*(Insert placeholders here)*
- `![Executive Dashboard](./docs/assets/dashboard.png)`
- `![AI Explainability](./docs/assets/explainability.png)`

## Future Improvements
- Migration of Gemini API calls to a secure Node.js backend.
- Implementation of real WebSockets to replace the client-side simulation engine.
- RAG (Retrieval-Augmented Generation) integration to reference historical venue SOPs.
