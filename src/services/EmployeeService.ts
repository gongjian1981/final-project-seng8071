import { EmployeeRepository } from "../repositories/EmployeeRepository";
import { Employee } from "../entities/Employee";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class EmployeeService {
  constructor(private repo: EmployeeRepository) {}

  async getAllEmployees(): Promise<Employee[]> {
    return this.repo.getAll();
  }

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    const employee = new Employee();

    employee.FirstName = data.FirstName || "";
    employee.Surname = data.Surname || "";
    employee.Seniority = data.Seniority || 0;

    const errors = await validate(employee);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(employee);
  }

  async updateEmployee(data: Partial<Employee>): Promise<Employee> {
    if (!data.EmployeeID) {
      throw new PersistenceError("EmployeeID is required for update", 400);
    }
    const employee = await this.repo.findById(data.EmployeeID);

    employee.FirstName = data.FirstName || "";
    employee.Surname = data.Surname || "";
    employee.Seniority = data.Seniority || 0;

    const errors = await validate(employee);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(employee);
  }

  async deleteEmployee(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
