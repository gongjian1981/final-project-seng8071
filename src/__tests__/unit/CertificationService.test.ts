import { Certification } from "../../entities/Certification";
import { Employee } from "../../entities/Employee";
import { VehicleType } from "../../entities/VehicleType";
import { PersistenceError } from "../../errors/PersistenceError";
import { CertificationRepository } from "../../repositories/CertificationRepository";
import { CertificationService } from "../../services/CertificationService";

describe("CertificationService", () => {
  const mockCertification = new Certification();
  mockCertification.CertificationID = 1;

  const mockVihecleType = new VehicleType();
  mockVihecleType.VehicleTypeID = 1;
  mockVihecleType.VehicleTypeName = "Cargo Truck";
  mockCertification.VehicleType = mockVihecleType;
  
  const mockEmployee = new Employee();
  mockEmployee.EmployeeID = 1;
  mockEmployee.FirstName = "John";
  mockEmployee.Surname = "Doe";
  mockCertification.Employee = mockEmployee;
  
  let service: CertificationService;

  let mockRepo: jest.Mocked<{
    findById: CertificationRepository["findById"];
    getAll: CertificationRepository["getAll"];
    create: CertificationRepository["create"];
    update: CertificationRepository["update"];
    delete: CertificationRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockCertification),
      getAll: jest.fn().mockResolvedValue([mockCertification]),
      create: jest.fn().mockImplementation((certification) => Promise.resolve(certification)),
      update: jest.fn().mockImplementation((certification) => Promise.resolve(certification)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new CertificationService(mockRepo as unknown as jest.Mocked<CertificationRepository>);

  });

  it("gets all certifications", async () => {
    const result = await service.getAllCertifications();
    expect(result).toEqual([mockCertification]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a certification", async () => {
    const newCertification = new Certification();
    newCertification.VehicleType = mockVihecleType;
    newCertification.Employee = mockEmployee;
    const service = new CertificationService(mockRepo as unknown as CertificationRepository);
    const result = await service.createCertification(newCertification);
    expect(mockRepo.create).toHaveBeenCalledWith(newCertification);
    expect(result).toEqual(newCertification);
  });

  it("throws PersistenceError for creating certification without employee", async () => {
    const invalidCertification = new Certification();
    invalidCertification.VehicleType = mockVihecleType;
    const service = new CertificationService(mockRepo as unknown as CertificationRepository);
    await expect(service.createCertification(invalidCertification)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createCertification(invalidCertification)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for creating certification without vehicle type", async () => {
    const invalidCertification = new Certification();
    invalidCertification.Employee = mockEmployee;
    const service = new CertificationService(mockRepo as unknown as CertificationRepository);
    await expect(service.createCertification(invalidCertification)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createCertification(invalidCertification)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing certification", async () => {
    const editedCertification = new Certification();
    editedCertification.CertificationID = 1;
    editedCertification.VehicleType = mockVihecleType;
    editedCertification.Employee = mockEmployee;
    const result = await service.updateCertification(editedCertification);
    expect(result.VehicleType).toEqual(mockVihecleType);
    expect(result.Employee).toEqual(mockEmployee);
    expect(mockRepo.update).toHaveBeenCalledWith(editedCertification);
  });

  it("throws PersistenceError for updating certification without CertificationID", async () => {
    const invalidCertification = new Certification();
    invalidCertification.VehicleType = mockVihecleType;
    invalidCertification.Employee = mockEmployee;
    await expect(service.updateCertification(invalidCertification)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateCertification(invalidCertification)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating certification without employee", async () => {
    const invalidCertification = new Certification();
    invalidCertification.CertificationID = 1;
    invalidCertification.VehicleType = mockVihecleType;
    await expect(service.updateCertification(invalidCertification)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateCertification(invalidCertification)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("throws PersistenceError for updating certification without vehicle type", async () => {
    const invalidCertification = new Certification();
    invalidCertification.CertificationID = 1;
    invalidCertification.Employee = mockEmployee;
    await expect(service.updateCertification(invalidCertification)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateCertification(invalidCertification)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a certification", async () => {
    const service = new CertificationService(mockRepo as unknown as CertificationRepository);
    await service.deleteCertification(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if certification not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("Certification not found", 404);
    });
    const service = new CertificationService(mockRepo as unknown as CertificationRepository);
    await expect(service.deleteCertification(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteCertification(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
