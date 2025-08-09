import { Router } from "express";
import { DataSource } from "typeorm";
import { Shipment } from "../entities/Shipment";
import { PersistenceError } from "../errors/PersistenceError";
import { ShipmentRepository } from "../repositories/ShipmentRepository";
import { ShipmentService } from "../services/ShipmentService";

export const createShipmentRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new ShipmentRepository(dataSource.getRepository(Shipment));
  const service = new ShipmentService(repo);

  router.get("/", async (req, res) => {
    try {
      const shipments = await service.getAllShipments();
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipments" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const shipment = await service.createShipment(req.body);
      res.status(201).json(shipment);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const shipment = await service.updateShipment(req.body);
      res.status(201).json(shipment);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.deleteShipment(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
