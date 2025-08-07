import express from "express";
import { ConnectionOptions, DataSource } from "typeorm";
import { createCertificationRouter, createCustomerRouter, createDriverRouter, createEmployeeRouter, createMechanicRouter, createRepairRecordRouter, createShipmentRouter, createTripDriverRouter, createTripRouter, createVehicleRouter } from "./controllers";
import { createVehicleTypeRouter } from "./controllers/VehicleTypeController";

export const app = express();
app.use(express.json());

export const initializeApp = async (
  connectionOptions?: ConnectionOptions | DataSource
) => {
  let dataSource: DataSource;

  if (connectionOptions instanceof DataSource) {
    dataSource = connectionOptions;
  } else {
    const options: ConnectionOptions = connectionOptions || {
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "Conestoga#2025@Final",
      database: "customs_freight_db",
      entities: ["src/entities/*.ts"],
      synchronize: true,
    };
    dataSource = new DataSource(options);
    await dataSource.initialize();
  }

  app.use("/certifications", createCertificationRouter(dataSource));
  app.use("/customers", createCustomerRouter(dataSource));
  app.use("/customerphones", createCustomerRouter(dataSource));
  app.use("/drivers", createDriverRouter(dataSource));
  app.use("/employees", createEmployeeRouter(dataSource));
  app.use("/mechanics", createMechanicRouter(dataSource));
  app.use("/repairrecords", createRepairRecordRouter(dataSource));
  app.use("/shipments", createShipmentRouter(dataSource));
  app.use("/trips", createTripRouter(dataSource));
  app.use("/tripdrivers", createTripDriverRouter(dataSource));
  app.use("/vehicles", createVehicleRouter(dataSource));
  app.use("/vehicletypes", createVehicleTypeRouter(dataSource));


  return app;
};

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  initializeApp().then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
  });
}
