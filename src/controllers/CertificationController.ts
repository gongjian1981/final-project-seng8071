import { Router } from "express";
import { DataSource } from "typeorm";
import { Certification } from "../entities/Certification";
import { PersistenceError } from "../errors/PersistenceError";
import { CertificationRepository } from "../repositories/CertificationRepository";
import { CertificationService } from "../services/CertificationService";

export const createCertificationRouter = (dataSource: DataSource): Router => {
  const router = Router();

  const repo = new CertificationRepository(dataSource.getRepository(Certification));
  const service = new CertificationService(repo);

  router.get("/", async (req, res) => {
    try {
      const certifications = await service.getAllCertifications();
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch certifications" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const certification = await service.createCertification(req.body);
      res.status(201).json(certification);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.put("/", async (req, res) => {
    try {
      const certification = await service.updateCertification(req.body);
      res.status(201).json(certification);
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 500;
      res.status(status).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await service.deleteCertification(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      const status = error instanceof PersistenceError ? error.status : 404;
      res.status(status).json({ error: error.message });
    }
  });

  return router;
};
