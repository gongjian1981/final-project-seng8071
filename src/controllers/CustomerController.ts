import { Router } from "express";
import { DataSource } from "typeorm";
import { Customer } from "../entities/Customer";
import { PersistenceError } from "../errors/PersistenceError";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { CustomerService } from "../services/CustomerService";

export const createCustomerRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new CustomerRepository(dataSource.getRepository(Customer));
  const service = new CustomerService(repo);

  router.get("/", async (req, res) => {
    try {
      const customers = await service.getAllCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const customer = await service.createCustomer(req.body);
      res.status(201).json(customer);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const customer = await service.updateCustomer(req.body);
      res.status(201).json(customer);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      // await service.deleteCustomer(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
