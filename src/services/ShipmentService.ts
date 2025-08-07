import { ShipmentRepository } from "../repositories/ShipmentRepository";
import { Shipment } from "../entities/Shipment";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class ShipmentService {
  constructor(private repo: ShipmentRepository) {}

  async getAllShipments(): Promise<Shipment[]> {
    return this.repo.getAll();
  }

  async createShipment(data: Partial<Shipment>): Promise<Shipment> {
    const shipment = new Shipment();

    shipment.Weight = data.Weight || 0;
    shipment.Value = data.Value || 0;
    shipment.Customer = data.Customer;
    shipment.OriginPlace = data.OriginPlace || "";
    shipment.DestinationPlace = data.DestinationPlace || "";

    const errors = await validate(shipment);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(shipment);
  }

  async updateShipment(data: Partial<Shipment>): Promise<Shipment> {
    if (!data.ShipmentID) {
      throw new PersistenceError("ShipmentID is required for update", 400);
    }
    const shipment = await this.repo.findById(data.ShipmentID);

    shipment.Weight = data.Weight || 0;
    shipment.Value = data.Value || 0;
    shipment.Customer = data.Customer;
    shipment.OriginPlace = data.OriginPlace || "";
    shipment.DestinationPlace = data.DestinationPlace || "";

    const errors = await validate(shipment);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(shipment);
  }

  async deleteShipment(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
