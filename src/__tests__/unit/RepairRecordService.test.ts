import { RepairRecordService } from "../../services/RepairRecordService";
import { RepairRecord } from "../../entities/RepairRecord";
import { PersistenceError } from "../../errors/PersistenceError";
import { RepairRecordRepository } from "../../repositories/RepairRecordRepository";
import { get } from "http";
import { Mechanic } from "../../entities/Mechanic";
import { Vehicle } from "../../entities/Vehicle";

describe("RepairRecordService", () => {
  const mockRepairRecord = new RepairRecord();
  mockRepairRecord.RepairRecordID = 1;
  mockRepairRecord.EstimatedTime = 100;
  mockRepairRecord.ActualCostTime = 99;
  const mockMechanic = new Mechanic();
  mockMechanic.MechanicID = 1;
  const mockVehicle = new Vehicle();
  mockVehicle.VehicleID = 1;
  mockRepairRecord.Mechanic = mockMechanic;
  mockRepairRecord.Vehicle = mockVehicle;
    
  let service: RepairRecordService;

  let mockRepo: jest.Mocked<{
    findById: RepairRecordRepository["findById"];
    getAll: RepairRecordRepository["getAll"];
    create: RepairRecordRepository["create"];
    update: RepairRecordRepository["update"];
    delete: RepairRecordRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockRepairRecord),
      getAll: jest.fn().mockResolvedValue([mockRepairRecord]),
      create: jest.fn().mockImplementation((repairRecord) => Promise.resolve(repairRecord)),
      update: jest.fn().mockImplementation((repairRecord) => Promise.resolve(repairRecord)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new RepairRecordService(mockRepo as unknown as jest.Mocked<RepairRecordRepository>);

  });

  it("gets all repair records", async () => {
    const result = await service.getAllRepairRecords();
    expect(result).toEqual([mockRepairRecord]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a repair record", async () => {
    const newRepairRecord = new RepairRecord();
    newRepairRecord.ActualCostTime = 100;
    newRepairRecord.EstimatedTime = 99;
    newRepairRecord.Mechanic = mockMechanic;
    newRepairRecord.Vehicle = mockVehicle;
    const service = new RepairRecordService(mockRepo as unknown as RepairRecordRepository);
    const result = await service.createRepairRecord(newRepairRecord);
    expect(mockRepo.create).toHaveBeenCalledWith(newRepairRecord);
    expect(result).toEqual(newRepairRecord);
  });

  it("throws PersistenceError for invalid repair record data", async () => {
    const invalidRepairRecord = new RepairRecord();
    const service = new RepairRecordService(mockRepo as unknown as RepairRecordRepository);
    await expect(service.createRepairRecord(invalidRepairRecord)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createRepairRecord(invalidRepairRecord)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing repair record", async () => {
    const editedRepairRecord = new RepairRecord();
    editedRepairRecord.RepairRecordID = 1;
    editedRepairRecord.EstimatedTime = 200;
    editedRepairRecord.ActualCostTime = 199;
    editedRepairRecord.Mechanic = mockMechanic;
    editedRepairRecord.Vehicle = mockVehicle;
    const result = await service.updateRepairRecord(editedRepairRecord);
    expect(result.EstimatedTime).toBe(200);
    expect(result.ActualCostTime).toBe(199);
    expect(mockRepo.update).toHaveBeenCalledWith(editedRepairRecord);
  });

  it("throws PersistenceError for invalid repairRecord data", async () => {
    const invalidRepairRecord = new RepairRecord();
    invalidRepairRecord.EstimatedTime = 200;
    invalidRepairRecord.ActualCostTime = 199;
    await expect(service.updateRepairRecord(invalidRepairRecord)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateRepairRecord(invalidRepairRecord)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a repair record", async () => {
    const service = new RepairRecordService(mockRepo as unknown as RepairRecordRepository);
    await service.deleteRepairRecord(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if repair record not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("RepairRecord not found", 404);
    });
    const service = new RepairRecordService(mockRepo as unknown as RepairRecordRepository);
    await expect(service.deleteRepairRecord(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteRepairRecord(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
