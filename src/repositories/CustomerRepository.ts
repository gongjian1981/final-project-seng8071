import { Repository } from "typeorm";
import { Customer } from "../entities/Customer";
import { PersistenceError } from "../errors/PersistenceError";

export class CustomerRepository {
  constructor(private repo: Repository<Customer>) {}

  async findById(id: number): Promise<Customer> {
    const customer = await this.repo.findOne({ where: { CustomerID: id } });
    if (!customer) {
      throw new PersistenceError("Customer not found", 404);
    }
    return customer;
  }
  
  async getAll(): Promise<Customer[]> {
    return this.repo.find();
  }

  async create(customer: Customer): Promise<Customer> {
    if (await this.repo.findOne({ where: { CustomerID: customer.CustomerID } })) {
      throw new PersistenceError("CustomerID already exists", 409);
    }
    return this.repo.save(customer);
  }

  async update(customer: Partial<Customer>): Promise<Customer> {
    return this.repo.save(customer);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ CustomerID: id });
    if (result.affected === 0)
      throw new PersistenceError("Customer not found", 404);
  }
}
