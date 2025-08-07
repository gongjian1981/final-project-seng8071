import { Router } from "express";
import { DataSource } from "typeorm";
import { Mechanic } from "../entities/Mechanic";
import { PersistenceError } from "../errors/PersistenceError";
import { MechanicRepository } from "../repositories/MechanicRepository";
import { MechanicService } from "../services/MechanicService";

export const createMechanicRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new MechanicRepository(dataSource.getRepository(Mechanic));
  const service = new MechanicService(repo);

  router.get("/", async (req, res) => {
    try {
      const mechanics = await service.getAllMechanics();
      res.json(mechanics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mechanics" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const mechanic = await service.createMechanic(req.body);
      res.status(201).json(mechanic);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const mechanic = await service.updateMechanic(req.body);
      res.status(201).json(mechanic);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      // await service.deleteMechanic(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
