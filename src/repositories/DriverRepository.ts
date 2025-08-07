import { Repository } from "typeorm";
import { Driver } from "../entities/Driver";
import { PersistenceError } from "../errors/PersistenceError";

export class DriverRepository {
  constructor(private repo: Repository<Driver>) {}

  async findById(id: number): Promise<Driver> {
    const driver = await this.repo.findOne({ where: { DriverID: id } });
    if (!driver) {
      throw new PersistenceError("Driver not found", 404);
    }
    return driver;
  }
  
  async getAll(): Promise<Driver[]> {
    return this.repo.find();
  }

  async create(driver: Driver): Promise<Driver> {
    if (await this.repo.findOne({ where: { DriverID: driver.DriverID } })) {
      throw new PersistenceError("DriverID already exists", 409);
    }
    return this.repo.save(driver);
  }

  async update(driver: Partial<Driver>): Promise<Driver> {
    return this.repo.save(driver);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ DriverID: id });
    if (result.affected === 0)
      throw new PersistenceError("Driver not found", 404);
  }
}
