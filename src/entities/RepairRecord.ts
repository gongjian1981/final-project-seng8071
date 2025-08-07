import { IsNumber } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Mechanic } from "./Mechanic";
import { Vehicle } from "./Vehicle";

@Entity()
export class RepairRecord {
  @PrimaryGeneratedColumn()  
  RepairRecordID: number = 0;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.RepairRecords)
  @JoinColumn({ name: "VehicleID" })
  Vehicle?: Vehicle;

  @ManyToOne(() => Mechanic, (mechanic) => mechanic.RepairRecords)
  @JoinColumn({ name: "MechanicID" })
  Mechanic?: Mechanic;

  @Column()
  @IsNumber()
  EstimatedTime: number = 0;

  @Column()
  @IsNumber()
  ActualCostTime: number = 0;
}
