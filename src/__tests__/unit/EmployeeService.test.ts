import { EmployeeService } from "../../services/EmployeeService";
import { Employee } from "../../entities/Employee";
import { PersistenceError } from "../../errors/PersistenceError";
import { EmployeeRepository } from "../../repositories/EmployeeRepository";
import { get } from "http";

describe("EmployeeService", () => {
  const mockEmployee = new Employee();
  mockEmployee.EmployeeID = 1;
  mockEmployee.FirstName = "John";
  mockEmployee.Surname = "Doe";
  mockEmployee.Seniority = 10;
  
  let service: EmployeeService;

  let mockRepo: jest.Mocked<{
    findById: EmployeeRepository["findById"];
    getAll: EmployeeRepository["getAll"];
    create: EmployeeRepository["create"];
    update: EmployeeRepository["update"];
    delete: EmployeeRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockEmployee),
      getAll: jest.fn().mockResolvedValue([mockEmployee]),
      create: jest.fn().mockImplementation((employee) => Promise.resolve(employee)),
      update: jest.fn().mockImplementation((employee) => Promise.resolve(employee)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new EmployeeService(mockRepo as unknown as jest.Mocked<EmployeeRepository>);

  });

  it("gets all employees", async () => {
    const result = await service.getAllEmployees();
    expect(result).toEqual([mockEmployee]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a employee", async () => {
    const newEmployee = new Employee();
    newEmployee.FirstName = "Adam";
    newEmployee.Surname = "Smith";
    newEmployee.Seniority = 5;
    const service = new EmployeeService(mockRepo as unknown as EmployeeRepository);
    const result = await service.createEmployee(newEmployee);
    expect(mockRepo.create).toHaveBeenCalledWith(newEmployee);
    expect(result).toEqual(newEmployee);
  });

  it("throws PersistenceError for invalid employee data", async () => {
    const invalidEmployee = new Employee();
    invalidEmployee.FirstName = "";
    const service = new EmployeeService(mockRepo as unknown as EmployeeRepository);
    await expect(service.createEmployee(invalidEmployee)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createEmployee(invalidEmployee)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing employee", async () => {
    const editedEmployee = new Employee();
    editedEmployee.EmployeeID = 1;
    editedEmployee.FirstName = "Zoe";
    editedEmployee.Surname = "Yang";
    editedEmployee.Seniority = 15;
    const result = await service.updateEmployee(editedEmployee);
    expect(result.FirstName).toBe("Zoe");
    expect(result.Surname).toBe("Yang");
    expect(result.Seniority).toBe(15);
    expect(mockRepo.update).toHaveBeenCalledWith(editedEmployee);
  });

  it("throws PersistenceError for invalid employee data", async () => {
    const invalidEmployee = new Employee();
    await expect(service.updateEmployee(invalidEmployee)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateEmployee(invalidEmployee)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a employee", async () => {
    const service = new EmployeeService(mockRepo as unknown as EmployeeRepository);
    await service.deleteEmployee(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if employee not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("Employee not found", 404);
    });
    const service = new EmployeeService(mockRepo as unknown as EmployeeRepository);
    await expect(service.deleteEmployee(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteEmployee(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
