import { Router } from "express";
import { DataSource } from "typeorm";
import { Employee } from "../entities/Employee";
import { PersistenceError } from "../errors/PersistenceError";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
import { EmployeeService } from "../services/EmployeeService";

export const createEmployeeRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new EmployeeRepository(dataSource.getRepository(Employee));
  const service = new EmployeeService(repo);

  router.get("/", async (req, res) => {
    try {
      const employees = await service.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const employee = await service.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const employee = await service.updateEmployee(req.body);
      res.status(201).json(employee);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      // await service.deleteEmployee(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
