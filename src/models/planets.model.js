
const { parse } = require("csv-parse");
const path  = require("path")
const fs = require("fs");
const planets = require("./planets.mongo");





function isHabitable(planet) {
  return planet["koi_disposition"] === "CONFIRMED" && planet["koi_insol"] > 0.36
   && planet["koi_insol"]< 1.11  && planet["koi_prad"] < 1.6
}
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment: "#",
        columns: true
      }))
      .on("data", (data) => {
        if (isHabitable(data))
        {
      
          // habitablePlanets.push(data);
          savePlanet(data);
          
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end",async () => {
        const habitablePlanets = (await getAllPlanets()).length;
        console.log(`Number of habitable planet is ${habitablePlanets}`)
        resolve();
      })
  })
  }
 

 async function getAllPlanets() {
   return await planets.find({}, {
    '_id': 0, '__v': 0,
  });
}
  
async function savePlanet(planet)
{
  try {
    
    await planets.updateOne({
      keplerName:planet.kepler_name
    },
      {
      keplerName:planet.kepler_name
      }, {
      upsert:true
    }
    )
  } catch (error) {
     console.error(`Could not save planet ${error}`);
  }
}
module.exports = {
  getAllPlanets,
  loadPlanetsData
}