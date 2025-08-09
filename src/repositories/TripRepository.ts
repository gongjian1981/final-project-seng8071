import { Repository } from "typeorm";
import { Trip } from "../entities/Trip";
import { PersistenceError } from "../errors/PersistenceError";

export class TripRepository {
  constructor(private repo: Repository<Trip>) {}

  async findById(id: number): Promise<Trip> {
    const trip = await this.repo.findOne({ where: { TripID: id } });
    if (!trip) {
      throw new PersistenceError("Trip not found", 404);
    }
    return trip;
  }

  async getAll(): Promise<Trip[]> {
    return this.repo.find();
  }

  async create(trip: Trip): Promise<Trip> {
    if (await this.repo.findOne({ where: { TripID: trip.TripID } })) {
      throw new PersistenceError("TripID already exists", 409);
    }
    return this.repo.save(trip);
  }
  
  async update(trip: Trip): Promise<Trip> {
    return this.repo.save(trip);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ TripID: id });
    if (result.affected === 0)
      throw new PersistenceError("Trip not found", 404);
  }
}
