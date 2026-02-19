import type { ExamGuardConfig, ViolationEvent } from "./types";

export class ViolationEngine {
  private score = 0;
  constructor(private config: ExamGuardConfig) {}
  handleViolation(event: ViolationEvent) {
    const weight = this.config.violationWeights[event.type] || 1;
    this.score += weight;
    if (this.score >= this.config.maxScore) {
      this.config.autoSubmit();
    }
  }
  getScore() {
    return this.score;
  }
}
