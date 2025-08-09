import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Shipment } from "./Shipment";
import { TripDriver } from "./TripDriver";
import { Vehicle } from "./Vehicle";

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()  
  TripID: number = 0;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.Trips)
  @JoinColumn({ name: "VehicleID" })
  @IsNotEmpty()
  Vehicle?: Vehicle;

  @ManyToOne(() => Shipment, (shipment) => shipment.Trips)
  @JoinColumn({ name: "ShipmentID" })
  @IsNotEmpty()
  Shipment?: Shipment;

  @Column()
  @IsString()
  @IsNotEmpty()
  FromPlace: string = "";

  @Column()
  @IsString()
  @IsNotEmpty()
  ToPlace: string = "";

  @OneToMany(() => TripDriver, (tripDriver) => tripDriver.Trip)
  TripDrivers?: TripDriver[];
}
