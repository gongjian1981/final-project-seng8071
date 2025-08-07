import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./Employee";
import { RepairRecord } from "./RepairRecord";
import { VehicleType } from "./VehicleType";

@Entity()
export class Mechanic {
  @PrimaryGeneratedColumn()  
  MechanicID: number = 0;

  @ManyToOne(() => Employee, (employee) => employee.Mechanics)
  @JoinColumn({ name: "EmployeeID" })
  Employee?: VehicleType;

  @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.Vehicles)
  @JoinColumn({ name: "VehicleTypeID" })
  VehicleType?: VehicleType;

  @OneToMany(() => RepairRecord, (repairRecord) => repairRecord.Mechanic)
  RepairRecords?: RepairRecord[];
}
