import { Router } from "express";
import { DataSource } from "typeorm";
import { RepairRecord } from "../entities/RepairRecord";
import { PersistenceError } from "../errors/PersistenceError";
import { RepairRecordRepository } from "../repositories/RepairRecordRepository";
import { RepairRecordService } from "../services/RepairRecordService";

export const createRepairRecordRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new RepairRecordRepository(dataSource.getRepository(RepairRecord));
  const service = new RepairRecordService(repo);

  router.get("/", async (req, res) => {
    try {
      const repairRecords = await service.getAllRepairRecords();
      res.json(repairRecords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch repairRecords" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const repairRecord = await service.createRepairRecord(req.body);
      res.status(201).json(repairRecord);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const repairRecord = await service.updateRepairRecord(req.body);
      res.status(201).json(repairRecord);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      // await service.deleteRepairRecord(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
