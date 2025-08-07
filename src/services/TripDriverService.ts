import { TripDriverRepository } from "../repositories/TripDriverRepository";
import { TripDriver } from "../entities/TripDriver";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class TripDriverService {
  constructor(private repo: TripDriverRepository) {}

  async getAllTripDrivers(): Promise<TripDriver[]> {
    return this.repo.getAll();
  }

  async createTripDriver(data: Partial<TripDriver>): Promise<TripDriver> {
    const tripDriver = new TripDriver();

    tripDriver.Trip = data.Trip;
    tripDriver.Driver = data.Driver;

    const errors = await validate(tripDriver);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(tripDriver);
  }

  async updateTripDriver(data: Partial<TripDriver>): Promise<TripDriver> {
    if (!data.TripDriverID) {
      throw new PersistenceError("TripDriverID is required for update", 400);
    }
    const tripDriver = await this.repo.findById(data.TripDriverID);

    tripDriver.Trip = data.Trip;
    tripDriver.Driver = data.Driver;

    const errors = await validate(tripDriver);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(tripDriver);
  }

  async deleteTripDriver(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
