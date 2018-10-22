import compression from "compression";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

export default (app) => {
    app.use(cookieParser())
    app.use(compression({
        threshold: 512
    }));

    app.use(fileUpload());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
};
