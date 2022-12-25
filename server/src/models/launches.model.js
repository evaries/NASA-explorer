const launches = new Map();

let latestFlightNumber = 100;

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

launches.set(launch.flightNumber, launch);

const getAllLaunches = () => {
  return Array.from(launches.values());
};

const addNewLaunch = (launch) => {
  latestFlightNumber++;
  launches.set(
    launch.flightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ["NASA"],
      upcoming: true,
      success: true,
    })
  );
};

module.exports = {
  getAllLaunches,
  addNewLaunch,
};
