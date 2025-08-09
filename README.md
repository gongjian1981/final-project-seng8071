# Final Project - SENG8071

This is the final project for **SENG8071**, built with TypeScript, Express, TypeORM, PostgreSQL, and Jest for testing. The project extend the midterm project’s Customs Freight Company database into a working RESTful API.


## Prerequisites

Before starting, ensure the following are installed:

- Node.js (v20+ recommended)
- npm (v9+)
- Docker & Docker Compose

## Installation

Before running the project, make sure you have installed all dependencies.

Run the following command in the project root directory:

   ```bash
   npm install
   ```

This will install all required packages listed in package.json, including TypeScript, ts-node, Jest, Express, TypeORM, and others.

## Docker Setup 

To spin up PostgreSQL and other services via Docker:

```bash
npm run docker:up
```

This will execute `docker-compose up -d` based on the `docker-compose.yml` configuration.

## Start the Server

```bash
npm start
```

This will run:

```bash
ts-node src/index.ts
```

The server should start and connect to the database.

## Run Tests

```bash
npm test
```

This runs all tests using Jest. 

## Scripts Summary

| Command              | Description                          |
|----------------------|--------------------------------------|
| `npm start`          | Start the server using ts-node       |
| `npm test`           | Run unit/integration tests via Jest  |
| `npm run docker:up`  | Start Docker containers via Compose  |

## API List

After starting the server, open [http://localhost:3000/](http://localhost:3000/) in your browser to see the API List.

## Migrations

```bash
npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts
```
