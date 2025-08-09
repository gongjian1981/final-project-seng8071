import request from "supertest";
import { DataSource } from "typeorm";
import { Customer } from "../../entities/Customer";
import { CustomerPhone } from "../../entities/CustomerPhone";
import { initializeApp } from "../../index";
import { closeTestDataSource, getTestDataSource } from "../../test-utils/db";

describe("CustomerPhones API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialCustomerPhones = [
    {
      CustomerPhoneID: 1,
      PhoneNumber: "123-456-7890",
    },
    {
      CustomerPhoneID: 2,
      PhoneNumber: "234-567-8901",
    },
    {
      CustomerPhoneID: 3,
      PhoneNumber: "345-678-9012",
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

    const repo = connection.getRepository(CustomerPhone);
    await repo.query("TRUNCATE TABLE customer_phone RESTART IDENTITY CASCADE;");
    await Promise.all(initialCustomerPhones.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all customer phones", async () => {
    const response = await request(app).get("/customerphones").send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(initialCustomerPhones));
  });

  it("creates a customer phone", async () => {
    const newCustomerPhone = {
      CustomerPhoneID: 4,
      Customer: { CustomerID: 1 },
      PhoneNumber: "456-789-0123",
    };
    const response = await request(app).post("/customerphones").send(newCustomerPhone);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newCustomerPhone);
  });

  it("update a customer phone", async () => {
    const editCustomerPhone = {
      CustomerPhoneID: 4,
      Customer: { CustomerID: 1 },
      PhoneNumber: "567-890-1234",
    };
    const response = await request(app).put("/customerphones").send(editCustomerPhone);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(editCustomerPhone);
  });

  it("deletes a customer phone", async () => {
    const response = await request(app).delete("/customerphones/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent customer phone", async () => {
    const response = await request(app).delete("/customerphones/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "CustomerPhone not found" });
  });
});