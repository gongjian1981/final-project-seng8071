import { Repository } from "typeorm";
import { VehicleType } from "../entities/VehicleType";
import { PersistenceError } from "../errors/PersistenceError";

export class VehicleTypeRepository {
  constructor(private repo: Repository<VehicleType>) {}

  async findById(id: number): Promise<VehicleType> {
    const vehicleType = await this.repo.findOne({ where: { VehicleTypeID: id } });
    if (!vehicleType) {
      throw new PersistenceError("VehicleType not found", 404);
    }
    return vehicleType;
  }

  async getAll(): Promise<VehicleType[]> {
    return this.repo.find();
  }

  async create(vehicleType: VehicleType): Promise<VehicleType> {
    if (await this.repo.findOne({ where: { VehicleTypeID: vehicleType.VehicleTypeID } })) {
      throw new PersistenceError("VehicleTypeID already exists", 409);
    }
    return this.repo.save(vehicleType);
  }
  
  async update(vehicleType: VehicleType): Promise<VehicleType> {
    return this.repo.save(vehicleType);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ VehicleTypeID: id });
    if (result.affected === 0)
      throw new PersistenceError("VehicleType not found", 404);
  }
}
