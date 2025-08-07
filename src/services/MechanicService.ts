import { MechanicRepository } from "../repositories/MechanicRepository";
import { Mechanic } from "../entities/Mechanic";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class MechanicService {
  constructor(private repo: MechanicRepository) {}

  async getAllMechanics(): Promise<Mechanic[]> {
    return this.repo.getAll();
  }

  async createMechanic(data: Partial<Mechanic>): Promise<Mechanic> {
    const mechanic = new Mechanic();

    mechanic.Employee = data.Employee;
    mechanic.VehicleType = data.VehicleType;

    const errors = await validate(mechanic);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(mechanic);
  }

  async updateMechanic(data: Partial<Mechanic>): Promise<Mechanic> {
    if (!data.MechanicID) {
      throw new PersistenceError("MechanicID is required for update", 400);
    }
    const mechanic = await this.repo.findById(data.MechanicID);

    mechanic.Employee = data.Employee;
    mechanic.VehicleType = data.VehicleType;

    const errors = await validate(mechanic);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(mechanic);
  }

  async deleteMechanic(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
