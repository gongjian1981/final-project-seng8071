import { RepairRecordRepository } from "../repositories/RepairRecordRepository";
import { RepairRecord } from "../entities/RepairRecord";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";
import { VehicleRepository } from "../repositories/VehicleRepository";

export class RepairRecordService {
  constructor(private repo: RepairRecordRepository, private vehicleRep: VehicleRepository) {}

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

    let record = await this.repo.create(repairRecord);
    
    const vehicle = repairRecord.Vehicle;
    if (vehicle && vehicle.VehicleID) {
      const editVehicle = await this.vehicleRep.findById(vehicle.VehicleID);
      if (editVehicle) {
        editVehicle.NumberOfRepairs += 1;
        await this.vehicleRep.update(editVehicle);
      }
    }

    return record;
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
    const repairRecord = await this.repo.findById(id);
    if (repairRecord && repairRecord.Vehicle) {
      repairRecord.Vehicle.NumberOfRepairs -= 1;
      await this.vehicleRep.update(repairRecord.Vehicle);
    }

    let record = await this.repo.delete(id);
    return record; 
  }
}
