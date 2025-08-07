import { Repository } from "typeorm";
import { Vehicle } from "../entities/Vehicle";
import { PersistenceError } from "../errors/PersistenceError";

export class VehicleRepository {
  constructor(private repo: Repository<Vehicle>) {}

  async findById(id: number): Promise<Vehicle> {
    const vehicle = await this.repo.findOne({ where: { VehicleID: id } });
    if (!vehicle) {
      throw new PersistenceError("Vehicle not found", 404);
    }
    return vehicle;
  }

  async getAll(): Promise<Vehicle[]> {
    return this.repo.find();
  }

  async create(vehicle: Vehicle): Promise<Vehicle> {
    if (await this.repo.findOne({ where: { VehicleID: vehicle.VehicleID } })) {
      throw new PersistenceError("VehicleID already exists", 409);
    }
    return this.repo.save(vehicle);
  }
  
  async update(vehicle: Vehicle): Promise<Vehicle> {
    return this.repo.save(vehicle);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ VehicleID: id });
    if (result.affected === 0)
      throw new PersistenceError("Vehicle not found", 404);
  }
}
