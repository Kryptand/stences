import { LogLevel } from "./log-level";
import { LogEntry } from "./log-entry";

export interface LogSink {
  minLogLevel: LogLevel;

  addToSink(logEntry: LogEntry);
}
