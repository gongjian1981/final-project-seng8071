import { Repository } from "typeorm";
import { CustomerPhone } from "../entities/CustomerPhone";
import { PersistenceError } from "../errors/PersistenceError";

export class CustomerPhoneRepository {
  constructor(private repo: Repository<CustomerPhone>) {}

  async findById(id: number): Promise<CustomerPhone> {
    const customerPhone = await this.repo.findOne({ where: { CustomerPhoneID: id } });
    if (!customerPhone) {
      throw new PersistenceError("CustomerPhone not found", 404);
    }
    return customerPhone;
  }
  
  async getAll(): Promise<CustomerPhone[]> {
    return this.repo.find();
  }

  async create(customerPhone: CustomerPhone): Promise<CustomerPhone> {
    if (await this.repo.findOne({ where: { CustomerPhoneID: customerPhone.CustomerPhoneID } })) {
      throw new PersistenceError("CustomerPhoneID already exists", 409);
    }
    return this.repo.save(customerPhone);
  }

  async update(customerPhone: Partial<CustomerPhone>): Promise<CustomerPhone> {
    return this.repo.save(customerPhone);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ CustomerPhoneID: id });
    if (result.affected === 0)
      throw new PersistenceError("CustomerPhone not found", 404);
  }
}
