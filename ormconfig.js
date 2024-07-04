require('dotenv').config();

let dir = process.env.TYPEORM_DIR;
if (!dir || !["src", "build"].includes(dir)) {
  console.warn("Invalid TYPEORM_DIR");
  dir = (process.env.ENV === "dev") ? "src" : "build";
  console.warn(`Falling back to ${dir}`);
}
const extension = (dir === "src") ? "ts" : "js";

module.exports = {
  "type": "mysql",
  "url": process.env.DATABASE_URL,
  "database": process.env.DATABASE_URL.match(/(?!.*\/)(.*)/)[1],
  "synchronize": false,
  "logging": false,
  "charset": "utf8mb4",
  "extra": {
    "charset": "utf8mb4",
    "supportBigNumbers": true,
    "bigNumberStrings": false
  },
  "entities": [
    `${dir}/entity/**/*.${extension}`
  ],
  "migrations": [
    `${dir}/migration/**/*.${extension}`
  ],
  "cli": {
    "entitiesDir": `${dir}/entity`,
    "migrationsDir": `${dir}/migration`,
  }
};
