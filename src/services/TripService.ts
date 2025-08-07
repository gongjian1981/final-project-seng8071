import { TripRepository } from "../repositories/TripRepository";
import { Trip } from "../entities/Trip";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class TripService {
  constructor(private repo: TripRepository) {}

  async getAllTrips(): Promise<Trip[]> {
    return this.repo.getAll();
  }

  async createTrip(data: Partial<Trip>): Promise<Trip> {
    const trip = new Trip();

    trip.Vehicle = data.Vehicle;
    trip.FromPlace = data.FromPlace || "";
    trip.ToPlace = data.ToPlace || "";
    trip.Shipment = data.Shipment;

    const errors = await validate(trip);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(trip);
  }

  async updateTrip(data: Partial<Trip>): Promise<Trip> {
    if (!data.TripID) {
      throw new PersistenceError("TripID is required for update", 400);
    }
    const trip = await this.repo.findById(data.TripID);

    trip.Vehicle = data.Vehicle;
    trip.FromPlace = data.FromPlace || "";
    trip.ToPlace = data.ToPlace || "";
    trip.Shipment = data.Shipment;

    const errors = await validate(trip);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(trip);
  }

  async deleteTrip(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
