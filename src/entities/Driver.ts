import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TripDriver } from "./TripDriver";

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()  
  DriverID: number = 0;

  @Column()
  @IsString()
  @IsNotEmpty()
  DriverName: string = "";

  @OneToMany(() => TripDriver, (tripDriver) => tripDriver.Driver)
  TripDrivers?: TripDriver[];
}
