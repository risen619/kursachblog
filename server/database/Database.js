import debug from "debug";
import mongoose from "mongoose";

import config from "../config";

const logMessage = debug("api:database:message");
const logError = debug("api:database:error");

class Database {
    getConnection() {
        if (this._connection) {
            return this._connection;
        } else {
            logMessage("No connection, attempting to create new one");  
        }

        const options = {
            useNewUrlParser: true,
            keepAlive: 1
        };

        logMessage("Connecting mongo at %s with options %O", config.mongodbUri, options);
        mongoose.Promise = Promise;

        this._connection = mongoose.connect(
            config.mongodbUri,
            options
        );

        return this._connection;
    }
}

export default Database;