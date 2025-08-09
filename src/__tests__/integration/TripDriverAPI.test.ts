import request from "supertest";
import { DataSource } from "typeorm";
import { initializeApp } from "../../index";
import { TripDriver } from "../../entities/TripDriver";
import { getTestDataSource, closeTestDataSource } from "../../test-utils/db";
import { VehicleType } from "../../entities/VehicleType";
import { Vehicle } from "../../entities/Vehicle";
import { Customer } from "../../entities/Customer";
import { Shipment } from "../../entities/Shipment";
import { Trip } from "../../entities/Trip";

describe("TripDrivers API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialTripDrivers = [
    {
      TripDriverID: 1,
      Trip: {
        TripID: 1,
        Vehicle: { VehicleID: 1, VehicleName: "Car" },
        Shipment: { ShipmentID: 1 },
        FromPlace: "New York",
        ToPlace: "Los Angeles"
      },
      Driver: { DriverID: 1, DriverName: "John Doe" }
    },
    {
      TripDriverID: 2,
      Trip: {
        TripID: 1,
        Vehicle: { VehicleID: 1, VehicleName: "Car" },
        Shipment: { ShipmentID: 1 },
        FromPlace: "New York",
        ToPlace: "Los Angeles"
      },
      Driver: { DriverID: 1, DriverName: "John Doe" }
    },
    {
      TripDriverID: 3,
      Trip: {
        TripID: 1,
        Vehicle: { VehicleID: 1, VehicleName: "Car" },
        Shipment: { ShipmentID: 1 },
        FromPlace: "New York",
        ToPlace: "Los Angeles"
      },
      Driver: { DriverID: 1, DriverName: "John Doe" }
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

    const tripRepo = connection.getRepository(Trip);
    await tripRepo.query("TRUNCATE TABLE trip RESTART IDENTITY CASCADE;");
    await tripRepo.save({
      TripID: 1,
      Vehicle: { VehicleID: 1, VehicleName: "Car" },
      Shipment: { ShipmentID: 1 },
      FromPlace: "New York",
      ToPlace: "Los Angeles"
    });

    const driverRepo = connection.getRepository(TripDriver);
    await driverRepo.query("TRUNCATE TABLE trip_driver RESTART IDENTITY CASCADE;");
    await driverRepo.save({
      TripDriverID: 1,
      DriverName: "Car"
    });

    const repo = connection.getRepository(TripDriver);
    await repo.query("TRUNCATE TABLE trip_driver RESTART IDENTITY CASCADE;");
    await Promise.all(initialTripDrivers.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all trip drivers", async () => {
    const response = await request(app).get("/tripdrivers").send();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });

  it("creates a trip driver", async () => {
    const newTripDriver = {
      TripDriverID: 4,
      Trip: {
        TripID: 1,
        Vehicle: { VehicleID: 1, VehicleName: "Car" },
        Shipment: { ShipmentID: 1 },
        FromPlace: "New York",
        ToPlace: "Los Angeles"
      },
      Driver: { DriverID: 1, DriverName: "John Doe" }
    };
    const response = await request(app).post("/tripdrivers").send(newTripDriver);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newTripDriver);
  });

  it("update a trip driver", async () => {
    const editTripDriver = {
      TripDriverID: 4,
      Trip: {
        TripID: 1,
        Vehicle: { VehicleID: 1, VehicleName: "Car" },
        Shipment: { ShipmentID: 1 },
        FromPlace: "New York",
        ToPlace: "Los Angeles"
      },
      Driver: { DriverID: 1, DriverName: "John Doe" }
    };
    const response = await request(app).put("/tripdrivers").send(editTripDriver);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(editTripDriver);
  });

  it("deletes a trip driver", async () => {
    const response = await request(app).delete("/tripdrivers/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent trip driver", async () => {
    const response = await request(app).delete("/tripdrivers/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "TripDriver not found" });
  });
});