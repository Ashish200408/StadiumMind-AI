# System Flow

The data flow in StadiumMind AI is unidirectional, ensuring strict separation of concerns and preventing AI hallucinations from affecting operational logic.

```mermaid
graph TD
    A[Simulation Engine (IoT Mock)] -->|Raw Data| B(Domain Intelligence Engines)
    B -->|Deterministic Logic| C{Unified Intelligence Core}
    C -->|Aggregated Payload| D[Executive Dashboard UI]
    C -->|Context| E[Gemini AI Copilot Service]
    E -->|Insights/Reports| D
```

## Step-by-Step Data Flow

1. **Generation (Simulation)**: The `SimulationEngine` runs continuously, updating Zustand stores with raw venue metrics (e.g., Temperature: 42°C).
2. **Analysis (Domain Engines)**: The `SustainabilityEngine` detects the temperature spike. Using strict deterministic thresholds, it flags a "High Heat Risk" and issues an immediate action "Deploy cooling stations".
3. **Aggregation (Core)**: The `IntelligenceCoreStore` subscribes to the domain engines. It pulls this new alert and bundles it into the `UnifiedIntelligence` object.
4. **Display (Dashboard)**: The `ExecutiveDashboard` receives the updated `UnifiedIntelligence`. It flashes the alert on the screen and updates the stadium health score.
5. **Explainability (AI)**: The user clicks the alert and requests an explanation. The `UnifiedIntelligence` context is sent to the `gemini-service`. Gemini reads the JSON, understands the thresholds, and generates a natural language explanation of *why* the alert was triggered.
