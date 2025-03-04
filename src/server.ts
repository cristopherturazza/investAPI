import server from "./app";
import "dotenv/config.js";

const port = Number(process.env.port) || 3000;

server.listen(port, () => {
  console.info(`investAPI running on port ${port}`);
});
