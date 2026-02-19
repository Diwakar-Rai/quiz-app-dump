import { EventManager } from "./eventManager";
import { Reporter } from "./reporter";
import type { ExamGuardConfig, ViolationEvent } from "./types";
import { ViolationEngine } from "./violationEngine";

export class ExamGuard {
  private engine: ViolationEngine;
  private reporter: Reporter;
  private events: EventManager;

  constructor(private config: ExamGuardConfig) {
    this.engine = new ViolationEngine(config);
    this.reporter = new Reporter();

    this.events = new EventManager(
      this.handleViolation.bind(this),
      config.idleTimeoutMs,
    );
  }

  async start() {
    await document.documentElement.requestFullscreen();
    this.events.init();
  }

  stop() {
    this.events.cleanup();
  }

  private handleViolation(event: ViolationEvent) {
    this.engine.handleViolation(event);
    this.reporter.capture(event);
  }
}
