import express from "express";
import debug from "debug";
import fs from "fs";
import { join } from "path";

import config from "./config";
import Database from "./database/Database";
import registerMiddleware from "./tools/registerMiddleware";

const logMessage = debug("api:server:message");
const logError = debug("api:server:error");

const app = express();

logMessage("Connecting to Mongo");

let database;

try {
    database = new Database();
} catch (err) {
    logError("Error connecting to Mongo");
    process.exit(-1);
}

try {
    const port = config.apiPort;
    logMessage("Bootstrapping models");
    const models = join(__dirname, "./models");
    fs.readdirSync(models)
        .filter(file => ~file.indexOf(".js"))
        .forEach(file => require(join(models, file)));

    logMessage("Bootstrapping routes");

    registerMiddleware(app);
    require("./tools/registerRoutes")(app);

    const listen = () => {
        app.disable("etag");

        app.listen(port);
        logMessage(`API started on port ${port}`);
    };

    logMessage("Mongo handlers registration");
    database.getConnection().then(listen);

} catch (error) {
    console.error(error.stack || error);
}