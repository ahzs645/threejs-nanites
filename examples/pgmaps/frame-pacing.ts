/** Completion tracking, without awaiting every frame or building an unbounded promise queue. */
export class FramePacing {
  inFlight = 0; latencyMs = 0; completed = 0; skippedQueue = 0; skippedFps = 0; failures = 0;
  private last = -Infinity;
  private pending = new Set<Promise<void>>();
  allow(now: number, maxFps: number, maxInFlight: number): boolean {
    if (this.inFlight >= maxInFlight) { this.skippedQueue++; return false; }
    if (maxFps > 0 && now - this.last + .01 < 1000 / maxFps) { this.skippedFps++; return false; }
    this.last = now; return true;
  }
  submitted(done: Promise<unknown>, started: number, clock: () => number = () => performance.now(), onError?: (reason:unknown)=>void): void {
    this.inFlight++;
    let failed=false,reason:unknown;
    const p = done.then(() => { this.completed++; }, error => { this.failures++;failed=true;reason=error; }).finally(() => {
      const ms = Math.max(0, clock() - started);
      this.latencyMs = this.latencyMs ? this.latencyMs * .8 + ms * .2 : ms;
      this.inFlight--; this.pending.delete(p);
      if(failed)onError?.(reason);
    });
    this.pending.add(p);
  }
  async drain(): Promise<void> { await Promise.all(this.pending); }
  stats() { return { inFlight: this.inFlight, completionLatencyMs: this.latencyMs, completed: this.completed, skippedQueue: this.skippedQueue, skippedFps: this.skippedFps, failures: this.failures }; }
}
