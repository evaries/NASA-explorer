const launchesDB = require("../models/launches.mongo");
const planets = require("../models/planets.mongo");

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

const saveLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  await launchesDB.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
};

saveLaunch(launch);

const isLaunchWithIdExists = async (launchId) => {
  return await launchesDB.findOne({
    flightNumber: launchId,
  });
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return 100;
  }
  return latestLaunch.flightNumber;
};

const getAllLaunches = async () => {
  return await launchesDB.find({}, { _id: 0, __v: 0 });
};

const scheduleNewLaunch = async (launch) => {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero tolerance", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
};

const abortLaunchById = async (launchId) => {
  const getPlanet = await launchesDB.findOne({
    flightNumber: launchId,
  });
  const aborted = await launchesDB.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
};

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  isLaunchWithIdExists,
  abortLaunchById,
};
