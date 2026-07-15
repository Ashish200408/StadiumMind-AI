# System Architecture

StadiumMind AI follows a strict "Clean Architecture" pattern, explicitly separating deterministic physics/rules-based logic from non-deterministic AI generation.

## 1. Simulation Layer
At the base is the **Simulation Engine** (`src/features/simulation`). In a production environment, this would be the IoT ingestion layer. For the demo, it is a deterministic mock engine running on a `requestAnimationFrame` loop that generates realistic venue data:
- Crowd Densities
- Gate Throughput
- Environment/Weather
- Incidents (Fires, Medical)

## 2. Intelligence Engines
Built on top of the simulation are five domain-specific Intelligence Engines. These engines do **NOT** use AI. They use deterministic business logic to convert raw data into domain-specific statuses, alerts, and recommendations.
- **Crowd Intelligence** (`src/features/crowd-intelligence`)
- **Mobility Intelligence** (`src/features/mobility-intelligence`)
- **Emergency Intelligence** (`src/features/emergency-intelligence`)
- **Sustainability Intelligence** (`src/features/sustainability-intelligence`)
- **Accessibility Intelligence** (`src/features/accessibility-intelligence`)

## 3. Unified Intelligence Layer
The **Intelligence Core** (`src/features/intelligence-core`) aggregates the outputs from all five domain engines into a single, cohesive JSON payload: `UnifiedIntelligence`. This acts as the single source of truth for the entire venue.

## 4. AI Copilot (Gemini)
The **AI Copilot** (`src/features/ai-copilot`) is the only module permitted to speak to the Google Gemini API. It takes the `UnifiedIntelligence` payload as its context and provides an NLP chat interface for operators to query the venue state.

## 5. Executive Intelligence Suite
The top tier is the **Executive Dashboard** (`src/features/executive-intelligence`). It consumes the `UnifiedIntelligence` and uses the AI Copilot services to generate human-readable reports, explainable AI decision paths, and high-level health metrics.
