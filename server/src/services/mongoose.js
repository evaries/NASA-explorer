const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("Connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

const mongooseConnect = async () => {
  await mongoose.connect(MONGO_URL);
};

const mongooseDisconnect = async () => {
  await mongoose.disconnect();
};

module.exports = { mongooseConnect, mongooseDisconnect };
