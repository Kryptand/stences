import { LogLevel } from "./types/log-level";
import { LogEntry } from "./types/log-entry";
import { LogSink } from "./types/log-sink";
import { LogTransformer } from "./types/log-transformer";
import { LOG_COLOURS } from "./types/log-colours";

export const BUILD_NOT_PROVIDED_MESSAGE = (arg: string) =>
  `${arg} is not provided`;
export const emitToPipeline = (logEntry: LogEntry, sinks: LogSink[]) => {
  if (!logEntry) {
    throw new Error(BUILD_NOT_PROVIDED_MESSAGE("logEntry"));
  }
  if (!sinks) {
    throw new Error(BUILD_NOT_PROVIDED_MESSAGE("sink"));
  }
  sinks.forEach((sink) => sink.addToSink(logEntry));
};
export const applyTransformers = (
  logEntry: LogEntry,
  transformers: LogTransformer[]
) => {
  if (!logEntry) {
    throw new Error(BUILD_NOT_PROVIDED_MESSAGE("logEntry"));
  }
  if (!transformers) {
    throw new Error(BUILD_NOT_PROVIDED_MESSAGE("transformers"));
  }
  let entry = logEntry;
  transformers.forEach((transformer) => {
    entry = transformer.transform(logEntry);
  });
  return entry;
};

export const decideIfLogLevelSatisfiesConstraint = (
  logLevel: LogLevel,
  minLogLevel: LogLevel
): boolean => {
  if (!logLevel) {
    throw new Error(BUILD_NOT_PROVIDED_MESSAGE("logLevel"));
  }
  if (!minLogLevel) {
    throw new Error(BUILD_NOT_PROVIDED_MESSAGE("minLogLevel"));
  }
  if (minLogLevel === LogLevel.DEBUG || minLogLevel === LogLevel.TRACE) {
    return true;
  }
  if (minLogLevel === LogLevel.INFO) {
    return (
      logLevel === LogLevel.INFO ||
      logLevel === LogLevel.LOG ||
      logLevel === LogLevel.WARN ||
      logLevel === LogLevel.ERROR ||
      logLevel === LogLevel.FATAL
    );
  }

  if (minLogLevel === LogLevel.LOG) {
    return (
      logLevel === LogLevel.LOG ||
      logLevel === LogLevel.WARN ||
      logLevel === LogLevel.ERROR ||
      logLevel === LogLevel.FATAL
    );
  }
  if (minLogLevel === LogLevel.WARN) {
    return (
      logLevel === LogLevel.WARN ||
      logLevel === LogLevel.ERROR ||
      logLevel === LogLevel.FATAL
    );
  }
  if (minLogLevel === LogLevel.ERROR) {
    return logLevel === LogLevel.ERROR || logLevel === LogLevel.FATAL;
  }

  if (minLogLevel === LogLevel.FATAL) {
    return logLevel === LogLevel.FATAL;
  }
};
export const buildMetaInfo = (timestamp: string, logLevel: LogLevel) => {
  if (!timestamp) {
    throw new Error(BUILD_NOT_PROVIDED_MESSAGE("timestamp"));
  }
  if (!logLevel) {
    throw new Error(BUILD_NOT_PROVIDED_MESSAGE("logLevel"));
  }
  return `${timestamp} [${logLevel}]`;
};
export const logToConsole = (logEntry: LogEntry) => {
  if (!logEntry) {
    throw new Error(BUILD_NOT_PROVIDED_MESSAGE("logEntry"));
  }
  const { level, timestamp, message, additional } = logEntry;
  const metaInfo = buildMetaInfo(timestamp, level);
  const color = LOG_COLOURS[level];
  if (level === LogLevel.WARN) {
    console.warn(`%c${metaInfo}`, `color:${color}`, message, additional);
    return;
  }
  if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
    console.error(`%c${metaInfo}`, `color:${color}`, message, additional);
    return;
  }
  if (level === LogLevel.INFO) {
    console.info(`%c${metaInfo}`, `color:${color}`, message, additional);
    return;
  }
  console.log(`%c${metaInfo}`, `color:${color}`, message, additional);
};
