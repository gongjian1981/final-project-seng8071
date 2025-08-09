import request from "supertest";
import { DataSource } from "typeorm";
import { initializeApp } from "../../index";
import { RepairRecord } from "../../entities/RepairRecord";
import { getTestDataSource, closeTestDataSource } from "../../test-utils/db";
import { Employee } from "../../entities/Employee";
import { Vehicle } from "../../entities/Vehicle";
import { VehicleType } from "../../entities/VehicleType";

describe("RepairRecords API", () => {
  let connection: DataSource;
  let app: Express.Application;
  const initialRepairRecords = [
    {
      RepairRecordID: 1,
      Vehicle: { VehicleID: 1, VehicleName: "Car" },
      Mechanic: { MechanicID: 1, MechanicName: "John Doe" },
      EstimatedTime: 150,
      ActualCostTime: 150
    },
    {
      RepairRecordID: 2,
      Vehicle: { VehicleID: 1, VehicleName: "Car" },
      Mechanic: { MechanicID: 1, MechanicName: "John Doe" },
      EstimatedTime: 120,
      ActualCostTime: 110
    },
    {
      RepairRecordID: 3,
      Vehicle: { VehicleID: 1, VehicleName: "Car" },
      Mechanic: { MechanicID: 1, MechanicName: "John Doe" },
      EstimatedTime: 200,
      ActualCostTime: 220
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

    const vehicleRepo = connection.getRepository("Vehicle");
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

    const mechanicRepo = connection.getRepository("Mechanic");
    await mechanicRepo.query("TRUNCATE TABLE mechanic RESTART IDENTITY CASCADE;");
    await mechanicRepo.save({
      MechanicID: 1,
      Employee: { EmployeeID: 1, EmployeeName: "John Doe" },
      VehicleType: { VehicleTypeID: 1, VehicleTypeName: "Car" }
    });

    const repo = connection.getRepository(RepairRecord);
    await repo.query("TRUNCATE TABLE repair_record RESTART IDENTITY CASCADE;");
    await Promise.all(initialRepairRecords.map((type) => repo.save(type)));
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  it("get all repair records", async () => {
    const response = await request(app).get("/repairrecords").send();
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });

  it("creates a repair record", async () => {
    const newRepairRecord = {
      RepairRecordID: 4,
      Vehicle: { VehicleID: 1, VehicleName: "Car" },
      Mechanic: { MechanicID: 1, MechanicName: "John Doe" },
      EstimatedTime: 200,
      ActualCostTime: 200
    };
    const response = await request(app).post("/repairrecords").send(newRepairRecord);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newRepairRecord);
  });

  it("update a repair record", async () => {
    const editRepairRecord = {
      RepairRecordID: 4,
      Vehicle: { VehicleID: 1, VehicleName: "Car" },
      Mechanic: { MechanicID: 1, MechanicName: "John Doe" },
      EstimatedTime: 200,
      ActualCostTime: 180
    };
    const response = await request(app).put("/repairrecords").send(editRepairRecord);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(editRepairRecord);
  });

  it("deletes a repair record", async () => {
    const response = await request(app).delete("/repairrecords/4");
    expect(response.status).toBe(204);
  });

  it("returns 404 for non-existent repair record", async () => {
    const response = await request(app).delete("/repairrecords/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "RepairRecord not found" });
  });
});