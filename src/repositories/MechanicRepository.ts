import { Repository } from "typeorm";
import { Mechanic } from "../entities/Mechanic";
import { PersistenceError } from "../errors/PersistenceError";

export class MechanicRepository {
  constructor(private repo: Repository<Mechanic>) {}

  async findById(id: number): Promise<Mechanic> {
    const mechanic = await this.repo.findOne({ where: { MechanicID: id } });
    if (!mechanic) {
      throw new PersistenceError("Mechanic not found", 404);
    }
    return mechanic;
  }

  async getAll(): Promise<Mechanic[]> {
    return this.repo.find();
  }

  async create(mechanic: Mechanic): Promise<Mechanic> {
    if (await this.repo.findOne({ where: { MechanicID: mechanic.MechanicID } })) {
      throw new PersistenceError("MechanicID already exists", 409);
    }
    return this.repo.save(mechanic);
  }

  async update(mechanic: Mechanic): Promise<Mechanic> {
    return this.repo.save(mechanic);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ MechanicID: id });
    if (result.affected === 0)
      throw new PersistenceError("Mechanic not found", 404);
  }
}
