import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Vehicle } from "./Vehicle";

@Entity()
export class VehicleType {
  @PrimaryGeneratedColumn()  
  VehicleTypeID: number = 0;

  @Column()
  @IsString()
  @IsNotEmpty()
  VehicleTypeName: string = "";

  @OneToMany(() => Vehicle, (vehicle) => vehicle.VehicleType)
  Vehicles?: Vehicle[];
}
