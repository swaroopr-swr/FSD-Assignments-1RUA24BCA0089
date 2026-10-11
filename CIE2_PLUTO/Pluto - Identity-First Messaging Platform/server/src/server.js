import "dotenv/config";

import { createServer } from "node:http";

import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { createSocketServer } from "./socket/index.js";

const port = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = createSocketServer(httpServer);

app.set("io", io);

async function startServer() {
  await connectDatabase();

  httpServer.listen(port, () => {
    console.log(`Pluto API listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start Pluto API:", error);
  process.exit(1);
});
