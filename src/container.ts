import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import * as express from "express";


class Container {
    private _app: express.Express|undefined;
    private _dbConnection: Connection|undefined;
    get app() {
        if (!this._app) {
            this._app = express();
            this._app.use(express.json());
        }
        return this._app;
    }

    get dbConnection() {
        return this._dbConnection;
    }

    async createConnection() {
        this._dbConnection = await createConnection();
        return this._dbConnection;
    }
}

export const container = new Container();
