const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = [];

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
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          planets.push(data);
        }
      })
      .on("error", () => {
        reject(error);
        console.log(error);
      })
      .on("end", () => {
        console.log(`${planets.length} habitable planets found!`);
        resolve();
      });
  });
};

const getAllPlanets = () => {
  return planets;
};

module.exports = { planets, loadPlanets, getAllPlanets };
