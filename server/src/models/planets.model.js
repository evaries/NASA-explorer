const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

const loadPlanets = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanets(data);
        }
      })
      .on("error", () => {
        reject(error);
        console.log(error);
      })
      .on("end", async () => {
        const planetFound = (await getAllPlanets()).length;
        console.log(`${planetFound} habitable planets found!`);
        resolve();
      });
  });
};

const getAllPlanets = async () => {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
};

const savePlanets = async (planet) => {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`Could not save planets: ${error}`);
  }
};

module.exports = { planets, loadPlanets, getAllPlanets };
