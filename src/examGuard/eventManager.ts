import type { ViolationEvent } from "./types";

export class EventManager {
  private listeners: (() => void)[] = [];
  constructor(
    private onViolation: (event: ViolationEvent) => void,
    private idleTimeout: number,
  ) {}
  init() {
    this.handleBlur();
    this.handleDevtools();
    this.handleKeys();
    this.handleFullScreen();
    this.handleVisibility();
    this.handleIdle();
  }
  cleanup() {
    this.listeners.forEach(remove => remove());
  }
  private handleVisibility() {
    const fn = () => {
      if (document.hidden) {
        this.onViolation({
          type: "TAB_SWITCH",
          timestamp: Date.now(),
        });
      }
    };

    document.addEventListener("visibilitychange", fn);
    this.listeners.push(() =>
      document.removeEventListener("visibilitychange", fn),
    );
  }
  private handleKeys() {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        this.onViolation({
          type: "ESCAPE_PRESSED",
          timestamp: Date.now(),
        });
      }

      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key))
      ) {
        e.preventDefault();
        this.onViolation({
          type: "DEVTOOLS_SHORTCUT",
          timestamp: Date.now(),
        });
      }
    };

    document.addEventListener("keydown", fn);
    this.listeners.push(() => document.removeEventListener("keydown", fn));
  }
  private handleFullScreen() {
    const fn = () => {
      if (!document.fullscreenElement) {
        this.onViolation({
          type: "EXIT_FULLSCREEN",
          timestamp: Date.now(),
        });
      }
    };

    document.addEventListener("fullscreenchange", fn);
    this.listeners.push(() =>
      document.removeEventListener("fullscreenchange", fn),
    );
  }
  private handleBlur() {
    const fn = () => {
      this.onViolation({
        type: "WINDOW_BLUR",
        timestamp: Date.now(),
      });
    };

    window.addEventListener("blur", fn);
    this.listeners.push(() => window.removeEventListener("blur", fn));
  }
  private handleIdle() {
    let lastActivity = Date.now();

    const update = () => (lastActivity = Date.now());

    document.addEventListener("mousemove", update);
    document.addEventListener("keydown", update);

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > this.idleTimeout) {
        this.onViolation({
          type: "IDLE",
          timestamp: Date.now(),
        });
      }
    }, 10000);

    this.listeners.push(() => {
      document.removeEventListener("mousemove", update);
      document.removeEventListener("keydown", update);
      clearInterval(interval);
    });
  }
  private handleDevtools() {
    const interval = setInterval(() => {
      const threshold = 160;

      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        this.onViolation({
          type: "DEVTOOLS_OPEN",
          timestamp: Date.now(),
        });
      }
    }, 1000);

    this.listeners.push(() => clearInterval(interval));
  }
}
