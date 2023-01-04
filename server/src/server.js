const http = require("http");
const mongoose = require("mongoose");
const MONGO_URL = require("../config");

const { loadPlanets } = require("./models/planets.model");

const app = require("./app");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("Connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanets();
  server.listen(PORT, () => `Server is running on port ${PORT}`);
}

startServer();
