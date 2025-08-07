import { Router } from "express";
import { DataSource } from "typeorm";
import { CustomerPhone } from "../entities/CustomerPhone";
import { PersistenceError } from "../errors/PersistenceError";
import { CustomerPhoneRepository } from "../repositories/CustomerPhoneRepository";
import { CustomerPhoneService } from "../services/CustomerPhoneService";

export const createCustomerPhoneRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new CustomerPhoneRepository(dataSource.getRepository(CustomerPhone));
  const service = new CustomerPhoneService(repo);

  router.get("/", async (req, res) => {
    try {
      const customerPhones = await service.getAllCustomerPhones();
      res.json(customerPhones);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customerPhones" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const customerPhone = await service.createCustomerPhone(req.body);
      res.status(201).json(customerPhone);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const customerPhone = await service.updateCustomerPhone(req.body);
      res.status(201).json(customerPhone);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      // await service.deleteCustomerPhone(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
