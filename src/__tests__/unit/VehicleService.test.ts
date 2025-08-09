import { Vehicle } from "../../entities/Vehicle";
import { VehicleType } from "../../entities/VehicleType";
import { PersistenceError } from "../../errors/PersistenceError";
import { VehicleRepository } from "../../repositories/VehicleRepository";
import { VehicleService } from "../../services/VehicleService";

describe("VehicleService", () => {
  const mockVehicle = new Vehicle();
  mockVehicle.VehicleID = 1;
  mockVehicle.Brand = "ABC123";
  mockVehicle.Capacity = 1000;
  mockVehicle.Load = 2000;
  mockVehicle.Year = 2020;
  mockVehicle.NumberOfRepairs = 0;
  
  let service: VehicleService;

  let mockRepo: jest.Mocked<{
    findById: VehicleRepository["findById"];
    getAll: VehicleRepository["getAll"];
    create: VehicleRepository["create"];
    update: VehicleRepository["update"];
    delete: VehicleRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockVehicle),
      getAll: jest.fn().mockResolvedValue([mockVehicle]),
      create: jest.fn().mockImplementation((vehicle) => Promise.resolve(vehicle)),
      update: jest.fn().mockImplementation((vehicle) => Promise.resolve(vehicle)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new VehicleService(mockRepo as unknown as jest.Mocked<VehicleRepository>);

  });

  it("gets all vehicles", async () => {
    const result = await service.getAllVehicles();
    expect(result).toEqual([mockVehicle]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a vehicle", async () => {
    const newVehicle = new Vehicle();
    newVehicle.Brand = "ABC123";
    newVehicle.Capacity = 1000;
    newVehicle.Load = 2000;
    newVehicle.Year = 2020;
    newVehicle.NumberOfRepairs = 0;    
    
    const service = new VehicleService(mockRepo as unknown as VehicleRepository);
    const result = await service.createVehicle(newVehicle);
    expect(mockRepo.create).toHaveBeenCalledWith(newVehicle);
    expect(result).toEqual(newVehicle);
  });

  it("throws PersistenceError for invalid vehicle data", async () => {
    const invalidVehicle = new Vehicle();
    invalidVehicle.VehicleID = 1;
    const service = new VehicleService(mockRepo as unknown as VehicleRepository);
    await expect(service.createVehicle(invalidVehicle)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createVehicle(invalidVehicle)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing vehicle", async () => {
    const editedVehicle = new Vehicle();
    editedVehicle.VehicleID = 1;
    editedVehicle.Brand = "XYZ789";
    editedVehicle.Capacity = 900;
    editedVehicle.Load = 1999;
    editedVehicle.Year = 2019;
    editedVehicle.NumberOfRepairs = 9;        
    const result = await service.updateVehicle(editedVehicle);
    expect(result.Brand).toBe("XYZ789");
    expect(result.Capacity).toBe(900);
    expect(result.Load).toBe(1999);
    expect(result.Year).toBe(2019);
    expect(result.NumberOfRepairs).toBe(9);

    expect(mockRepo.update).toHaveBeenCalledWith(editedVehicle);
  });

  it("throws PersistenceError for invalid vehicle data", async () => {
    const invalidVehicle = new Vehicle();
    await expect(service.updateVehicle(invalidVehicle)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateVehicle(invalidVehicle)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a vehicle", async () => {
    const service = new VehicleService(mockRepo as unknown as VehicleRepository);
    await service.deleteVehicle(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if vehicle not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("Vehicle not found", 404);
    });
    const service = new VehicleService(mockRepo as unknown as VehicleRepository);
    await expect(service.deleteVehicle(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteVehicle(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
