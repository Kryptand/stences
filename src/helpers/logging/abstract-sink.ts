import { BehaviorSubject } from "rxjs";
import { LogEntry } from "./types/log-entry";

export abstract class AbstractSink {
  private logEntriesSub$: BehaviorSubject<LogEntry[]> = new BehaviorSubject<LogEntry[]>([]);
  readonly logEntries$ = this.logEntriesSub$.asObservable();

  get logEntries() {
    return this.logEntriesSub$.getValue();
  }

  set logEntries(logEntries: LogEntry[]) {
    this.logEntriesSub$.next(logEntries);
  }

  log(logEntry: LogEntry) {
    this.addLogEntries(logEntry);
  }

  addLogEntries(...logEntries: LogEntry[]) {
    const currentLogEntries = this.logEntries;
    this.logEntriesSub$.next([...currentLogEntries, ...logEntries]);
  }
}
