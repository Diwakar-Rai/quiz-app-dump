import type { ViolationEvent } from "./types";

export class Reporter {
  capture(event: ViolationEvent) {
    console.log(event);
  }
}
