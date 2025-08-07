import { VehicleRepository } from "../repositories/VehicleRepository";
import { Vehicle } from "../entities/Vehicle";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class VehicleService {
  constructor(private repo: VehicleRepository) {}

  async getAllVehicles(): Promise<Vehicle[]> {
    return this.repo.getAll();
  }

  async createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = new Vehicle();

    vehicle.Brand = data.Brand || "";
    vehicle.Load = data.Load || 0;
    vehicle.Capacity = data.Capacity || 0;
    vehicle.Year = data.Year || new Date().getFullYear();
    vehicle.NumberOfRepairs = data.NumberOfRepairs || 0;

    const errors = await validate(vehicle);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(vehicle);
  }

  async updateVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    if (!data.VehicleID) {
      throw new PersistenceError("VehicleID is required for update", 400);
    }
    const vehicle = await this.repo.findById(data.VehicleID);

    vehicle.Brand = data.Brand || "";
    vehicle.Load = data.Load || 0;
    vehicle.Capacity = data.Capacity || 0;
    vehicle.Year = data.Year || new Date().getFullYear();
    vehicle.NumberOfRepairs = data.NumberOfRepairs || 0;

    const errors = await validate(vehicle);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(vehicle);
  }

  async deleteVehicle(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
