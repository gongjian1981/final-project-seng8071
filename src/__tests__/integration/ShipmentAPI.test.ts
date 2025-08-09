import request from "supertest";
import { DataSource } from "typeorm";
import { initializeApp } from "../../index";
import { Shipment } from "../../entities/Shipment";
import { getTestDataSource, closeTestDataSource } from "../../test-utils/db";
import { Customer } from "../../entities/Customer";

describe("Shipments API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialShipments = [
    {
      ShipmentID: 1,
      Customer: { CustomerID: 1 },
      Weight: 100,
      Value: 200,
      OriginPlace: "Origin A",
      DestinationPlace: "Destination A"
    },
    {
      ShipmentID: 2,
      Customer: { CustomerID: 1 },
      Weight: 150,
      Value: 300,
      OriginPlace: "Origin B",
      DestinationPlace: "Destination B"
    },
    {
      ShipmentID: 3,
      Customer: { CustomerID: 1 },
      Weight: 200,
      Value: 400,
      OriginPlace: "Origin C",
      DestinationPlace: "Destination C"
    }
  ];

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    connection = await getTestDataSource();
    app = await initializeApp(connection);
    const customerRepo = connection.getRepository(Customer);
    await customerRepo.query("TRUNCATE TABLE customer RESTART IDENTITY CASCADE;");
    await customerRepo.save({
      CustomerID: 1,
      CustomerName: "Uber",
      CustomerAddress: "123 Main St",
    });

    const repo = connection.getRepository(Shipment);
    await repo.query("TRUNCATE TABLE shipment RESTART IDENTITY CASCADE;");
    await Promise.all(initialShipments.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all shipments", async () => {
    const response = await request(app).get("/shipments").send();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });

  it("creates a shipment", async () => {
    const newShipment = {
      ShipmentID: 4,
      Customer: { CustomerID: 1 },
      Weight: 1000,
      Value: 1200,
      OriginPlace: "Origin D",
      DestinationPlace: "Destination D"
    };
    const response = await request(app).post("/shipments").send(newShipment);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newShipment);
  });

  it("update a shipment", async () => {
    const editShipment = {
      ShipmentID: 4,
      Customer: { CustomerID: 1 },
      Weight: 1100,
      Value: 1300,
      OriginPlace: "Origin E",
      DestinationPlace: "Destination E"
    };
    const response = await request(app).put("/shipments").send(editShipment);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(editShipment);
  });

  it("deletes a shipment", async () => {
    const response = await request(app).delete("/shipments/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent shipment", async () => {
    const response = await request(app).delete("/shipments/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Shipment not found" });
  });
});