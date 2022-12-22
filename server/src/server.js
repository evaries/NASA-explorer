const http = require("http");

const { loadPlanets } = require("./model/planets.model");

const app = require("./app");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await loadPlanets();
  server.listen(PORT, () => `Server is running on port ${PORT}`);
}

startServer();
