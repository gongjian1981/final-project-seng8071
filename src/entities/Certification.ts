import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";
import { VehicleType } from "./VehicleType";

@Entity()
export class Certification {
  @PrimaryGeneratedColumn()  
  CertificationID: number = 0;

  @ManyToOne(() => Employee, (employee) => employee.Certifications)
  @JoinColumn({ name: "EmployeeID" })
  Employee?: VehicleType;

  @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.Vehicles)
  @JoinColumn({ name: "VehicleTypeID" })
  VehicleType?: VehicleType;
}
