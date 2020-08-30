import { LogLevel } from "./log-level";

export const LOG_COLOURS = {
  [LogLevel.TRACE]: "purple",
  [LogLevel.DEBUG]: "purple",
  [LogLevel.INFO]: "gray",
  [LogLevel.LOG]: "gray",
  [LogLevel.WARN]: "orange",
  [LogLevel.ERROR]: "red",
  [LogLevel.FATAL]: "red"
};
