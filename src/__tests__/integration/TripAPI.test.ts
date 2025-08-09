import request from "supertest";
import { DataSource } from "typeorm";
import { Customer } from "../../entities/Customer";
import { Shipment } from "../../entities/Shipment";
import { Trip } from "../../entities/Trip";
import { Vehicle } from "../../entities/Vehicle";
import { VehicleType } from "../../entities/VehicleType";
import { initializeApp } from "../../index";
import { closeTestDataSource, getTestDataSource } from "../../test-utils/db";

describe("Trips API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialTrips = [
    {
      TripID: 1,
      Vehicle: { VehicleID: 1, VehicleName: "Car" },
      Shipment: { ShipmentID: 1 },
      FromPlace: "New York",
      ToPlace: "Los Angeles"
    },
    {
      TripID: 2,
      Vehicle: { VehicleID: 1, VehicleName: "Car" },
      Shipment: { ShipmentID: 1 },
      FromPlace: "Chicago",
      ToPlace: "Houston"
    },
    {
      TripID: 3,
      Vehicle: { VehicleID: 1, VehicleName: "Car" },
      Shipment: { ShipmentID: 1 },
      FromPlace: "Miami",
      ToPlace: "Seattle"
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

    const vehicleRepo = connection.getRepository(Vehicle);
    await vehicleRepo.query("TRUNCATE TABLE vehicle RESTART IDENTITY CASCADE;");
    await vehicleRepo.save({
      VehicleID: 1,
      VehicleType: { VehicleTypeID: 1, VehicleTypeName: "Car" },
      Brand: "Toyota",
      Load: 1000,
      Capacity: 5,
      Year: 2020,
      NumberOfRepairs: 3
    });

    const customerRepo = connection.getRepository(Customer);
    await customerRepo.query("TRUNCATE TABLE customer RESTART IDENTITY CASCADE;");
    await customerRepo.save({
      CustomerID: 1,
      CustomerName: "Google",
      CustomerAddress: "123 Main St"});

    const shipmentRepo = connection.getRepository(Shipment);
    await shipmentRepo.query("TRUNCATE TABLE shipment RESTART IDENTITY CASCADE;");
    await shipmentRepo.save({
      ShipmentID: 1,
      Customer: { CustomerID: 1 },
      Weight: 500,
      Value: 1000,
      OriginPlace: "New York",
      DestinationPlace: "Seattle"
    });

    const repo = connection.getRepository(Trip);
    await repo.query("TRUNCATE TABLE trip RESTART IDENTITY CASCADE;");
    await Promise.all(initialTrips.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all trips", async () => {
    const response = await request(app).get("/trips").send();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });

  it("creates a trip", async () => {
    const newTrip = {
      TripID: 4,
      Vehicle: { VehicleID: 1, VehicleName: "Car" },
      Shipment: { ShipmentID: 1 },
      FromPlace: "San Francisco",
      ToPlace: "Las Vegas"
    };
    const response = await request(app).post("/trips").send(newTrip);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newTrip);
  });

  it("update a trip", async () => {
    const editTrip = {
      TripID: 4,
      Vehicle: { VehicleID: 1, VehicleName: "Car" },
      Shipment: { ShipmentID: 1 },
      FromPlace: "San Diego",
      ToPlace: "Phoenix"
    };
    const response = await request(app).put("/trips").send(editTrip);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(editTrip);
  });

  it("deletes a trip", async () => {
    const response = await request(app).delete("/trips/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent trip", async () => {
    const response = await request(app).delete("/trips/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Trip not found" });
  });
});