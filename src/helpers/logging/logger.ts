import { BehaviorSubject, Observable } from "rxjs";
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  LOG = 3,
  WARN = 4,
  ERROR = 5,
  FATAL = 6,
  OFF = 7,
}
export interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  additional: any[];
}
export interface LogTransformer {
  transform(logEntry): LogEntry;
}
const applyTransformers = (
  logEntry: LogEntry,
  transformers: LogTransformer[]
) => {
  let entry = logEntry;
  transformers.forEach((transformer) => {
    entry = transformer.transform(logEntry);
  });
  return entry;
};
export interface BatchLogSink extends LogSink {
  emitBatch(logEntries: LogEntry[]);
}
export interface SingleLogSink extends LogSink {
  emit(logEntry: LogEntry);
}
export interface LogSink {
  addToSink(logEntry: LogEntry);
}
export class HttpLogSink implements BatchLogSink {
  emitBatch(logEntries: LogEntry[]) {
    logEntries;
  }

  addToSink(logEntry: LogEntry) {
    
  }
}
export class ConsoleLogSink implements SingleLogSink {
  emit(logEntry: LogEntry) {
    console.debug(logEntry);
  }

  addToSink(logEntry: LogEntry) {
  }
}
export class Logger {
  private logTransformerSub$: BehaviorSubject<
    LogTransformer[]
  > = new BehaviorSubject<LogTransformer[]>([]);
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
  }
  clearLogEntries() {
    this.logEntries = [];
  }
}
