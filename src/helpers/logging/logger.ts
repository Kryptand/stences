import { BehaviorSubject } from "rxjs";
import { LogEntry } from "./types/log-entry";
import { LogTransformer } from "./types/log-transformer";
import { LogSink } from "./types/log-sink";
import { applyTransformers, emitToPipeline } from "./utils";

export class Logger {
  private logSinkSub$: BehaviorSubject<LogSink[]> = new BehaviorSubject<LogSink[]>([]);
  logSinks$ = this.logSinkSub$.asObservable();
  private logTransformerSub$: BehaviorSubject<LogTransformer[]> = new BehaviorSubject<LogTransformer[]>([]);
  logTransformer$ = this.logTransformerSub$.asObservable();

  get logTransformer() {
    return this.logTransformerSub$.getValue();
  }

  set logTransformer(value: LogTransformer[]) {
    this.logTransformerSub$.next(value);
  }
  addLogTransformer(logTransformer: LogTransformer) {
    const currLogTransformer = this.logTransformer;
    this.logTransformerSub$.next([...currLogTransformer, logTransformer]);
  }
  private logEntriesSub$: BehaviorSubject<LogEntry[]> = new BehaviorSubject<
    LogEntry[]
  >([]);
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
    const entries = logEntries.map((logEntry) =>
      applyTransformers(logEntry, this.logTransformer)
    );

    this.logEntriesSub$.next([...currentLogEntries, ...entries]);
    entries.forEach((entry) =>
      emitToPipeline(entry, this.logSinkSub$.getValue())
    );
  }
  clearLogEntries() {
    this.logEntries = [];
  }
}
