import { DataSource } from "typeorm";

let dataSource: DataSource | undefined;

export const getTestDataSource = async (): Promise<DataSource> => {
  if (dataSource?.isInitialized) {
    return dataSource;
  }
  dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Conestoga#2025@Final",
    database: "customs_freight_db",
    entities: ["src/entities/*.ts"],
    synchronize: false,
  });
  await dataSource.initialize();
  return dataSource;
};

export const closeTestDataSource = async (): Promise<void> => {
  if (dataSource?.isInitialized) {
    await dataSource.destroy();
    dataSource = undefined;
  }
};
