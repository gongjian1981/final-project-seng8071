import { Router } from "express";
import { DataSource } from "typeorm";
import { TripDriver } from "../entities/TripDriver";
import { PersistenceError } from "../errors/PersistenceError";
import { TripDriverRepository } from "../repositories/TripDriverRepository";
import { TripDriverService } from "../services/TripDriverService";

export const createTripDriverRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new TripDriverRepository(dataSource.getRepository(TripDriver));
  const service = new TripDriverService(repo);

  router.get("/", async (req, res) => {
    try {
      const tripDrivers = await service.getAllTripDrivers();
      res.json(tripDrivers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tripDrivers" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const tripDriver = await service.createTripDriver(req.body);
      res.status(201).json(tripDriver);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const tripDriver = await service.updateTripDriver(req.body);
      res.status(201).json(tripDriver);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      // await service.deleteTripDriver(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
