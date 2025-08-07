import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Driver } from "./Driver";
import { Trip } from "./Trip";

@Entity()
export class TripDriver {
  @PrimaryGeneratedColumn()  
  TripDriverID: number = 0;

  @ManyToOne(() => Trip, (trip) => trip.TripDrivers)
  @JoinColumn({ name: "TripID" })
  Trip?: Trip;

  @ManyToOne(() => Driver, (driver) => driver.TripDrivers)
  @JoinColumn({ name: "DriverID" })
  Driver?: Driver;
}
