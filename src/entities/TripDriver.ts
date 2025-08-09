import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Driver } from "./Driver";
import { Trip } from "./Trip";
import { IsNotEmpty } from "class-validator";

@Entity()
export class TripDriver {
  @PrimaryGeneratedColumn()  
  TripDriverID: number = 0;

  @ManyToOne(() => Trip, (trip) => trip.TripDrivers)
  @JoinColumn({ name: "TripID" })
  @IsNotEmpty()
  Trip?: Trip;

  @ManyToOne(() => Driver, (driver) => driver.TripDrivers)
  @JoinColumn({ name: "DriverID" })
  @IsNotEmpty()
  Driver?: Driver;
}
