const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const launches = new Map();
let latestflightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

const SPACE_API_URL = 'https://api.spacexdata.com/v5/launches/query'
// const launch = {
//   flightNumber: 100,
//   mission: "Kepler Exploration X",
//   rocket: "Explorer IS1",
//   launchDate: new Date("December 27, 2030"),
//   target: "Kepler-442 b",
//   customers: ["ZTM", "NASA"],
//   upcoming: true,
//   success: true
// };

//launches.set(launch.flightNumber, launch);


async function populateLaunches() {
   console.log("Downloading Data...");
  const response = await axios.post(SPACE_API_URL, { 
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        }, {
          path: 'payloads',
          select: {
            'customers': 1
          }
        }
      ]
    }
  });

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs)
  {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers']
    });


   const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch);
    }
}
async function loadLaunchData()
{
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission:'FalconSat'
  })
  if (firstLaunch)
  {
    console.log('Launch Data already loaded');
  }
  else
  {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}
async function getAllLaunches(skip,limit) {

  return await launchesDatabase.find({}, {
    '_id': 0, '__v': 0,
  })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit)
}

async function saveLaunch(launch) {

  await launchesDatabase.updateOne(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
  if (!latestLaunch)
  {
    return DEFAULT_FLIGHT_NUMBER
  }
  return latestLaunch.flightNumber;
}

 async function launchExist(launchId)
{
  return await launchesDatabase.findOne({flightNumber:launchId})
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

async function scheduleNewLaunch(launch) {
 const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet found');
  }

  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunch(launchId)
{
  // const aborted = launches.get(launchId);
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success : false
    
  })
  return aborted.modifiedCount === 1;
}
module.exports = {
  getAllLaunches,
  addNewLaunch,
  launchExist,
  abortLaunch,
  scheduleNewLaunch,
  loadLaunchData
}