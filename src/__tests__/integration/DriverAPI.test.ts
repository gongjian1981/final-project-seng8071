import request from "supertest";
import { DataSource } from "typeorm";
import { initializeApp } from "../../index";
import { Driver } from "../../entities/Driver";
import { getTestDataSource, closeTestDataSource } from "../../test-utils/db";

describe("Drivers API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialDrivers = [
    {
      DriverID: 1,
      DriverName: "Adam Smith"
    },
    {
      DriverID: 2,
      DriverName: "Bob Johnson"
    },
    {
      DriverID: 3,
      DriverName: "Charlie Brown"
    }
  ];

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    connection = await getTestDataSource();
    app = await initializeApp(connection);
    
    const repo = connection.getRepository(Driver);
    await repo.query("TRUNCATE TABLE driver RESTART IDENTITY CASCADE;");
    await Promise.all(initialDrivers.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all drivers", async () => {
    const response = await request(app).get("/drivers").send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(initialDrivers));
  });

  it("creates a driver", async () => {
    const newDriver = {
      DriverID: 4,
      DriverName: "Diana Prince"
    };
    const response = await request(app).post("/drivers").send(newDriver);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newDriver);
  });

  it("update a driver", async () => {
    const editDriver = {
      DriverID: 4,
      DriverName: "Ethan Hunt"
    };
    const response = await request(app).put("/drivers").send(editDriver);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(editDriver);
  });

  it("deletes a driver", async () => {
    const response = await request(app).delete("/drivers/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent driver", async () => {
    const response = await request(app).delete("/drivers/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Driver not found" });
  });
});