import { VehicleType } from "../../entities/VehicleType";
import { PersistenceError } from "../../errors/PersistenceError";
import { VehicleTypeRepository } from "../../repositories/VehicleTypeRepository";
import { VehicleTypeService } from "../../services/VehicleTypeService";

describe("VehicleTypeService", () => {
  const mockVehicleType = new VehicleType();
  mockVehicleType.VehicleTypeID = 1;
  mockVehicleType.VehicleTypeName = "Cargo Truck";
  
  let service: VehicleTypeService;

  let mockRepo: jest.Mocked<{
    findById: VehicleTypeRepository["findById"];
    getAll: VehicleTypeRepository["getAll"];
    create: VehicleTypeRepository["create"];
    update: VehicleTypeRepository["update"];
    delete: VehicleTypeRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockVehicleType),
      getAll: jest.fn().mockResolvedValue([mockVehicleType]),
      create: jest.fn().mockImplementation((vehicleType) => Promise.resolve(vehicleType)),
      update: jest.fn().mockImplementation((vehicleType) => Promise.resolve(vehicleType)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new VehicleTypeService(mockRepo as unknown as jest.Mocked<VehicleTypeRepository>);

  });

  it("gets all vehicle types", async () => {
    const result = await service.getAllVehicleTypes();
    expect(result).toEqual([mockVehicleType]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a vehicle type", async () => {
    const newVehicleType = new VehicleType();
    newVehicleType.VehicleTypeName = "New VehicleType";
    const service = new VehicleTypeService(mockRepo as unknown as VehicleTypeRepository);
    const result = await service.createVehicleType(newVehicleType);
    expect(mockRepo.create).toHaveBeenCalledWith(newVehicleType);
    expect(result).toEqual(newVehicleType);
  });

  it("throws PersistenceError for creating vehicle type without type name", async () => {
    const invalidVehicleType = new VehicleType();
    const service = new VehicleTypeService(mockRepo as unknown as VehicleTypeRepository);
    await expect(service.createVehicleType(invalidVehicleType)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createVehicleType(invalidVehicleType)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing vehicle type", async () => {
    const editedVehicleType = new VehicleType();
    editedVehicleType.VehicleTypeID = 1;
    editedVehicleType.VehicleTypeName = "Updated Name";
    const result = await service.updateVehicleType(editedVehicleType);
    expect(result.VehicleTypeName).toBe("Updated Name");
    expect(mockRepo.update).toHaveBeenCalledWith(editedVehicleType);
  });

  it("throws PersistenceError for updating vehicle type without type name", async () => {
    const invalidVehicleType = new VehicleType();
    await expect(service.updateVehicleType(invalidVehicleType)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateVehicleType(invalidVehicleType)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a vehicle type", async () => {
    const service = new VehicleTypeService(mockRepo as unknown as VehicleTypeRepository);
    await service.deleteVehicleType(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if vehicle type not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("VehicleType not found", 404);
    });
    const service = new VehicleTypeService(mockRepo as unknown as VehicleTypeRepository);
    await expect(service.deleteVehicleType(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteVehicleType(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
