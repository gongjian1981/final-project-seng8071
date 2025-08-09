import { Driver } from "../../entities/Driver";
import { Trip } from "../../entities/Trip";
import { TripDriver } from "../../entities/TripDriver";
import { PersistenceError } from "../../errors/PersistenceError";
import { TripDriverRepository } from "../../repositories/TripDriverRepository";
import { TripDriverService } from "../../services/TripDriverService";

describe("TripDriverService", () => {
  const mockTripDriver = new TripDriver();
  mockTripDriver.TripDriverID = 1;

  const mockTrip = new Trip();
  mockTrip.TripID = 1;
  mockTripDriver.Trip = mockTrip;

  const mockDriver = new Driver();
  mockDriver.DriverID = 1;
  mockTripDriver.Driver = mockDriver;
  
  let service: TripDriverService;

  let mockRepo: jest.Mocked<{
    findById: TripDriverRepository["findById"];
    getAll: TripDriverRepository["getAll"];
    create: TripDriverRepository["create"];
    update: TripDriverRepository["update"];
    delete: TripDriverRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockTripDriver),
      getAll: jest.fn().mockResolvedValue([mockTripDriver]),
      create: jest.fn().mockImplementation((tripDriver) => Promise.resolve(tripDriver)),
      update: jest.fn().mockImplementation((tripDriver) => Promise.resolve(tripDriver)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new TripDriverService(mockRepo as unknown as jest.Mocked<TripDriverRepository>);

  });

  it("gets all trip drivers", async () => {
    const result = await service.getAllTripDrivers();
    expect(result).toEqual([mockTripDriver]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a trip driver", async () => {
    const newTripDriver = new TripDriver();
    newTripDriver.Trip = mockTrip;
    newTripDriver.Driver = mockDriver;
    const service = new TripDriverService(mockRepo as unknown as TripDriverRepository);
    const result = await service.createTripDriver(newTripDriver);
    expect(mockRepo.create).toHaveBeenCalledWith(newTripDriver);
    expect(result).toEqual(newTripDriver);
  });

  it("throws PersistenceError for creating trip driver without trip", async () => {
    const invalidTripDriver = new TripDriver();
    invalidTripDriver.Driver = mockDriver;
    const service = new TripDriverService(mockRepo as unknown as TripDriverRepository);
    await expect(service.createTripDriver(invalidTripDriver)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createTripDriver(invalidTripDriver)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for creating trip driver without driver", async () => {
    const invalidTripDriver = new TripDriver();
    invalidTripDriver.Trip = mockTrip;
    const service = new TripDriverService(mockRepo as unknown as TripDriverRepository);
    await expect(service.createTripDriver(invalidTripDriver)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createTripDriver(invalidTripDriver)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing trip driver", async () => {
    const editedTripDriver = new TripDriver();
    editedTripDriver.TripDriverID = 1;
    editedTripDriver.Trip = mockTrip;
    editedTripDriver.Driver = mockDriver;
    const result = await service.updateTripDriver(editedTripDriver);
    expect(result.Trip).toEqual(mockTrip);
    expect(result.Driver).toEqual(mockDriver);
    expect(mockRepo.update).toHaveBeenCalledWith(editedTripDriver);
  });

  it("throws PersistenceError for updating trip driver without TripDriverID", async () => {
    const invalidTripDriver = new TripDriver();
    invalidTripDriver.Trip = mockTrip;
    invalidTripDriver.Driver = mockDriver;
    await expect(service.updateTripDriver(invalidTripDriver)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateTripDriver(invalidTripDriver)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating trip driver without trip", async () => {
    const invalidTripDriver = new TripDriver();
    invalidTripDriver.TripDriverID = 1;
    invalidTripDriver.Driver = mockDriver;
    await expect(service.updateTripDriver(invalidTripDriver)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateTripDriver(invalidTripDriver)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating trip driver without driver", async () => {
    const invalidTripDriver = new TripDriver();
    invalidTripDriver.TripDriverID = 1;
    invalidTripDriver.Trip = mockTrip;
    await expect(service.updateTripDriver(invalidTripDriver)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateTripDriver(invalidTripDriver)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a trip driver", async () => {
    const service = new TripDriverService(mockRepo as unknown as TripDriverRepository);
    await service.deleteTripDriver(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if trip driver not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("TripDriver not found", 404);
    });
    const service = new TripDriverService(mockRepo as unknown as TripDriverRepository);
    await expect(service.deleteTripDriver(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteTripDriver(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
