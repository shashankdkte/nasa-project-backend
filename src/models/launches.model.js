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

launches.set(launch.flightNumber, launch);
function getAllLaunches() {
  return Array.from(launches.values())
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