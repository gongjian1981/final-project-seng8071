import { DriverService } from "../../services/DriverService";
import { Driver } from "../../entities/Driver";
import { PersistenceError } from "../../errors/PersistenceError";
import { DriverRepository } from "../../repositories/DriverRepository";
import { get } from "http";

describe("DriverService", () => {
  const mockDriver = new Driver();
  mockDriver.DriverID = 1;
  mockDriver.DriverName = "Jane Smith";
  
  let service: DriverService;

  let mockRepo: jest.Mocked<{
    findById: DriverRepository["findById"];
    getAll: DriverRepository["getAll"];
    create: DriverRepository["create"];
    update: DriverRepository["update"];
    delete: DriverRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockDriver),
      getAll: jest.fn().mockResolvedValue([mockDriver]),
      create: jest.fn().mockImplementation((driver) => Promise.resolve(driver)),
      update: jest.fn().mockImplementation((driver) => Promise.resolve(driver)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new DriverService(mockRepo as unknown as jest.Mocked<DriverRepository>);

  });

  it("gets all drivers", async () => {
    const result = await service.getAllDrivers();
    expect(result).toEqual([mockDriver]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a driver", async () => {
    const newDriver = new Driver();
    newDriver.DriverName = "New Driver";
    const service = new DriverService(mockRepo as unknown as DriverRepository);
    const result = await service.createDriver(newDriver);
    expect(mockRepo.create).toHaveBeenCalledWith(newDriver);
    expect(result).toEqual(newDriver);
  });

  it("throws PersistenceError for invalid driver data", async () => {
    const invalidDriver = new Driver();
    invalidDriver.DriverName = "";
    const service = new DriverService(mockRepo as unknown as DriverRepository);
    await expect(service.createDriver(invalidDriver)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createDriver(invalidDriver)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing driver", async () => {
    const editedDriver = new Driver();
    editedDriver.DriverID = 1;
    editedDriver.DriverName = "Updated Name";
    const result = await service.updateDriver(editedDriver);
    expect(result.DriverName).toBe("Updated Name");
    expect(mockRepo.update).toHaveBeenCalledWith(editedDriver);
  });

  it("throws PersistenceError for invalid driver data", async () => {
    const invalidDriver = new Driver();
    await expect(service.updateDriver(invalidDriver)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateDriver(invalidDriver)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a driver", async () => {
    const service = new DriverService(mockRepo as unknown as DriverRepository);
    await service.deleteDriver(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if driver not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("Driver not found", 404);
    });
    const service = new DriverService(mockRepo as unknown as DriverRepository);
    await expect(service.deleteDriver(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteDriver(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
