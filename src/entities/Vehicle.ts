import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RepairRecord } from "./RepairRecord";
import { Trip } from "./Trip";
import { VehicleType } from "./VehicleType";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()  
  VehicleID: number = 0;

  @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.Vehicles)
  @JoinColumn({ name: "VehicleTypeID" })
  VehicleType?: VehicleType;

  @Column()
  @IsString()
  @IsNotEmpty()
  Brand: string = "";

  @Column()
  @IsNumber()
  Load: number = 0;

  @Column()
  @IsNumber()
  Capacity: number = 0;

  @Column()
  @IsNumber()
  Year: number = 0;

  @Column()
  @IsNumber()
  NumberOfRepairs: number = 0;

  @OneToMany(() => RepairRecord, (repairRecord) => repairRecord.Vehicle)
  RepairRecords?: RepairRecord[];

  @OneToMany(() => Trip, (trip) => trip.Vehicle)
  Trips?: Trip[];
}
