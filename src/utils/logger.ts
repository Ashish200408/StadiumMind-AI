type LogCategory =
  | 'startup'
  | 'navigation'
  | 'gemini_request'
  | 'report_generation'
  | 'export'
  | 'error'
  | 'performance';

interface LogEvent {
  category: LogCategory;
  message: string;
  durationMs?: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

class TelemetryLogger {
  private events: LogEvent[] = [];
  private readonly MAX_EVENTS = 1000;

  // Track startup time
  private startupTime: number;

  constructor() {
    this.startupTime = Date.now();
    this.log('startup', 'Application initialized', {
      environment: import.meta.env.MODE,
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    });
  }

  public log(
    category: LogCategory,
    message: string,
    metadata?: Record<string, any>,
    startTime?: number
  ) {
    const timestamp = new Date().toISOString();
    const durationMs = startTime ? Date.now() - startTime : undefined;

    const event: LogEvent = {
      category,
      message,
      durationMs,
      metadata,
      timestamp,
    };

    this.events.unshift(event);
    if (this.events.length > this.MAX_EVENTS) {
      this.events.pop();
    }

    // In a real application, you might batch these and send them to a telemetry service (e.g., DataDog, Sentry, Google Analytics)
    // For this demo, we output to console in development mode, or just keep them in memory.
    if (import.meta.env.MODE === 'development') {
      const durationStr = durationMs !== undefined ? `[${durationMs}ms]` : '';
      console.log(`[Telemetry][${category}] ${durationStr} ${message}`, metadata || '');
    }
  }

  public getEvents(category?: LogCategory): LogEvent[] {
    if (category) {
      return this.events.filter((e) => e.category === category);
    }
    return this.events;
  }

  public getStartupDuration(): number {
    return Date.now() - this.startupTime;
  }
}

// Singleton instance
export const logger = new TelemetryLogger();
