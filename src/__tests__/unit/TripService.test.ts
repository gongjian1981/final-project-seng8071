import { Shipment } from "../../entities/Shipment";
import { Trip } from "../../entities/Trip";
import { Vehicle } from "../../entities/Vehicle";
import { PersistenceError } from "../../errors/PersistenceError";
import { TripRepository } from "../../repositories/TripRepository";
import { TripService } from "../../services/TripService";

describe("TripService", () => {
  const mockTrip = new Trip();
  mockTrip.TripID = 1;
  mockTrip.FromPlace = "Toronto";
  mockTrip.ToPlace = "Vancouver";

  const mockVehicle = new Vehicle();
  mockVehicle.VehicleID = 1;
  mockTrip.Vehicle = mockVehicle;

  const mockShipment = new Shipment();
  mockShipment.ShipmentID = 1;
  mockTrip.Shipment = mockShipment;
  
  let service: TripService;

  let mockRepo: jest.Mocked<{
    findById: TripRepository["findById"];
    getAll: TripRepository["getAll"];
    create: TripRepository["create"];
    update: TripRepository["update"];
    delete: TripRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockTrip),
      getAll: jest.fn().mockResolvedValue([mockTrip]),
      create: jest.fn().mockImplementation((trip) => Promise.resolve(trip)),
      update: jest.fn().mockImplementation((trip) => Promise.resolve(trip)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new TripService(mockRepo as unknown as jest.Mocked<TripRepository>);

  });

  it("gets all trips", async () => {
    const result = await service.getAllTrips();
    expect(result).toEqual([mockTrip]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a trip", async () => {
    const newTrip = new Trip();
    newTrip.FromPlace = "New Trip";
    newTrip.ToPlace = "New Destination";
    newTrip.Vehicle = mockVehicle;
    newTrip.Shipment = mockShipment;
    const service = new TripService(mockRepo as unknown as TripRepository);
    const result = await service.createTrip(newTrip);
    expect(mockRepo.create).toHaveBeenCalledWith(newTrip);
    expect(result).toEqual(newTrip);
  });

  it("throws PersistenceError for creating trip without from place", async () => {
    const invalidTrip = new Trip();
    invalidTrip.ToPlace = "Invalid Destination";
    invalidTrip.Vehicle = mockVehicle;
    invalidTrip.Shipment = mockShipment;
    const service = new TripService(mockRepo as unknown as TripRepository);
    await expect(service.createTrip(invalidTrip)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createTrip(invalidTrip)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for creating trip without to place", async () => {
    const invalidTrip = new Trip();
    invalidTrip.FromPlace = "Invalid Trip";
    invalidTrip.Vehicle = mockVehicle;
    invalidTrip.Shipment = mockShipment;
    const service = new TripService(mockRepo as unknown as TripRepository);
    await expect(service.createTrip(invalidTrip)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createTrip(invalidTrip)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for creating trip without vehicle", async () => {
    const invalidTrip = new Trip();
    invalidTrip.FromPlace = "Invalid Trip";
    invalidTrip.ToPlace = "Invalid Destination";
    invalidTrip.Shipment = mockShipment;
    const service = new TripService(mockRepo as unknown as TripRepository);
    await expect(service.createTrip(invalidTrip)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createTrip(invalidTrip)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for creating trip without shipment", async () => {
    const invalidTrip = new Trip();
    invalidTrip.FromPlace = "Invalid Trip";
    invalidTrip.ToPlace = "Invalid Destination";
    invalidTrip.Vehicle = mockVehicle;
    const service = new TripService(mockRepo as unknown as TripRepository);
    await expect(service.createTrip(invalidTrip)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createTrip(invalidTrip)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing trip", async () => {
    const editedTrip = new Trip();
    editedTrip.TripID = 1;
    editedTrip.FromPlace = "Calgary";
    editedTrip.ToPlace = "Halifax";
    editedTrip.Vehicle = mockVehicle;
    editedTrip.Shipment = mockShipment;
    const result = await service.updateTrip(editedTrip);
    expect(result.FromPlace).toBe("Calgary");
    expect(result.ToPlace).toBe("Halifax");
    expect(mockRepo.update).toHaveBeenCalledWith(editedTrip);
  });

  it("throws PersistenceError for updating trip without TripID", async () => {
    const invalidTrip = new Trip();
    invalidTrip.FromPlace = "Invalid Trip";
    invalidTrip.ToPlace = "Invalid Destination";
    invalidTrip.Vehicle = mockVehicle;
    invalidTrip.Shipment = mockShipment;
    await expect(service.updateTrip(invalidTrip)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateTrip(invalidTrip)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating trip without from place", async () => {
    const invalidTrip = new Trip();
    invalidTrip.TripID = 1;
    invalidTrip.ToPlace = "Invalid Destination";
    invalidTrip.Vehicle = mockVehicle;
    invalidTrip.Shipment = mockShipment;
    await expect(service.updateTrip(invalidTrip)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateTrip(invalidTrip)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating trip without to place", async () => {
    const invalidTrip = new Trip();
    invalidTrip.TripID = 1;
    invalidTrip.FromPlace = "Invalid Trip";
    invalidTrip.Vehicle = mockVehicle;
    invalidTrip.Shipment = mockShipment;
    await expect(service.updateTrip(invalidTrip)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateTrip(invalidTrip)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating trip without vehicle", async () => {
    const invalidTrip = new Trip();
    invalidTrip.TripID = 1;
    invalidTrip.FromPlace = "Invalid Trip";
    invalidTrip.ToPlace = "Invalid Destination";
    invalidTrip.Shipment = mockShipment;
    await expect(service.updateTrip(invalidTrip)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateTrip(invalidTrip)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating trip without shipment", async () => {
    const invalidTrip = new Trip();
    invalidTrip.TripID = 1;
    invalidTrip.FromPlace = "Invalid Trip";
    invalidTrip.ToPlace = "Invalid Destination";
    invalidTrip.Vehicle = mockVehicle;
    await expect(service.updateTrip(invalidTrip)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateTrip(invalidTrip)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a trip", async () => {
    const service = new TripService(mockRepo as unknown as TripRepository);
    await service.deleteTrip(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if trip not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("Trip not found", 404);
    });
    const service = new TripService(mockRepo as unknown as TripRepository);
    await expect(service.deleteTrip(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteTrip(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
