const request = require("supertest");
require("dotenv").config();

const app = require("../../app");
const {
  mongooseConnect,
  mongooseDisconnect,
} = require("../../services/mongoose");

describe("Test API", () => {
  beforeAll(async () => {
    await mongooseConnect();
  });

  afterAll(async () => {
    await mongooseDisconnect();
  });

  describe("Test GET /launches", () => {
    const data = {
      mission: "USS Enterprise",
      rocket: "NCC-1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };

    const dataWODate = {
      mission: "USS Enterprise",
      rocket: "NCC-1701-D",
      target: "Kepler-62 f",
    };

    const dataWithIncorrectDate = {
      mission: "USS Enterprise",
      rocket: "NCC-1701-D",
      target: "Kepler-62 f",
      launchDate: "null",
    };

    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(data)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(data.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(dataWODate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(dataWODate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch invalid date", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(dataWithIncorrectDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
