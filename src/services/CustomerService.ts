import { CustomerRepository } from "../repositories/CustomerRepository";
import { Customer } from "../entities/Customer";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class CustomerService {
  constructor(private repo: CustomerRepository) {}

  async getAllCustomers(): Promise<Customer[]> {
    return this.repo.getAll();
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const customer = new Customer();

    customer.CustomerName = data.CustomerName || "";
    customer.CustomerAddress = data.CustomerAddress || "";

    const errors = await validate(customer);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(customer);
  }

  async updateCustomer(data: Partial<Customer>): Promise<Customer> {
    if (!data.CustomerID) {
      throw new PersistenceError("CustomerID is required for update", 400);
    }
    const customer = await this.repo.findById(data.CustomerID);
    
    customer.CustomerName = data.CustomerName || "";
    customer.CustomerAddress = data.CustomerAddress || "";

    const errors = await validate(customer);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(customer);
  }

  async deleteCustomer(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
