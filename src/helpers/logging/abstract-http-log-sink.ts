import { HttpLogSink } from "./types/http-log-sink";
import { LogEntry } from "./types/log-entry";
import { from, timer } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { LogLevel } from "./types/log-level";

export abstract class AbstractHttpLogSink implements HttpLogSink {
  batchSize: number;
  logUrl: string;
  maxTimeout: number;
  minLogLevel: LogLevel = LogLevel.ERROR;
  private currentCount = 0;
  private currentLogEntries: LogEntry[];

  constructor(batchSize: number, logUrl: string, maxTimeout: number) {
    this.batchSize = batchSize;
    this.logUrl = logUrl;
    this.maxTimeout = maxTimeout;
    this.startAutoEmit();
  }

  startAutoEmit() {
    timer(0, this.maxTimeout)
      .pipe(
        switchMap((_) => {
          return this.emitLogMessages().pipe(tap(() => this.resetCount()));
        })
      )
      .subscribe();
  }

  addToSink(logEntry: LogEntry) {
    this.currentLogEntries = [...this.currentLogEntries, logEntry];
    if (this.batchSize >= this.currentCount) {
      return this.emitLogMessages()
        .pipe(tap(() => this.resetCount()))
        .subscribe();
    }
    this.currentCount++;
  }

  private resetCount() {
    this.currentCount = 0;
  }

  private emitLogMessages() {
    const lastNEntries = this.getLastNEntries();
    const postLog = this.getPostLog(lastNEntries);
    return from(postLog);
  }

  private getPostLog(lastNEntries: LogEntry[]) {
    return fetch(this.logUrl, {
      method: "POST",
      body: JSON.stringify(lastNEntries)
    });
  }

  private getLastNEntries() {
    return this.currentLogEntries.splice(0, this.batchSize);
  }
}
