export class PerformanceTimer {
  private static timers: Map<string, number> = new Map();

  static start(label: string): void {
    if (this.timers.has(label)) {
      console.warn(`⚠️ Timer "${label}" already exists. Skipping start.`);
      return;
    }
    this.timers.set(label, Date.now());
    console.time(label);
  }

  static end(label: string): number {
    console.timeEnd(label);
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = Date.now() - startTime;
      this.timers.delete(label);
      return duration;
    }
    return 0;
  }

  static measure<T>(label: string, fn: () => T): T {
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }

  static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    try {
      const result = await fn();
      this.end(label);
      return result;
    } catch (error) {
      this.end(label);
      throw error;
    }
  }
}
