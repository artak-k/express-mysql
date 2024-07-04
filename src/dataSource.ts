import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import {config} from "./config/config";

let dir = config.typeorm_dir;
if (!dir || !["src", "build"].includes(dir)) {
  console.warn("Invalid TYPEORM_DIR");
  dir = (process.env.ENV === "dev") ? "src" : "build";
  console.warn(`Falling back to ${dir}`);
}
const extension = (dir === "src") ? "ts" : "js";
const dbUrl = config.db_url;
if (!dbUrl) {
    process.exit(0)
}
const match = dbUrl.match(/(?!.*\/)(.*)/);

export const AppDataSource = new DataSource({
    "type": "mysql",
    "url": config.db_url,
    "database": match ? match[1]: '',
    "synchronize": false,
    "logging": false,
    "logger": "file",
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
        `${dir}/migrations/**/*.${extension}`
    ]
});