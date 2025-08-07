import { Repository } from "typeorm";
import { Certification } from "../entities/Certification";
import { PersistenceError } from "../errors/PersistenceError";

export class CertificationRepository {
  constructor(private repo: Repository<Certification>) {}

  async findById(id: number): Promise<Certification> {
    const certification = await this.repo.findOne({ where: { CertificationID: id } });
    if (!certification) {
      throw new PersistenceError("Certification not found", 404);
    }
    return certification;
  }
  
  async getAll(): Promise<Certification[]> {
    return this.repo.find();
  }

  async create(certification: Certification): Promise<Certification> {
    if (await this.repo.findOne({ where: { CertificationID: certification.CertificationID } })) {
      throw new PersistenceError("CertificationID already exists", 409);
    }
    return this.repo.save(certification);
  }
  
  async update(certification: Partial<Certification>): Promise<Certification> {
    return this.repo.save(certification);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete({ CertificationID: id });
    if (result.affected === 0)
      throw new PersistenceError("Certification not found", 404);
  }
}
