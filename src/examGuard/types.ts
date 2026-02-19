export type ViolationType =
  | "TAB_SWITCH"
  | "WINDOW_BLUR"
  | "EXIT_FULLSCREEN"
  | "DEVTOOLS_OPEN"
  | "DEVTOOLS_SHORTCUT"
  | "ESCAPE_PRESSED"
  | "BACK_BUTTON"
  | "IDLE";

export interface ViolationEvent {
  type: ViolationType;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface ExamGuardConfig {
  maxScore: number;
  violationWeights: Record<ViolationType, number>;
  idleTimeoutMs: number;
  autoSubmit: () => void;
}
