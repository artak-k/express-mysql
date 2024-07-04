# Awesome Project Build with TypeORM

Node version 20.0.0
Steps to run this project:

1. Run `CREATE DATABASE task CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;` in MYSQL to create db
2. Run `ts-node ./node_modules/.bin/typeorm migration:generate ./src/migrations/USERS -d ./src/dataSource.ts` to generate model diff migration
3. `ts-node ./node_modules/.bin/typeorm migration:run -d ./src/dataSource.ts` to run migrations
4. Run `npm start` to run project

