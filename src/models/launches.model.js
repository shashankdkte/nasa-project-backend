const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const launches = new Map();
let latestflightNumber = 100;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true
};

//launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function getAllLaunches() {

  return await launchesDatabase.find({}, {
    '_id': 0, '__v': 0,
 })
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName:launch.target,
  })
  if (!planet)
  {
    throw new Error("No Planet Found")
    }
  await launchesDatabase.updateOne(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true });
}

function launchExist(launchId)
{
  return launches.has(launchId)
}

function addNewLaunch(launch) {
  latestflightNumber++;
  launches.set(latestflightNumber, Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber:latestflightNumber
  }))
}

function abortLaunch(launchId)
{
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;

}
module.exports = {
  getAllLaunches,
  addNewLaunch,
  launchExist,
  abortLaunch
}