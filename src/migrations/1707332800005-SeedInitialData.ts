import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialData1707332800005 implements MigrationInterface {
  public static readonly transaction = false;

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Clear existing data
    await queryRunner.query(`TRUNCATE TABLE trip_driver, 
      driver, trip, shipment, customer_phone, customer, repair_record, 
      mechanic, certification, employee, vehicle, vehicle_type 
      RESTART IDENTITY CASCADE;;`);

    // Insert vehicle types
    await queryRunner.query(`
      INSERT INTO vehicle_type ("VehicleTypeName")
      VALUES 
        ('Cargo Planes'),
        ('In-city trucks'),
        ('long haul trucks');
    `);
    
    // Insert vehicles
    await queryRunner.query(`
      INSERT INTO vehicle ("Brand", "Load", "Capacity", "Year", "NumberOfRepairs", "VehicleTypeID") VALUES
        ('Harris, Tran and Roberson', 6082, 14773, 2000, 7, 1),
        ('Thompson, Koch and Rivera', 3816, 16170, 2022, 10, 3),
        ('Vasquez Ltd', 6872, 20319, 2004, 0, 1),
        ('Scott Ltd', 8641, 24792, 2018, 5, 2),
        ('Young and Sons', 9942, 16923, 2003, 7, 3),
        ('Landry PLC', 7993, 10866, 2017, 1, 3),
        ('Bell Inc', 6531, 32539, 2023, 2, 3),
        ('Greene Inc', 5832, 34974, 2015, 7, 1),
        ('Knapp, Cruz and Andrews', 6186, 24594, 2013, 8, 1),
        ('Perry, Baldwin and Barker', 5110, 48167, 2009, 2, 1);
    `);

    // Insert employees
    await queryRunner.query(`
      INSERT INTO employee ("FirstName", "Surname", "Seniority") VALUES
        ('Colleen', 'Jones', 2),
        ('Marie', 'Mata', 4),
        ('Joseph', 'Moses', 8),
        ('Kayla', 'Roberts', 4),
        ('Lauren', 'Powers', 5),
        ('Hunter', 'Woods', 8),
        ('Cameron', 'Graham', 1),
        ('John', 'Farmer', 6),
        ('Michael', 'Gardner', 4),
        ('Stephanie', 'Buckley', 3);
    `);

    // Insert certifications
    await queryRunner.query(`
      INSERT INTO certification ("EmployeeID", "VehicleTypeID") VALUES
        (1, 3),
        (2, 1),
        (3, 2),
        (4, 1),
        (5, 2),
        (6, 3),
        (7, 1),
        (8, 2),
        (9, 3),
        (10, 3);
    `);

    // Insert mechanics
    await queryRunner.query(`
      INSERT INTO mechanic ("EmployeeID", "VehicleTypeID") VALUES
        (1, 3),
        (2, 3),
        (3, 2),
        (4, 1),
        (5, 3),
        (6, 2),
        (7, 1),
        (8, 3),
        (9, 2),
        (10, 2);
    `);

    // Insert repair records
    await queryRunner.query(`
      INSERT INTO repair_record ("EstimatedTime", "ActualCostTime", "VehicleID", "MechanicID") VALUES
      (13, 15, 7, 2),
      (8, 9, 10, 2),
      (6, 7, 5, 4),
      (7, 17, 10, 6),
      (11, 12, 6, 6),
      (10, 11, 1, 2),
      (12, 7, 6, 7),
      (11, 8, 2, 4),
      (13, 14, 9, 6),
      (5, 11, 7, 5);
    `);

    // Insert customers
    await queryRunner.query(`
      INSERT INTO customer ("CustomerName", "CustomerAddress") VALUES
        ('Alvarez, Sullivan and Duran', '09781 Graham Mountain, Port Timothy, DC 13114'),
        ('Erickson-Edwards', '04534 Catherine Pass Suite 307, Timothymouth, NJ 48613'),
        ('Cook, Coleman and Stewart', '6292 Choi Island Suite 129, South Michael, NY 80769'),
        ('Shepherd, Stark and Boyer', 'Unit 2836 Box 0310, DPO AA 43207'),
        ('Howard-Cardenas', '76695 Kenneth Union Suite 969, New Kevinchester, VT 73545'),
        ('Howell-Obrien', '513 Gonzalez Divide, Robertsburgh, DE 57642'),
        ('Ho, Cochran and Roberson', '6160 Beth Mill, New Jaredmouth, MD 73194'),
        ('Smith-Zuniga', '46339 Sara Course, Stevehaven, GA 19548'),
        ('Barton, Wright and Osborn', '2536 Abbott Extensions, Port Morganstad, MA 83916'),
        ('Turner Ltd', '406 Gentry Ford Apt. 138, Rodgersfort, DE 39879');
    `);

    // Insert customer phones
    await queryRunner.query(`
      INSERT INTO customer_phone ("PhoneNumber", "CustomerID") VALUES
        ('140-780-1367x2479', 1),
        ('(711)988-6111x06296', 2),
        ('(711)988-6111x06266', 2),
        ('014.122.5345x04110', 3),
        ('901-329-8055x784', 4),
        ('+1-203-643-8281x815', 5),
        ('575.377.2159', 6),
        ('256.884.9532x3847', 7),
        ('+1-160-647-0554x9562', 8),
        ('(851)808-5723x732', 9),
        ('(851)808-5723x733', 9),
        ('1553911986', 10);
    `);

    // Insert shipments
    await queryRunner.query(`
      INSERT INTO shipment ("Weight", "Value", "OriginPlace", "DestinationPlace", "CustomerID") VALUES
        (1348, 13931, 'Taylorton', 'Valerieton', 4),
        (2932, 58764, 'North Bobbyfurt', 'North Michelleton', 9),
        (4491, 22032, 'Parkmouth', 'Patriciaberg', 4),
        (803, 58766, 'North Zachary', 'Port Gracemouth', 10),
        (2097, 31912, 'Wilkersonmouth', 'Lake Marissaland', 8),
        (3400, 52970, 'North Robin', 'Lake Meganmouth', 6),
        (2005, 11498, 'West Nathan', 'Port Stevenburgh', 2),
        (2475, 61529, 'North Megan', 'Lake Susan', 10),
        (3113, 31612, 'Wardbury', 'Chapmanbury', 10),
        (3216, 70787, 'Poncechester', 'West Elizabethmouth', 3);
    `);

    // Insert trips
    await queryRunner.query(`
      INSERT INTO trip ("FromPlace", "ToPlace", "VehicleID", "ShipmentID") VALUES
        ('North Annachester', 'Harperhaven', 2, 3),
        ('West Jamieborough', 'West Caleb', 7, 6),
        ('West James', 'Michaelport', 10, 8),
        ('North Lisa', 'East Sarah', 6, 9),
        ('Shawnhaven', 'Josephmouth', 7, 10),
        ('West Reginaview', 'Robertview', 3, 9),
        ('North Theresaport', 'Merrittburgh', 7, 8),
        ('West Thomas', 'West Brendahaven', 5, 6),
        ('New Nathanmouth', 'South Robertchester', 1, 4),
        ('New Victoria', 'Thompsonburgh', 6, 7);
    `);

    // Insert drivers
    await queryRunner.query(`
      INSERT INTO driver ("DriverName") VALUES
        ('Dr. Francisco Myers'),
        ('Karen Martin'),
        ('Andrea Brown'),
        ('Michael Hoffman'),
        ('Meghan Brown'),
        ('Jeffery Petty'),
        ('Elizabeth Flores'),
        ('Vickie Hughes'),
        ('Kimberly Carter'),
        ('Max Holden');
    `);

    // Insert trip drivers
    await queryRunner.query(`
      INSERT INTO trip_driver ("TripID", "DriverID") VALUES
        (1, 1),
        (1, 9),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
        (6, 6),
        (7, 7),
        (8, 8),
        (9, 1),
        (9, 9),
        (10, 10);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE trip_driver, 
      driver, trip, shipment, customer_phone, customer, repair_record, 
      mechanic, certification, employee, vehicle, vehicle_type 
      RESTART IDENTITY CASCADE;;`);
  }
}
