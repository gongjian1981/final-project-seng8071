import { Customer } from "../../entities/Customer";
import { Shipment } from "../../entities/Shipment";
import { PersistenceError } from "../../errors/PersistenceError";
import { ShipmentRepository } from "../../repositories/ShipmentRepository";
import { ShipmentService } from "../../services/ShipmentService";

describe("ShipmentService", () => {
  const mockShipment = new Shipment();
  mockShipment.ShipmentID = 1;
  mockShipment.Weight = 100;
  mockShipment.Value = 98.76;
  mockShipment.OriginPlace = "Toronto";
  mockShipment.DestinationPlace = "Vancouver";
  
  const mockCustomer = new Customer();
  mockCustomer.CustomerID = 1;
  mockShipment.Customer = mockCustomer
  
  let service: ShipmentService;

  let mockRepo: jest.Mocked<{
    findById: ShipmentRepository["findById"];
    getAll: ShipmentRepository["getAll"];
    create: ShipmentRepository["create"];
    update: ShipmentRepository["update"];
    delete: ShipmentRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockShipment),
      getAll: jest.fn().mockResolvedValue([mockShipment]),
      create: jest.fn().mockImplementation((shipment) => Promise.resolve(shipment)),
      update: jest.fn().mockImplementation((shipment) => Promise.resolve(shipment)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new ShipmentService(mockRepo as unknown as jest.Mocked<ShipmentRepository>);

  });

  it("gets all shipments", async () => {
    const result = await service.getAllShipments();
    expect(result).toEqual([mockShipment]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a shipment", async () => {
    const newShipment = new Shipment();
    newShipment.Weight = 100;
    newShipment.Value = 98.76;
    newShipment.OriginPlace = "Toronto";
    newShipment.DestinationPlace = "Vancouver";
    newShipment.Customer = mockCustomer;
    const service = new ShipmentService(mockRepo as unknown as ShipmentRepository);
    const result = await service.createShipment(newShipment);
    expect(mockRepo.create).toHaveBeenCalledWith(newShipment);
    expect(result).toEqual(newShipment);
  });

  it("throws PersistenceError for creating shipment without origin place", async () => {
    const invalidShipment = new Shipment();
    invalidShipment.Weight = 100;
    invalidShipment.Value = 98.76;
    invalidShipment.DestinationPlace = "Vancouver";
    invalidShipment.Customer = mockCustomer;
    const service = new ShipmentService(mockRepo as unknown as ShipmentRepository);
    await expect(service.createShipment(invalidShipment)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createShipment(invalidShipment)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for creating shipment without destination place", async () => {
    const invalidShipment = new Shipment();
    invalidShipment.Weight = 100;
    invalidShipment.Value = 98.76;
    invalidShipment.OriginPlace = "Toronto";
    invalidShipment.Customer = mockCustomer;
    const service = new ShipmentService(mockRepo as unknown as ShipmentRepository);
    await expect(service.createShipment(invalidShipment)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createShipment(invalidShipment)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for creating shipment without customer", async () => {
    const invalidShipment = new Shipment();
    invalidShipment.Weight = 100;
    invalidShipment.Value = 98.76;
    invalidShipment.OriginPlace = "Toronto";
    invalidShipment.DestinationPlace = "Vancouver";
    const service = new ShipmentService(mockRepo as unknown as ShipmentRepository);
    await expect(service.createShipment(invalidShipment)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createShipment(invalidShipment)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing shipment", async () => {
    const editedShipment = new Shipment();
    editedShipment.ShipmentID = 1;
    editedShipment.Weight = 100;
    editedShipment.Value = 98.76;
    editedShipment.OriginPlace = "Toronto";
    editedShipment.DestinationPlace = "Vancouver";
    editedShipment.Customer = mockCustomer; 
    const result = await service.updateShipment(editedShipment);
    expect(result.Weight).toBe(100);
    expect(result.Value).toBe(98.76);
    expect(result.OriginPlace).toBe("Toronto");
    expect(result.DestinationPlace).toBe("Vancouver");
    expect(result.Customer).toEqual(mockCustomer);
    expect(mockRepo.update).toHaveBeenCalledWith(editedShipment);
  });

  it("throws PersistenceError for updating shipment without ShipmentID", async () => {
    const invalidShipment = new Shipment();
    invalidShipment.Weight = 100;
    invalidShipment.Value = 98.76;
    invalidShipment.OriginPlace = "Toronto";
    invalidShipment.DestinationPlace = "Vancouver";
    invalidShipment.Customer = mockCustomer;
    await expect(service.updateShipment(invalidShipment)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateShipment(invalidShipment)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating shipment without origin place", async () => {
    const invalidShipment = new Shipment();
    invalidShipment.ShipmentID = 1;
    invalidShipment.Weight = 100;
    invalidShipment.Value = 98.76;
    invalidShipment.DestinationPlace = "Vancouver";
    invalidShipment.Customer = mockCustomer;
    await expect(service.updateShipment(invalidShipment)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateShipment(invalidShipment)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating shipment without destination place", async () => {
    const invalidShipment = new Shipment();
    invalidShipment.ShipmentID = 1;
    invalidShipment.Weight = 100;
    invalidShipment.Value = 98.76;
    invalidShipment.DestinationPlace = "Vancouver";
    invalidShipment.Customer = mockCustomer;
    await expect(service.updateShipment(invalidShipment)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateShipment(invalidShipment)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating shipment without customer", async () => {
    const invalidShipment = new Shipment();
    invalidShipment.ShipmentID = 1;
    invalidShipment.Weight = 100;
    invalidShipment.Value = 98.76;
    invalidShipment.OriginPlace = "Toronto";
    invalidShipment.DestinationPlace = "Vancouver";
    await expect(service.updateShipment(invalidShipment)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateShipment(invalidShipment)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a shipment", async () => {
    const service = new ShipmentService(mockRepo as unknown as ShipmentRepository);
    await service.deleteShipment(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if shipment not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("Shipment not found", 404);
    });
    const service = new ShipmentService(mockRepo as unknown as ShipmentRepository);
    await expect(service.deleteShipment(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteShipment(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
