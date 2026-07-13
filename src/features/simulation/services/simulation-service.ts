import { useSimulationStore } from '../store/simulation-store';
import { generateFluctuation, seededRandom } from '../utils/generators';

class SimulationEngine {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private tickCount = 0;

  start() {
    if (this.intervalId) return;

    // Run every 2.5 seconds as requested (2-5s)
    this.intervalId = setInterval(() => this.tick(), 2500);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick() {
    this.tickCount++;
    const state = useSimulationStore.getState();
    const speed = state.speed;

    if (!state.isRunning) return;

    this.simulateCrowd(state, speed);
    this.simulateGates(state, speed);
    this.simulateTransport(state, speed);
    this.simulateEnvironment(state, speed);
    this.simulateResources(state, speed);
    this.simulateTimeline(state, speed);
  }

  private simulateCrowd(state: ReturnType<typeof useSimulationStore.getState>, speed: number) {
    const newCrowd = { ...state.crowd };

    Object.keys(newCrowd).forEach((key) => {
      const zone = newCrowd[key];
      // Density fluctuates based on time and zone
      const seed = zone.id.charCodeAt(zone.id.length - 1);
      const variance = 15; // 15% fluctuation max

      // Gradually increase density if pre-match, decrease if post-match
      let baseDensity = zone.density;
      if (state.timeline.phase === 'pre_match') {
        baseDensity = Math.min(100, baseDensity + 0.5 * speed);
      } else if (state.timeline.phase === 'post_match') {
        baseDensity = Math.max(0, baseDensity - 1 * speed);
      }

      const newDensity = Math.max(
        0,
        Math.min(100, generateFluctuation(baseDensity, variance, this.tickCount * seed, speed))
      );

      newCrowd[key] = {
        ...zone,
        timestamp: new Date().toISOString(),
        density: parseFloat(newDensity.toFixed(1)),
        currentCount: Math.floor((newDensity / 100) * zone.capacity),
        status: newDensity > 90 ? 'error' : newDensity > 75 ? 'warning' : 'active',
        severity: newDensity > 90 ? 'critical' : newDensity > 75 ? 'high' : 'low',
      };
    });

    state.updateCrowd(newCrowd);
  }

  private simulateGates(state: ReturnType<typeof useSimulationStore.getState>, speed: number) {
    const newGates = { ...state.gates };

    Object.keys(newGates).forEach((key) => {
      const gate = newGates[key];
      const seed = gate.id.charCodeAt(gate.id.length - 1);

      // Queue lengths fluctuate
      const newQueueLength = Math.max(
        0,
        Math.floor(generateFluctuation(gate.queueLength, 20, this.tickCount * seed, speed))
      );
      const waitTime = Math.max(0, Math.floor(newQueueLength / (gate.throughputPerMinute / 60))); // basic little's law

      newGates[key] = {
        ...gate,
        timestamp: new Date().toISOString(),
        queueLength: newQueueLength,
        estimatedWaitTime: waitTime,
        status: waitTime > 15 ? 'warning' : 'active',
        severity: waitTime > 20 ? 'high' : waitTime > 15 ? 'medium' : 'low',
      };
    });

    state.updateGates(newGates);
  }

  private simulateTransport(state: ReturnType<typeof useSimulationStore.getState>, speed: number) {
    const newTransport = { ...state.transport };

    Object.keys(newTransport).forEach((key) => {
      const t = newTransport[key];
      const seed = t.id.charCodeAt(t.id.length - 1);

      const newOccupancy = Math.max(
        0,
        Math.min(100, generateFluctuation(t.occupancy, 10, this.tickCount * seed, speed))
      );

      newTransport[key] = {
        ...t,
        timestamp: new Date().toISOString(),
        occupancy: parseFloat(newOccupancy.toFixed(1)),
        status: newOccupancy > 95 ? 'error' : newOccupancy > 85 ? 'warning' : 'active',
      };
    });

    state.updateTransport(newTransport);
  }

  private simulateEnvironment(
    state: ReturnType<typeof useSimulationStore.getState>,
    speed: number
  ) {
    if (!state.environment) return;
    const env = state.environment;

    // Slight temperature and wind shifts
    const tempShift = (seededRandom(this.tickCount) - 0.5) * 0.5 * speed;
    const windShift = (seededRandom(this.tickCount + 100) - 0.5) * 2 * speed;

    state.updateEnvironment({
      ...env,
      timestamp: new Date().toISOString(),
      temperature: parseFloat(Math.max(15, Math.min(45, env.temperature + tempShift)).toFixed(1)),
      windSpeed: parseFloat(Math.max(0, env.windSpeed + windShift).toFixed(1)),
    });
  }

  private simulateResources(state: ReturnType<typeof useSimulationStore.getState>, speed: number) {
    if (!state.resources) return;
    const res = state.resources;

    // Resources generally increase during the event
    const energySpike = Math.max(0, Math.sin(this.tickCount * 0.1) * 500);
    const energy = Math.min(10000, 4000 + energySpike);

    state.updateResources({
      ...res,
      timestamp: new Date().toISOString(),
      energyUsage: Math.floor(energy),
      waterConsumption:
        res.waterConsumption + Math.floor(seededRandom(this.tickCount) * 50 * speed),
      wasteLevel: parseFloat(Math.min(100, res.wasteLevel + 0.1 * speed).toFixed(1)),
      status: res.energyUsage > 9000 ? 'warning' : 'active',
    });
  }

  private simulateTimeline(state: ReturnType<typeof useSimulationStore.getState>, speed: number) {
    const t = state.timeline;

    // 1 tick = 1 simulated minute (scaled by speed for demo)
    let nextMinute = t.minute + 0.5 * speed;
    let nextPhase = t.phase;

    if (nextMinute >= 0 && nextMinute < 45 && t.phase === 'pre_match') nextPhase = 'first_half';
    if (nextMinute >= 45 && nextMinute < 60 && t.phase === 'first_half') nextPhase = 'halftime';
    if (nextMinute >= 60 && nextMinute < 105 && t.phase === 'halftime') nextPhase = 'second_half';
    if (nextMinute >= 105 && t.phase === 'second_half') nextPhase = 'post_match';

    // Simulate scoring rarely
    let hScore = t.homeScore;
    let aScore = t.awayScore;
    if (
      (nextPhase === 'first_half' || nextPhase === 'second_half') &&
      seededRandom(this.tickCount) > 0.99
    ) {
      if (seededRandom(this.tickCount + 1) > 0.5) hScore++;
      else aScore++;
    }

    state.updateTimeline({
      phase: nextPhase,
      minute: nextMinute,
      homeScore: hScore,
      awayScore: aScore,
    });
  }
}

export const simulationEngine = new SimulationEngine();
