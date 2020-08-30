import { BUILD_NOT_PROVIDED_MESSAGE } from "./utils";
import { ConsoleLogSink } from "./console-log-sink";
import { LogEntry } from "./types/log-entry";
import { LogLevel } from "./types/log-level";

const MOCK_SINK = new ConsoleLogSink();
const ERR_LOG: LogEntry = {
  level: LogLevel.ERROR,
  timestamp: "2020.02.10",
  message: "An error happened"
};
describe("ConsoleLogSink", () => {
  it("should throw if no logEntry is provided", async () => {
    expect(() => MOCK_SINK.addToSink(null)).toThrowError(
      BUILD_NOT_PROVIDED_MESSAGE("logEntry")
    );
  });
  it("should log to console", async () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {
    });
    MOCK_SINK.addToSink(ERR_LOG);
    expect(error).toHaveBeenCalled();
  });
});
