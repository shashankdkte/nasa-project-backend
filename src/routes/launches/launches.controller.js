const {getAllLaunches,addNewLaunch,launchExist,abortLaunch} = require("../../models/launches.model")
function httpGetAllLaunches(req,res)
{
return res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

   if (!launch.mission || !launch.rocket || !launch.launchDate
    || !launch.target) {
      return res.status(400).json({
        error: 'Missing required launch property',
      });
    }
  launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }
  return res.status(201).json(addNewLaunch(launch));
}

 async function httpAbortLaunch(req,res)
 {
   const launchId = Number(req.params.launchId);
   console.log(launchId)
  if (!launchExist(launchId))
  {
     return res.status(404).json({
      error: 'Launch not found',
    });
  }    
    const aborted = await abortLaunch(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted',
    });
  }

  return res.status(200).json({
    ok: true,
  });
}


module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}