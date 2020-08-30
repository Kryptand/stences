import {
  applyTransformers,
  BUILD_NOT_PROVIDED_MESSAGE,
  buildMetaInfo,
  decideIfLogLevelSatisfiesConstraint,
  emitToPipeline,
  logToConsole
} from "./utils";
import { LogEntry } from "./types/log-entry";
import { LogLevel } from "./types/log-level";
import { LogSink } from "./types/log-sink";
import { LogTransformer } from "./types/log-transformer";

const ERR_LOG_ENTRY: LogEntry = {
  level: LogLevel.ERROR,
  timestamp: "2020.02.10",
  message: "An error happened"
};
const WARN_LOG_ENTRY: LogEntry = {
  level: LogLevel.WARN,
  timestamp: "2020.02.10",
  message: "A warning happened"
};
const LOG_LOG_ENTRY: LogEntry = {
  level: LogLevel.LOG,
  timestamp: "2020.02.10",
  message: "A log happened"
};
const INFO_LOG_ENTRY: LogEntry = {
  level: LogLevel.INFO,
  timestamp: "2020.02.10",
  message: "A info happened"
};
const TRANSFORMED_LOG_ERROR = {
  ...ERR_LOG_ENTRY,
  message: ERR_LOG_ENTRY.message + "test"
};
const TEST_SINK: LogSink = {
  minLogLevel: LogLevel.DEBUG,
  addToSink(logEntry) {
    return logEntry;
  }
};
const TEST_TRANSFORMER: LogTransformer = {
  transform(logEntry: LogEntry): LogEntry {
    const { message } = logEntry;
    return {
      ...{},
      ...logEntry,
      message: message + "test"
    };
  }
};
describe("emitToPipeline", () => {
  it("should throw an error if no input is provided", async () => {
    expect(() => emitToPipeline(null, [])).toThrowError(
      BUILD_NOT_PROVIDED_MESSAGE("logEntry")
    );
  });

  it("should throw an error if no sinks are provided", async () => {
    expect(() => emitToPipeline(ERR_LOG_ENTRY, null)).toThrowError(
      BUILD_NOT_PROVIDED_MESSAGE("sink")
    );
  });
  it("should call the addToSink action", async () => {
    const spy = jest.spyOn(TEST_SINK, "addToSink");
    emitToPipeline(ERR_LOG_ENTRY, [TEST_SINK]);
    expect(spy).toBeCalled();
  });
});
describe("applyToTransformers", () => {
  it("should throw an error if no input is provided", async () => {
    expect(() => applyTransformers(null, [])).toThrowError(
      BUILD_NOT_PROVIDED_MESSAGE("logEntry")
    );
  });
  it("should throw an error if no transformers are provided", async () => {
    expect(() => applyTransformers(ERR_LOG_ENTRY, null)).toThrowError(
      BUILD_NOT_PROVIDED_MESSAGE("transformers")
    );
  });
  it("should apply log transformation according to transformer", async () => {
    expect(applyTransformers(ERR_LOG_ENTRY, [TEST_TRANSFORMER])).toEqual(
      TRANSFORMED_LOG_ERROR
    );
  });
});
describe("decideIfLogLevelSatisfiesConstraint ", () => {
  it("should throw an error if no logLevel is provided", async () => {
    expect(() => decideIfLogLevelSatisfiesConstraint(null, null)).toThrowError(
      BUILD_NOT_PROVIDED_MESSAGE("logLevel")
    );
  });
  it("should throw an error if no minLogLevel is provided", async () => {
    expect(() =>
      decideIfLogLevelSatisfiesConstraint(LogLevel.DEBUG, null)
    ).toThrowError(BUILD_NOT_PROVIDED_MESSAGE("minLogLevel"));
  });
  it("should satisfy the constraint if debug is provided", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.DEBUG, LogLevel.DEBUG)
    ).toEqual(true);
  });
  it("should satisfy the constraint if trace is provided", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.DEBUG, LogLevel.TRACE)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is info and provided level is info ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.INFO, LogLevel.INFO)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is info and provided level is log ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.LOG, LogLevel.INFO)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is info and provided level is warn ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.WARN, LogLevel.INFO)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is info and provided level is error ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.ERROR, LogLevel.INFO)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is info and provided level is fatal ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.FATAL, LogLevel.INFO)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is log and provided level is log ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.LOG, LogLevel.LOG)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is log and provided level is warn ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.WARN, LogLevel.LOG)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is log and provided level is error ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.ERROR, LogLevel.LOG)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is log and provided level is fatal ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.FATAL, LogLevel.LOG)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is warn and provided level is warn ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.WARN, LogLevel.WARN)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is warn and provided level is error ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.ERROR, LogLevel.WARN)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is warn and provided level is fatal ", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.FATAL, LogLevel.WARN)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is error and provided level is error", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.ERROR, LogLevel.ERROR)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is error and provided level is fatal", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.FATAL, LogLevel.ERROR)
    ).toEqual(true);
  });
  it("should satisfy the constraint if minlevel is fatal and provided level is fatal", async () => {
    expect(
      decideIfLogLevelSatisfiesConstraint(LogLevel.FATAL, LogLevel.FATAL)
    ).toEqual(true);
  });
});
describe("buildMetaInfo", () => {
  it("should throw an error if no timestamp is provided", async () => {
    expect(() => buildMetaInfo(null, null)).toThrowError(
      BUILD_NOT_PROVIDED_MESSAGE("timestamp")
    );
  });
  it("should throw an error if no loglevel is provided", async () => {
    expect(() => buildMetaInfo(new Date().toISOString(), null)).toThrowError(
      BUILD_NOT_PROVIDED_MESSAGE("logLevel")
    );
  });
  it("should build the metadata info", async () => {
    const messageStr = "2020.02.10 [error]";
    expect(buildMetaInfo("2020.02.10", LogLevel.ERROR)).toBe(messageStr);
  });
});
describe("logToConsole", () => {
  it("should throw an error if no logEntry is provided", async () => {
    expect(() => logToConsole(null)).toThrowError(
      BUILD_NOT_PROVIDED_MESSAGE("logEntry")
    );
  });
  it("should write a warning message to console if its a warn log entry", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {
    });
    logToConsole(WARN_LOG_ENTRY);
    expect(warn).toHaveBeenCalled();
  });
  it("should write a info message to console if its an info log entry", async () => {
    const info = jest.spyOn(console, "info").mockImplementation(() => {
    });
    logToConsole(INFO_LOG_ENTRY);
    expect(info).toHaveBeenCalled();
  });
  it("should write a log message to console if its an log log entry", async () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {
    });
    logToConsole(LOG_LOG_ENTRY);
    expect(log).toHaveBeenCalled();
  });
  it("should write an err message to console if its an err log entry", async () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {
    });
    logToConsole(ERR_LOG_ENTRY);
    expect(error).toHaveBeenCalled();
  });
});
