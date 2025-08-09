import { CustomerPhoneService } from "../../services/CustomerPhoneService";
import { CustomerPhone } from "../../entities/CustomerPhone";
import { PersistenceError } from "../../errors/PersistenceError";
import { CustomerPhoneRepository } from "../../repositories/CustomerPhoneRepository";
import { get } from "http";
import { Customer } from "../../entities/Customer";

describe("CustomerPhoneService", () => {
  const mockCustomerPhone = new CustomerPhone();
  mockCustomerPhone.CustomerPhoneID = 1;
  mockCustomerPhone.PhoneNumber = "123-456-7890";
  const mockCustomer = new Customer();
  mockCustomer.CustomerID = 1;
  mockCustomer.CustomerName = "Amazon Logistics";
  mockCustomerPhone.Customer = mockCustomer;
  
  let service: CustomerPhoneService;

  let mockRepo: jest.Mocked<{
    findById: CustomerPhoneRepository["findById"];
    getAll: CustomerPhoneRepository["getAll"];
    create: CustomerPhoneRepository["create"];
    update: CustomerPhoneRepository["update"];
    delete: CustomerPhoneRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockCustomerPhone),
      getAll: jest.fn().mockResolvedValue([mockCustomerPhone]),
      create: jest.fn().mockImplementation((customerPhone) => Promise.resolve(customerPhone)),
      update: jest.fn().mockImplementation((customerPhone) => Promise.resolve(customerPhone)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new CustomerPhoneService(mockRepo as unknown as jest.Mocked<CustomerPhoneRepository>);

  });

  it("gets all customer phones", async () => {
    const result = await service.getAllCustomerPhones();
    expect(result).toEqual([mockCustomerPhone]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a customer phone", async () => {
    const newCustomerPhone = new CustomerPhone();
    newCustomerPhone.PhoneNumber = "123-456-7890";
    newCustomerPhone.Customer = mockCustomer;
    const service = new CustomerPhoneService(mockRepo as unknown as CustomerPhoneRepository);
    const result = await service.createCustomerPhone(newCustomerPhone);
    expect(mockRepo.create).toHaveBeenCalledWith(newCustomerPhone);
    expect(result).toEqual(newCustomerPhone);
  });

  it("throws PersistenceError for invalid customer phone data", async () => {
    const invalidCustomerPhone = new CustomerPhone();
    const service = new CustomerPhoneService(mockRepo as unknown as CustomerPhoneRepository);
    await expect(service.createCustomerPhone(invalidCustomerPhone)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createCustomerPhone(invalidCustomerPhone)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing customer phone", async () => {
    const editedCustomerPhone = new CustomerPhone();
    editedCustomerPhone.CustomerPhoneID = 1;
    editedCustomerPhone.PhoneNumber = "234-567-8901";
    editedCustomerPhone.Customer = mockCustomer;
    const result = await service.updateCustomerPhone(editedCustomerPhone);
    expect(result.PhoneNumber).toBe("234-567-8901");
    expect(mockRepo.update).toHaveBeenCalledWith(editedCustomerPhone);
  });

  it("throws PersistenceError for invalid customer phone data", async () => {
    const invalidCustomerPhone = new CustomerPhone();
    invalidCustomerPhone.Customer = mockCustomer;
    await expect(service.updateCustomerPhone(invalidCustomerPhone)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateCustomerPhone(invalidCustomerPhone)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a customer phone", async () => {
    const service = new CustomerPhoneService(mockRepo as unknown as CustomerPhoneRepository);
    await service.deleteCustomerPhone(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if customer phone not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("CustomerPhone not found", 404);
    });
    const service = new CustomerPhoneService(mockRepo as unknown as CustomerPhoneRepository);
    await expect(service.deleteCustomerPhone(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteCustomerPhone(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
