import { Router } from "express";
import { DataSource } from "typeorm";
import { Driver } from "../entities/Driver";
import { PersistenceError } from "../errors/PersistenceError";
import { DriverRepository } from "../repositories/DriverRepository";
import { DriverService } from "../services/DriverService";

export const createDriverRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new DriverRepository(dataSource.getRepository(Driver));
  const service = new DriverService(repo);

  router.get("/", async (req, res) => {
    try {
      const drivers = await service.getAllDrivers();
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch drivers" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const driver = await service.createDriver(req.body);
      res.status(201).json(driver);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const driver = await service.updateDriver(req.body);
      res.status(201).json(driver);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      // await service.deleteDriver(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
