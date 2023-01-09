const {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  isLaunchWithIdExists,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

const httpGetAllLaunches = async (req, res) => {
  const { limit, skip } = getPagination(req.query);
  const launch = await getAllLaunches(limit, skip);
  return res.status(200).json(launch);
};

const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  if (isNaN(Date.parse(launch.launchDate))) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
};

const httpAbortLaunch = async (req, res) => {
  const launchId = Number(req.params.id);
  const existsLaunch = await isLaunchWithIdExists(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  return res.status(200).json({
    ok: true,
  });
};

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
