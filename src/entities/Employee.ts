import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Certification } from "./Certification";
import { Mechanic } from "./Mechanic";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()  
  EmployeeID: number = 0;

  @Column()
  @IsString()
  @IsNotEmpty()
  FirstName: string = "";

  @Column()
  @IsString()
  @IsNotEmpty()
  Surname: string = "";

  @Column()
  @IsNumber()
  Seniority: number = 0;

  @OneToMany(() => Certification, (certification) => certification.Employee)
  Certifications?: Certification[];

  @OneToMany(() => Mechanic, (mechanic) => mechanic.Employee)
  Mechanics?: Mechanic[];
}
