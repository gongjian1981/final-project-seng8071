import { Repository } from "typeorm";
import { RepairRecord } from "../entities/RepairRecord";
import { PersistenceError } from "../errors/PersistenceError";

export class RepairRecordRepository {
  constructor(private repo: Repository<RepairRecord>) {}

  async findById(id: number): Promise<RepairRecord> {
    const repairRecord = await this.repo.findOne({ where: { RepairRecordID: id } });
    if (!repairRecord) {
      throw new PersistenceError("RepairRecord not found", 404);
    }
    return repairRecord;
  }

  async getAll(): Promise<RepairRecord[]> {
    return this.repo.find();
  }

  async create(repairRecord: RepairRecord): Promise<RepairRecord> {
    if (await this.repo.findOne({ where: { RepairRecordID: repairRecord.RepairRecordID } })) {
      throw new PersistenceError("RepairRecordID already exists", 409);
    }
    return this.repo.save(repairRecord);
  }
  
  async update(repairRecord: Partial<RepairRecord>): Promise<RepairRecord> {
    return this.repo.save(repairRecord);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ RepairRecordID: id });
    if (result.affected === 0)
      throw new PersistenceError("RepairRecord not found", 404);
  }
}
