# Submission Checklist

This document ensures all requirements for the Google Prompt Wars challenge are met before final submission.

## Environment Variables
- [ ] `VITE_FIREBASE_API_KEY` configured
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` configured
- [ ] `VITE_FIREBASE_PROJECT_ID` configured
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` configured
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` configured
- [ ] `VITE_FIREBASE_APP_ID` configured
- [ ] `VITE_GEMINI_API_KEY` configured (CRITICAL)

## Build Verification
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` succeeds without TS errors.
- [ ] Application starts successfully on `npm run preview`.
- [ ] `EnvValidator` correctly traps missing environment variables on startup.
- [ ] `HealthDashboard` (`/health`) correctly reports system status.

## Demo Preparation
- [ ] Read and practice `docs/demo-script.md`.
- [ ] Verify `DemoScenarioSelector` successfully injects simulation incidents.
- [ ] Verify `ExplainabilityPanel` returns a response from Gemini.
- [ ] Verify `ReportGenerator` returns a markdown report from Gemini.

## Known Limitations
- **Mocked Auth**: The authentication system uses Firebase schemas but permits mock logins for demo purposes to avoid lockouts.
- **Client-side Secrets**: Vite environment variables (`VITE_GEMINI_API_KEY`) are exposed to the client bundle. In a true production environment, the Gemini AI calls must be moved to a secure backend (e.g., Node.js/Firebase Cloud Functions).
- **Simulation**: The current simulation engine is a client-side mock. A real implementation would require a dedicated backend streaming IoT sensor data via WebSockets.

## Future Roadmap
1. **Backend Migration**: Move all Gemini API interactions to a secure microservice.
2. **Real-time IoT**: Replace the simulation loop with WebSockets connecting to physical venue sensors.
3. **Advanced RAG**: Implement Retrieval-Augmented Generation to allow Gemini to search historical venue data and SOPs (Standard Operating Procedures).
4. **Predictive AI**: Add specific TensorFlow/Vertex models for predictive maintenance before relying entirely on GenAI for inference.
