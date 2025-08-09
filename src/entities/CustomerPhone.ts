import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./Customer";

@Entity()
export class CustomerPhone {
  @PrimaryGeneratedColumn()  
  CustomerPhoneID: number = 0;

  @ManyToOne(() => Customer, (customer) => customer.CustomerPhones)
  @JoinColumn({ name: "CustomerID" })
  @IsNotEmpty()
  Customer?: Customer;

  @Column()
  @IsString()
  @IsNotEmpty()
  PhoneNumber: string = "";
}
