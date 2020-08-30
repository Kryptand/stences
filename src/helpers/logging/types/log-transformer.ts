import { LogEntry } from "./log-entry";

export interface LogTransformer {
  transform(logEntry): LogEntry;
}
