import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";
import { RepairRecord } from "./RepairRecord";
import { VehicleType } from "./VehicleType";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Mechanic {
  @PrimaryGeneratedColumn()  
  MechanicID: number = 0;

  @ManyToOne(() => Employee, (employee) => employee.Mechanics)
  @JoinColumn({ name: "EmployeeID" })
  @IsNotEmpty()
  Employee?: Employee;

  @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.Vehicles)
  @JoinColumn({ name: "VehicleTypeID" })
  @IsNotEmpty()
  VehicleType?: VehicleType;

  @OneToMany(() => RepairRecord, (repairRecord) => repairRecord.Mechanic)
  RepairRecords?: RepairRecord[];
}
