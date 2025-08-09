import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./Customer";
import { Trip } from "./Trip";

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()  
  ShipmentID: number = 0;

  @ManyToOne(() => Customer, (customer) => customer.CustomerPhones)
  @JoinColumn({ name: "CustomerID" })
  @IsNotEmpty()
  Customer?: Customer;

  @Column()
  @IsNumber()
  Weight: number = 0;

  @Column()
  @IsNumber()
  Value: number = 0;

  @Column()
  @IsString()
  @IsNotEmpty()
  OriginPlace: string = "";

  @Column()
  @IsString()
  @IsNotEmpty()
  DestinationPlace: string = "";

  @OneToMany(() => Trip, (trip) => trip.Shipment)
  Trips?: Trip[];
}
