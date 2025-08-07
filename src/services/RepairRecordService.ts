import { RepairRecordRepository } from "../repositories/RepairRecordRepository";
import { RepairRecord } from "../entities/RepairRecord";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class RepairRecordService {
  constructor(private repo: RepairRecordRepository) {}

  async getAllRepairRecords(): Promise<RepairRecord[]> {
    return this.repo.getAll();
  }

  async createRepairRecord(data: Partial<RepairRecord>): Promise<RepairRecord> {
    const repairRecord = new RepairRecord();

    repairRecord.Vehicle = data.Vehicle;
    repairRecord.Mechanic = data.Mechanic;
    repairRecord.EstimatedTime = data.EstimatedTime || 0;
    repairRecord.ActualCostTime = data.ActualCostTime || 0;

    const errors = await validate(repairRecord);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(repairRecord);
  }

  async updateRepairRecord(data: Partial<RepairRecord>): Promise<RepairRecord> {
    if (!data.RepairRecordID) {
      throw new PersistenceError("RepairRecordID is required for update", 400);
    }
    const repairRecord = await this.repo.findById(data.RepairRecordID);

    repairRecord.Vehicle = data.Vehicle;
    repairRecord.Mechanic = data.Mechanic;
    repairRecord.EstimatedTime = data.EstimatedTime || 0;
    repairRecord.ActualCostTime = data.ActualCostTime || 0;

    const errors = await validate(repairRecord);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(repairRecord);
  }

  async deleteRepairRecord(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
