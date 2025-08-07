import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomerPhone } from "./CustomerPhone";
import { Shipment } from "./Shipment";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()  
  CustomerID: number = 0;

  @Column()
  @IsString()
  @IsNotEmpty()
  CustomerName: string = "";

  @Column()
  @IsString()
  @IsNotEmpty()
  CustomerAddress: string = "";

  @OneToMany(() => CustomerPhone, (customerPhone) => customerPhone.Customer)
  CustomerPhones?: CustomerPhone[];

  @OneToMany(() => Shipment, (shipment) => shipment.Customer)
  Shipments?: Shipment[];
}
