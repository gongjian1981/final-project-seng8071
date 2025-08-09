import request from "supertest";
import { DataSource } from "typeorm";
import { Certification } from "../../entities/Certification";
import { Employee } from "../../entities/Employee";
import { initializeApp } from "../../index";
import { closeTestDataSource, getTestDataSource } from "../../test-utils/db";
import { VehicleType } from "../../entities/VehicleType";

describe("Certifications API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialCertifications = [
    {
      CertificationID: 1,
      Employee: { EmployeeID: 1 },
      VehicleType: { VehicleTypeID: 1 }
    },
    {
      CertificationID: 2,
      Employee: { EmployeeID: 2 },
      VehicleType: { VehicleTypeID: 1 }
    },
    {
      CertificationID: 3,
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

    const repo = connection.getRepository(Certification);
    await repo.query("TRUNCATE TABLE certification RESTART IDENTITY CASCADE;");
    await Promise.all(initialCertifications.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all certifications", async () => {
    const response = await request(app).get("/certifications").send();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });

  it("creates a certification", async () => {
    const newCertification = {
      CertificationID: 4,
      Employee: { EmployeeID: 1 },
      VehicleType: { VehicleTypeID: 1 }
    };
    const response = await request(app).post("/certifications").send(newCertification);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newCertification);
  });

  it("update a certification", async () => {
    const editCertification = {
      CertificationID: 4,
      Employee: { EmployeeID: 2 },
      VehicleType: { VehicleTypeID: 1 }
    };
    const response = await request(app).put("/certifications").send(editCertification);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(editCertification);
  });

  it("deletes a certification", async () => {
    const response = await request(app).delete("/certifications/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent certification", async () => {
    const response = await request(app).delete("/certifications/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Certification not found" });
  });
});