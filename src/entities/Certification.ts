import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";
import { VehicleType } from "./VehicleType";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Certification {
  @PrimaryGeneratedColumn()  
  CertificationID: number = 0;

  @ManyToOne(() => Employee, (employee) => employee.Certifications)
  @JoinColumn({ name: "EmployeeID" })
  @IsNotEmpty()
  Employee?: Employee;

  @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.Vehicles)
  @JoinColumn({ name: "VehicleTypeID" })
  @IsNotEmpty()
  VehicleType?: VehicleType;
}
