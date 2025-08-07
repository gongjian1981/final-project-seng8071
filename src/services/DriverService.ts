import { DriverRepository } from "../repositories/DriverRepository";
import { Driver } from "../entities/Driver";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class DriverService {
  constructor(private repo: DriverRepository) {}

  async getAllDrivers(): Promise<Driver[]> {
    return this.repo.getAll();
  }

  async createDriver(data: Partial<Driver>): Promise<Driver> {
    const driver = new Driver();

    driver.DriverName = data.DriverName || "";

    const errors = await validate(driver);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(driver);
  }

  async updateDriver(data: Partial<Driver>): Promise<Driver> {
    if (!data.DriverID) {
      throw new PersistenceError("DriverID is required for update", 400);
    }
    const driver = await this.repo.findById(data.DriverID);

    driver.DriverName = data.DriverName || "";

    const errors = await validate(driver);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(driver);
  }

  async deleteDriver(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
