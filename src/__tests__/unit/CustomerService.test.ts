import { CustomerService } from "../../services/CustomerService";
import { Customer } from "../../entities/Customer";
import { PersistenceError } from "../../errors/PersistenceError";
import { CustomerRepository } from "../../repositories/CustomerRepository";
import { get } from "http";

describe("CustomerService", () => {
  const mockCustomer = new Customer();
  mockCustomer.CustomerID = 1;
  mockCustomer.CustomerName = "John Doe";
  mockCustomer.CustomerAddress = "123 Main St";
  
  let service: CustomerService;

  let mockRepo: jest.Mocked<{
    findById: CustomerRepository["findById"];
    getAll: CustomerRepository["getAll"];
    create: CustomerRepository["create"];
    update: CustomerRepository["update"];
    delete: CustomerRepository["delete"];
  }>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn().mockResolvedValue(mockCustomer),
      getAll: jest.fn().mockResolvedValue([mockCustomer]),
      create: jest.fn().mockImplementation((customer) => Promise.resolve(customer)),
      update: jest.fn().mockImplementation((customer) => Promise.resolve(customer)),
      delete: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    service = new CustomerService(mockRepo as unknown as jest.Mocked<CustomerRepository>);

  });

  it("gets all customers", async () => {
    const result = await service.getAllCustomers();
    expect(result).toEqual([mockCustomer]);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it("creates a customer", async () => {
    const newCustomer = new Customer();
    newCustomer.CustomerName = "New Customer";
    newCustomer.CustomerAddress = "456 Another St";
    const service = new CustomerService(mockRepo as unknown as CustomerRepository);
    const result = await service.createCustomer(newCustomer);
    expect(mockRepo.create).toHaveBeenCalledWith(newCustomer);
    expect(result).toEqual(newCustomer);
  });

  it("throws PersistenceError for invalid customer data", async () => {
    const invalidCustomer = new Customer();
    invalidCustomer.CustomerName = "";
    const service = new CustomerService(mockRepo as unknown as CustomerRepository);
    await expect(service.createCustomer(invalidCustomer)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.createCustomer(invalidCustomer)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("updates an existing customer", async () => {
    const editedCustomer = new Customer();
    editedCustomer.CustomerID = 1;
    editedCustomer.CustomerName = "Updated Name";
    editedCustomer.CustomerAddress = "789 Updated St";
    const result = await service.updateCustomer(editedCustomer);
    expect(result.CustomerName).toBe("Updated Name");
    expect(result.CustomerAddress).toBe("789 Updated St");
    expect(mockRepo.update).toHaveBeenCalledWith(editedCustomer);
  });

  it("throws PersistenceError for invalid customer data", async () => {
    const invalidCustomer = new Customer();
    await expect(service.updateCustomer(invalidCustomer)).rejects.toThrow(
      PersistenceError
    );
    await expect(service.updateCustomer(invalidCustomer)).rejects.toHaveProperty(
      "status",
      400
    );
  });

  it("deletes a customer", async () => {
    const service = new CustomerService(mockRepo as unknown as CustomerRepository);
    await service.deleteCustomer(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("throws PersistenceError if customer not found", async () => {
    mockRepo.delete.mockImplementation(() => {
      throw new PersistenceError("Customer not found", 404);
    });
    const service = new CustomerService(mockRepo as unknown as CustomerRepository);
    await expect(service.deleteCustomer(9999999999)).rejects.toThrow(PersistenceError);
    await expect(service.deleteCustomer(9999999999)).rejects.toHaveProperty(
      "status",
      404
    );
  });
});
