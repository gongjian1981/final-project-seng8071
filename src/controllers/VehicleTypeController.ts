import { Router } from "express";
import { DataSource } from "typeorm";
import { VehicleType } from "../entities/VehicleType";
import { PersistenceError } from "../errors/PersistenceError";
import { VehicleTypeRepository } from "../repositories/VehicleTypeRepository";
import { VehicleTypeService } from "../services/VehicleTypeService";

export const createVehicleTypeRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new VehicleTypeRepository(dataSource.getRepository(VehicleType));
  const service = new VehicleTypeService(repo);

  router.get("/", async (req, res) => {
    try {
      const vehicleTypes = await service.getAllVehicleTypes();
      res.json(vehicleTypes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicleTypes" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const vehicleType = await service.createVehicleType(req.body);
      res.status(201).json(vehicleType);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const vehicleType = await service.updateVehicleType(req.body);
      res.status(201).json(vehicleType);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      // await service.deleteVehicleType(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
