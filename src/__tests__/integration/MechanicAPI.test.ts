import request from "supertest";
import { DataSource } from "typeorm";
import { Employee } from "../../entities/Employee";
import { Mechanic } from "../../entities/Mechanic";
import { VehicleType } from "../../entities/VehicleType";
import { initializeApp } from "../../index";
import { closeTestDataSource, getTestDataSource } from "../../test-utils/db";

describe("Mechanics API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialMechanics = [
    {
      MechanicID: 1,
      Employee: { EmployeeID: 1 },
      VehicleType: { VehicleTypeID: 1 }
    },
    {
      MechanicID: 2,
      Employee: { EmployeeID: 2 },
      VehicleType: { VehicleTypeID: 1 }
    },
    {
      MechanicID: 3,
      Employee: { EmployeeID: 3 },
      VehicleType: { VehicleTypeID: 1 }
    }
  ];

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    connection = await getTestDataSource();
    app = await initializeApp(connection);

    const employeeRepo = connection.getRepository(Employee);
    await employeeRepo.query("TRUNCATE TABLE employee RESTART IDENTITY CASCADE;");
    await employeeRepo.save([{
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
    }]);
    const vehicleTypeRepo = connection.getRepository(VehicleType);
    await vehicleTypeRepo.query("TRUNCATE TABLE vehicle_type RESTART IDENTITY CASCADE;"); 
    await vehicleTypeRepo.save({
      VehicleTypeID: 1,
      VehicleTypeName: "Car"
    });

    const repo = connection.getRepository(Mechanic);
    await repo.query("TRUNCATE TABLE mechanic RESTART IDENTITY CASCADE;");
    await Promise.all(initialMechanics.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all mechanics", async () => {
    const response = await request(app).get("/mechanics").send();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });

  it("creates a mechanic", async () => {
    const newMechanic = {
      MechanicID: 4,
      Employee: { EmployeeID: 1 },
      VehicleType: { VehicleTypeID: 1 }
    };
    const response = await request(app).post("/mechanics").send(newMechanic);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newMechanic);
  });

  it("update a mechanic", async () => {
    const editMechanic = {
      MechanicID: 4,
      Employee: { EmployeeID: 2 },
      VehicleType: { VehicleTypeID: 1 }
    };
    const response = await request(app).put("/mechanics").send(editMechanic);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(editMechanic);
  });

  it("deletes a mechanic", async () => {
    const response = await request(app).delete("/mechanics/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent mechanic", async () => {
    const response = await request(app).delete("/mechanics/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Mechanic not found" });
  });
});