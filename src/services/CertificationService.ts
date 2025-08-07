import { CertificationRepository } from "../repositories/CertificationRepository";
import { Certification } from "../entities/Certification";
import { validate } from "class-validator";
import { PersistenceError } from "../errors/PersistenceError";

export class CertificationService {
  constructor(private repo: CertificationRepository) {}

  async getAllCertifications(): Promise<Certification[]> {
    return this.repo.getAll();
  }

  async createCertification(data: Partial<Certification>): Promise<Certification> {
    const certification = new Certification();

    certification.Employee = data.Employee;
    certification.VehicleType = data.VehicleType;

    const errors = await validate(certification);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.create(certification);
  }

  async updateCertification(data: Partial<Certification>): Promise<Certification> {
    if (!data.CertificationID) {
      throw new PersistenceError("CertificationID is required for update", 400);
    }
    const certification = await this.repo.findById(data.CertificationID);

    certification.Employee = data.Employee;
    certification.VehicleType = data.VehicleType;

    const errors = await validate(certification);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");
      throw new PersistenceError(`Validation failed: ${errorMessages}`, 400);
    }

    return this.repo.update(certification);
  }

  async deleteCertification(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
