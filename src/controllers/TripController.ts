import { Router } from "express";
import { DataSource } from "typeorm";
import { Trip } from "../entities/Trip";
import { PersistenceError } from "../errors/PersistenceError";
import { TripRepository } from "../repositories/TripRepository";
import { TripService } from "../services/TripService";

export const createTripRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new TripRepository(dataSource.getRepository(Trip));
  const service = new TripService(repo);

  router.get("/", async (req, res) => {
    try {
      const trips = await service.getAllTrips();
      res.json(trips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const trip = await service.createTrip(req.body);
      res.status(201).json(trip);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const trip = await service.updateTrip(req.body);
      res.status(201).json(trip);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      // await service.deleteTrip(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
