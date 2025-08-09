import { Employee } from "../../entities/Employee";
import { Mechanic } from "../../entities/Mechanic";
import { VehicleType } from "../../entities/VehicleType";
import { PersistenceError } from "../../errors/PersistenceError";
import { MechanicRepository } from "../../repositories/MechanicRepository";
import { MechanicService } from "../../services/MechanicService";

describe("MechanicService", () => {
  const mockMechanic = new Mechanic();
  mockMechanic.MechanicID = 1;

  const mockVihecleType = new VehicleType();
  mockVihecleType.VehicleTypeID = 1;
  mockVihecleType.VehicleTypeName = "Cargo Truck";
  mockMechanic.VehicleType = mockVihecleType;
  
  const mockEmployee = new Employee();
  mockEmployee.EmployeeID = 1;
  mockEmployee.FirstName = "John";
  mockEmployee.Surname = "Doe";
  mockMechanic.Employee = mockEmployee;
  
  let service: MechanicService;

  let mockRepo: jest.Mocked<{
    findById: MechanicRepository["findById"];
    getAll: MechanicRepository["getAll"];
    create: MechanicRepository["create"];
    update: MechanicRepository["update"];
    delete: MechanicRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockMechanic),
      getAll: jest.fn().mockResolvedValue([mockMechanic]),
      create: jest.fn().mockImplementation((mechanic) => Promise.resolve(mechanic)),
      update: jest.fn().mockImplementation((mechanic) => Promise.resolve(mechanic)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new MechanicService(mockRepo as unknown as jest.Mocked<MechanicRepository>);

  });

  it("gets all mechanics", async () => {
    const result = await service.getAllMechanics();
    expect(result).toEqual([mockMechanic]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a mechanic", async () => {
    const newMechanic = new Mechanic();
    newMechanic.VehicleType = mockVihecleType;
    newMechanic.Employee = mockEmployee;
    const service = new MechanicService(mockRepo as unknown as MechanicRepository);
    const result = await service.createMechanic(newMechanic);
    expect(mockRepo.create).toHaveBeenCalledWith(newMechanic);
    expect(result).toEqual(newMechanic);
  });

  it("throws PersistenceError for creating mechanic without employee", async () => {
    const invalidMechanic = new Mechanic();
    invalidMechanic.VehicleType = mockVihecleType;
    const service = new MechanicService(mockRepo as unknown as MechanicRepository);
    await expect(service.createMechanic(invalidMechanic)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createMechanic(invalidMechanic)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for creating mechanic without vehicle type", async () => {
    const invalidMechanic = new Mechanic();
    invalidMechanic.Employee = mockEmployee;
    const service = new MechanicService(mockRepo as unknown as MechanicRepository);
    await expect(service.createMechanic(invalidMechanic)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createMechanic(invalidMechanic)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing mechanic", async () => {
    const editedMechanic = new Mechanic();
    editedMechanic.MechanicID = 1;
    editedMechanic.VehicleType = mockVihecleType;
    editedMechanic.Employee = mockEmployee;
    const result = await service.updateMechanic(editedMechanic);
    expect(result.VehicleType).toEqual(mockVihecleType);
    expect(result.Employee).toEqual(mockEmployee);
    expect(mockRepo.update).toHaveBeenCalledWith(editedMechanic);
  });

  it("throws PersistenceError for updating mechanic data without MechanicID", async () => {
    const invalidMechanic = new Mechanic();
    invalidMechanic.VehicleType = mockVihecleType;
    invalidMechanic.Employee = mockEmployee;
    await expect(service.updateMechanic(invalidMechanic)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateMechanic(invalidMechanic)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating mechanic data without employee", async () => {
    const invalidMechanic = new Mechanic();
    invalidMechanic.MechanicID = 1;
    invalidMechanic.VehicleType = mockVihecleType;
    await expect(service.updateMechanic(invalidMechanic)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateMechanic(invalidMechanic)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating mechanic data without vehicle type", async () => {
    const invalidMechanic = new Mechanic();
    invalidMechanic.Employee = mockEmployee;
    await expect(service.updateMechanic(invalidMechanic)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateMechanic(invalidMechanic)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a mechanic", async () => {
    const service = new MechanicService(mockRepo as unknown as MechanicRepository);
    await service.deleteMechanic(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if mechanic not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("Mechanic not found", 404);
    });
    const service = new MechanicService(mockRepo as unknown as MechanicRepository);
    await expect(service.deleteMechanic(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteMechanic(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
