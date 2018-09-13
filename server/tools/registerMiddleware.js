import compression from "compression";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

export default (app) => {
    app.use(compression({
        threshold: 512
    }));

    app.use(fileUpload());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
};
