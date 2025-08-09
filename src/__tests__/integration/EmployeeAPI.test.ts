import request from "supertest";
import { DataSource } from "typeorm";
import { initializeApp } from "../../index";
import { Employee } from "../../entities/Employee";
import { getTestDataSource, closeTestDataSource } from "../../test-utils/db";

describe("Employees API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialEmployees = [
    {
      EmployeeID: 1,
      FirstName: "Alice",
      Surname: "Smith",
      Seniority: 5,
    },
    {
      EmployeeID: 2,
      FirstName: "Bob",
      Surname: "Johnson",
      Seniority: 3,
    },
    {
      EmployeeID: 3,
      FirstName: "Charlie",
      Surname: "Brown",
      Seniority: 2,
    }
  ];

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    connection = await getTestDataSource();
    app = await initializeApp(connection);
    const repo = connection.getRepository(Employee);
    await repo.query("TRUNCATE TABLE employee RESTART IDENTITY CASCADE;");
    await Promise.all(initialEmployees.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all employees", async () => {
    const response = await request(app).get("/employees").send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(initialEmployees));
  });

  it("creates a employee", async () => {
    const newEmployee = {
      EmployeeID: 4,
      FirstName: "Diana",
      Surname: "Prince",
      Seniority: 4
    };
    const response = await request(app).post("/employees").send(newEmployee);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newEmployee);
  });

  it("update a employee", async () => {
    const editEmployee = {
      EmployeeID: 4,
      FirstName: "Eve",
      Surname: "Adams",
      Seniority: 6
    };
    const response = await request(app).put("/employees").send(editEmployee);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(editEmployee);
  });

  it("deletes a employee", async () => {
    const response = await request(app).delete("/employees/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent employee", async () => {
    const response = await request(app).delete("/employees/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Employee not found" });
  });
});