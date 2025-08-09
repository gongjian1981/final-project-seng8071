import { Repository } from "typeorm";
import { Shipment } from "../entities/Shipment";
import { PersistenceError } from "../errors/PersistenceError";

export class ShipmentRepository {
  constructor(private repo: Repository<Shipment>) {}

  async findById(id: number): Promise<Shipment> {
    const shipment = await this.repo.findOne({ where: { ShipmentID: id } });
    if (!shipment) {
      throw new PersistenceError("Shipment not found", 404);
    }
    return shipment;
  }

  async getAll(): Promise<Shipment[]> {
    return this.repo.find();
  }

  async create(shipment: Shipment): Promise<Shipment> {
    if (await this.repo.findOne({ where: { ShipmentID: shipment.ShipmentID } })) {
      throw new PersistenceError("ShipmentID already exists", 409);
    }
    return this.repo.save(shipment);
  }

  async update(shipment: Shipment): Promise<Shipment> {
    return this.repo.save(shipment);
  }
  
  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ ShipmentID: id });
    if (result.affected === 0)
      throw new PersistenceError("Shipment not found", 404);
  }
}
