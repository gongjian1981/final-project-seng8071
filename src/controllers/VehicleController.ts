import { Router } from "express";
import { DataSource } from "typeorm";
import { Vehicle } from "../entities/Vehicle";
import { PersistenceError } from "../errors/PersistenceError";
import { VehicleRepository } from "../repositories/VehicleRepository";
import { VehicleService } from "../services/VehicleService";

export const createVehicleRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new VehicleRepository(dataSource.getRepository(Vehicle));
  const service = new VehicleService(repo);

  router.get("/", async (req, res) => {
    try {
      const vehicles = await service.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const vehicle = await service.createVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const vehicle = await service.updateVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      // await service.deleteVehicle(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
