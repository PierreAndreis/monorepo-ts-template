import logger from "./logger";
import { createServer } from "./server";

const port = process.env.PORT || 3001;
const server = createServer();

server.listen(port, () => {
  logger.info(`api running on ${port}`);
});
