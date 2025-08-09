import { Repository } from "typeorm";
import { TripDriver } from "../entities/TripDriver";
import { PersistenceError } from "../errors/PersistenceError";

export class TripDriverRepository {
  constructor(private repo: Repository<TripDriver>) {}

  async findById(id: number): Promise<TripDriver> {
    const tripDriver = await this.repo.findOne({ where: { TripDriverID: id } });
    if (!tripDriver) {
      throw new PersistenceError("TripDriver not found", 404);
    }
    return tripDriver;
  }

  async getAll(): Promise<TripDriver[]> {
    return this.repo.find();
  }

  async create(tripDriver: TripDriver): Promise<TripDriver> {
    if (await this.repo.findOne({ where: { TripDriverID: tripDriver.TripDriverID } })) {
      throw new PersistenceError("TripDriverID already exists", 409);
    }
    return this.repo.save(tripDriver);
  }
  
  async update(tripDriver: TripDriver): Promise<TripDriver> {
    return this.repo.save(tripDriver);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ TripDriverID: id });
    if (result.affected === 0)
      throw new PersistenceError("TripDriver not found", 404);
  }
}
