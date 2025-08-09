import request from "supertest";
import { DataSource } from "typeorm";
import { Vehicle } from "../../entities/Vehicle";
import { VehicleType } from "../../entities/VehicleType";
import { initializeApp } from "../../index";
import { closeTestDataSource, getTestDataSource } from "../../test-utils/db";

describe("Vehicles API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialVehicles = [
    {
      VehicleID: 1,
      VehicleType: { VehicleTypeID: 1, VehicleTypeName: "Car" },
      Brand: "Toyota",
      Load: 1500,
      Capacity: 5,
      Year: 2020,
      NumberOfRepairs: 2
    },
    {
      VehicleID: 2,
      VehicleType: { VehicleTypeID: 1, VehicleTypeName: "Car" },
      Brand: "Honda",
      Load: 1200,
      Capacity: 4,
      Year: 2021,
      NumberOfRepairs: 3
    },
    {
      VehicleID: 3,
      VehicleType: { VehicleTypeID: 1, VehicleTypeName: "Car" },
      Brand: "Ford",
      Load: 1800,
      Capacity: 6,
      Year: 2019,
      NumberOfRepairs: 1
    }
  ];

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    connection = await getTestDataSource();
    app = await initializeApp(connection);
    
    const vehicleTypeRepo = connection.getRepository(VehicleType);
    await vehicleTypeRepo.query("TRUNCATE TABLE vehicle_type RESTART IDENTITY CASCADE;");
    await vehicleTypeRepo.save({
      VehicleTypeName: "Car"
    });

    const repo = connection.getRepository(Vehicle);
    await repo.query("TRUNCATE TABLE vehicle RESTART IDENTITY CASCADE;");
    await Promise.all(initialVehicles.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all vehicles", async () => {
    const response = await request(app).get("/vehicles").send();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });

  it("creates a vehicle", async () => {
    const newVehicle = {
      VehicleID: 4,
      VehicleType: { VehicleTypeID: 1, VehicleTypeName: "Car" },
      Brand: "Chevrolet",
      Load: 1600,
      Capacity: 5,
      Year: 2022,
      NumberOfRepairs: 0
    };
    const response = await request(app).post("/vehicles").send(newVehicle);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(
      {
        VehicleID: 4,
        Brand: "Chevrolet",
        Load: 1600,
        Capacity: 5,
        Year: 2022,
        NumberOfRepairs: 0
      }
    );
  });

  it("update a vehicle", async () => {
    const editVehicle = {
      VehicleID: 4,
      Brand: "BMW",
      Load: 1700,
      Capacity: 11,
      Year: 2023,
      NumberOfRepairs: 10,
      VehicleType: { VehicleTypeID: 1}
    };
    const response = await request(app).put("/vehicles").send(editVehicle);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(
      {
        VehicleID: 4,
        Brand: "BMW",
        Load: 1700,
        Capacity: 11,
        Year: 2023,
        NumberOfRepairs: 10,
      }
    );
  });

  it("deletes a vehicle", async () => {
    const response = await request(app).delete("/vehicles/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent vehicle", async () => {
    const response = await request(app).delete("/vehicles/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Vehicle not found" });
  });
});