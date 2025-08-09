import request from "supertest";
import { DataSource } from "typeorm";
import { initializeApp } from "../../index";
import { VehicleType } from "../../entities/VehicleType";
import { getTestDataSource, closeTestDataSource } from "../../test-utils/db";

describe("VehicleTypes API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialVehicleTypes = [
    {
      VehicleTypeID: 1,
      VehicleTypeName: "Car"
    },
    {
      VehicleTypeID: 2,
      VehicleTypeName: "Truck"
    },
    {
      VehicleTypeID: 3,
      VehicleTypeName: "Plane"
    }
  ];

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    connection = await getTestDataSource();
    app = await initializeApp(connection);
    const repo = connection.getRepository(VehicleType);
    await repo.query("TRUNCATE TABLE vehicle_type RESTART IDENTITY CASCADE;");
    await Promise.all(initialVehicleTypes.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all vehicle types", async () => {
    const response = await request(app).get("/vehicletypes").send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(initialVehicleTypes));
  });

  it("creates a vehicle type", async () => {
    const newVehicleType = {
      VehicleTypeID: 4,
      VehicleTypeName: "Motorcycle"
    };
    const response = await request(app).post("/vehicletypes").send(newVehicleType);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newVehicleType);
  });

  it("update a vehicle type", async () => {
    const editVehicleType = {
      VehicleTypeID: 4,
      VehicleTypeName: "Ferry"
    };
    const response = await request(app).put("/vehicletypes").send(editVehicleType);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(editVehicleType);
  });

  it("deletes a vehicle type", async () => {
    const response = await request(app).delete("/vehicletypes/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent vehicle type", async () => {
    const response = await request(app).delete("/vehicletypes/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "VehicleType not found" });
  });
});