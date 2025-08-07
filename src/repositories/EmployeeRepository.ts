import { Repository } from "typeorm";
import { Employee } from "../entities/Employee";
import { PersistenceError } from "../errors/PersistenceError";

export class EmployeeRepository {
  constructor(private repo: Repository<Employee>) {}

  async findById(id: number): Promise<Employee> {
    const employee = await this.repo.findOne({ where: { EmployeeID: id } });
    if (!employee) {
      throw new PersistenceError("Employee not found", 404);
    }
    return employee;
  }
  
  async getAll(): Promise<Employee[]> {
    return this.repo.find();
  }

  async create(employee: Employee): Promise<Employee> {
    if (await this.repo.findOne({ where: { EmployeeID: employee.EmployeeID } })) {
      throw new PersistenceError("EmployeeID already exists", 409);
    }
    return this.repo.save(employee);
  }

  async update(employee: Partial<Employee>): Promise<Employee> {
    return this.repo.save(employee);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ EmployeeID: id });
    if (result.affected === 0)
      throw new PersistenceError("Employee not found", 404);
  }
}
