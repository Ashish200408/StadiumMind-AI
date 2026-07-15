# Module Overview

StadiumMind AI is composed of several independent but composable modules, organized by feature.

## 1. Simulation Engine (`src/features/simulation`)
A robust deterministic mock engine that simulates a live stadium environment. It maintains the event timeline (Pre-Match, Halftime, etc.) and generates IoT-style metrics for crowd density, gate status, environment, and incidents.

## 2. Intelligence Engines
- **Crowd Intelligence**: Monitors zone densities, predicts crush risks based on capacity thresholds.
- **Mobility Intelligence**: Manages gate throughput and transport delays.
- **Accessibility Intelligence**: Tracks volunteer availability and prioritizes medical/accessibility requests.
- **Sustainability Intelligence**: Monitors power, water, and weather metrics.
- **Emergency Intelligence**: Evaluates critical incidents, active alerts, and directs rapid response teams.

## 3. Intelligence Core (`src/features/intelligence-core`)
The aggregator. It consumes all 5 Intelligence Engines and exposes a single `UnifiedIntelligence` store containing overall operational scores, global alerts, and recommendations.

## 4. AI Copilot (`src/features/ai-copilot`)
The NLP gateway to the system. Using Gemini 1.5 Pro, it provides contextual chat, allowing operators to query the `UnifiedIntelligence` object. It uses caching and exponential backoff for resilience.

## 5. Executive Intelligence Suite (`src/features/executive-intelligence`)
The primary UI layer. It provides a real-time dashboard of operations, an explainability panel to decipher AI logic, and an automated report generator that exports operational summaries to Markdown and PDF.
