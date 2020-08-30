import { BUILD_NOT_PROVIDED_MESSAGE, decideIfLogLevelSatisfiesConstraint, logToConsole } from "./utils";
import { AbstractSink } from "./abstract-sink";
import { LogEntry } from "./types/log-entry";
import { LogLevel } from "./types/log-level";
import { LogSink } from "./types/log-sink";

export class ConsoleLogSink extends AbstractSink implements LogSink {
  minLogLevel: LogLevel = LogLevel.DEBUG;

  addToSink(logEntry: LogEntry) {
    if (!logEntry) {
      throw new Error(BUILD_NOT_PROVIDED_MESSAGE("logEntry"));
    }
    const satisfied = decideIfLogLevelSatisfiesConstraint(
      logEntry.level,
      this.minLogLevel
    );
    if (!satisfied) {
      return;
    }
    logToConsole(logEntry);
  }
}
