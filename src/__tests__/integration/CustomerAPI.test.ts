import request from "supertest";
import { DataSource } from "typeorm";
import { initializeApp } from "../../index";
import { Customer } from "../../entities/Customer";
import { getTestDataSource, closeTestDataSource } from "../../test-utils/db";

describe("Customers API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialCustomers = [
    {
      CustomerID: 1,
      CustomerName: "Amazon",
      CustomerAddress: "123 Amazon St"
    },
    {
      CustomerID: 2,
      CustomerName: "Best Buy",
      CustomerAddress: "456 Best Buy Ave"
    },
    {
      CustomerID: 3,
      CustomerName: "Costco",
      CustomerAddress: "789 Costco Blvd"
    }
  ];

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    connection = await getTestDataSource();
    app = await initializeApp(connection);
    const repo = connection.getRepository(Customer);
    await repo.query("TRUNCATE TABLE customer RESTART IDENTITY CASCADE;");
    await Promise.all(initialCustomers.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all customers", async () => {
    const response = await request(app).get("/customers").send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(initialCustomers));
  });

  it("creates a customer", async () => {
    const newCustomer = {
      CustomerID: 4,
      CustomerName: "Dell",
      CustomerAddress: "101 Dell Way"
    };
    const response = await request(app).post("/customers").send(newCustomer);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newCustomer);
  });

  it("update a customer", async () => {
    const editCustomer = {
      CustomerID: 4,
      CustomerName: "Electronic Arts",
      CustomerAddress: "202 EA Plaza"
    };
    const response = await request(app).put("/customers").send(editCustomer);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(editCustomer);
  });

  it("deletes a customer", async () => {
    const response = await request(app).delete("/customers/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent customer", async () => {
    const response = await request(app).delete("/customers/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Customer not found" });
  });
});