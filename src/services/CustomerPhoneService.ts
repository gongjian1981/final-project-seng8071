import { CustomerPhoneRepository } from "../repositories/CustomerPhoneRepository";
import { CustomerPhone } from "../entities/CustomerPhone";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class CustomerPhoneService {
  constructor(private repo: CustomerPhoneRepository) {}

  async getAllCustomerPhones(): Promise<CustomerPhone[]> {
    return this.repo.getAll();
  }

  async createCustomerPhone(data: Partial<CustomerPhone>): Promise<CustomerPhone> {
    const customerPhone = new CustomerPhone();

    customerPhone.Customer = data.Customer;
    customerPhone.PhoneNumber = data.PhoneNumber || "";

    const errors = await validate(customerPhone);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(customerPhone);
  }

  async updateCustomerPhone(data: Partial<CustomerPhone>): Promise<CustomerPhone> {
    if (!data.CustomerPhoneID) {
      throw new PersistenceError("CustomerPhoneID is required for update", 400);
    }
    const customerPhone = await this.repo.findById(data.CustomerPhoneID);

    customerPhone.Customer = data.Customer;
    customerPhone.PhoneNumber = data.PhoneNumber || "";

    const errors = await validate(customerPhone);
    if (errors.length > 0) {
      console.log(errors);
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(customerPhone);
  }

  async deleteCustomerPhone(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
