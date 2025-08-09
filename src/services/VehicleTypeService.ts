import { VehicleTypeRepository } from "../repositories/VehicleTypeRepository";
import { VehicleType } from "../entities/VehicleType";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class VehicleTypeService {
  constructor(private repo: VehicleTypeRepository) {}

  async getAllVehicleTypes(): Promise<VehicleType[]> {
    return this.repo.getAll();
  }

  async createVehicleType(data: Partial<VehicleType>): Promise<VehicleType> {
    const vehicleType = new VehicleType();

    vehicleType.VehicleTypeName = data.VehicleTypeName || "";

    const errors = await validate(vehicleType);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(vehicleType);
  }

  async updateVehicleType(data: Partial<VehicleType>): Promise<VehicleType> {
    if (!data.VehicleTypeID) {
      throw new PersistenceError("VehicleTypeID is required for update", 400);
    }

    const vehicleType = await this.repo.findById(data.VehicleTypeID);

    vehicleType.VehicleTypeName = data.VehicleTypeName || "";

    const errors = await validate(vehicleType);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(vehicleType);
  }

  async deleteVehicleType(id: number): Promise<void> {
    const vehicleType = await this.repo.findById(id);
    if (vehicleType) {
      if (vehicleType.Vehicles && vehicleType.Vehicles.length > 0) {
        throw new PersistenceError("Cannot delete VehicleType with associated Vehicles", 400);  
      }
    }
    return this.repo.delete(id);
  }
}
