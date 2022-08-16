import { createLogger } from "..";

jest.spyOn(process.stdout, "write");

describe("logger", () => {
  it("prints a message", async () => {
    const logger = createLogger("test");
    logger.info("hello");
    expect(process.stdout.write).toBeCalled();
  });
});
