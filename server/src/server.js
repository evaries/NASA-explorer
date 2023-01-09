const http = require("http");
require("dotenv").config();
const { mongooseConnect } = require("./services/mongoose");
const { loadPlanets } = require("./models/planets.model");
const { loadLaunches } = require("./models/launches.model");

const app = require("./app");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongooseConnect();
  await loadPlanets();
  await loadLaunches();
  server.listen(PORT, () => `Server is running on port ${PORT}`);
}

startServer();
