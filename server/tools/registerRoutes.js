import debug from "debug";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";


import config from "../config";
import auth from "../controllers/auth";
import posts from "../controllers/posts";

const logMessage = debug("api:registerRoutes:message");
const logError = debug("api:registerRoutes:error");

const User = mongoose.model("User");

const inPublicRoutes = [
    /^\/api\/v1\/login$/,
    /^\/api\/v1\/register$/
];

module.exports = function registerRoutes(app) {

    function authMiddleware(req, res, next) {
        for (let publicRoute of inPublicRoutes) {
            let patt = new RegExp(publicRoute);
            if (patt.test(req.path)) {
                return next();
            }
        };
        if (!req.cookies || !req.cookies.Authorization) {
            logError("Unauthorized API call! %s", req.path);
            return res.status(401)
                .json({
                    error: true,
                    errors: ["Unauthorized API call"]
                });
        }
        let token = req.cookies.Authorization.split(" ")[1];

        User.findOne({ token: token })
            .then(user => {
                if (!user) {
                    logError("No session found!");
                    return res.status(401)
                        .json({
                            error: true,
                            errors: ["No session found"]
                        });
                }
                jwt.verify(token, config.jwtSecret, function (err, decoded) {
                    if (err && err.name === "TokenExpiredError") {
                        logError("JWT expired");
                        return res.status(401)
                            .json({
                                error: true,
                                errors: ["Unauthorized API call"]
                            });
                    }
                    req._user = user;
                    res.cookie("Authorization", "Bearer " + token);
                    next();
                });
            })
            .catch(err => {
                logError('User find error: %O', err);
                return res.status(500)
                    .json({
                        error: true,
                        errors: ["Internal server error"]
                    });
            });

    }
    app.use(authMiddleware);

    app.post("/api/v1/register", auth.register);
    app.post("/api/v1/login", auth.login);

    app.post("/api/v1/posts", posts.create);
    app.get("/api/v1/posts", posts.all);

    app.get("/api/v1/posts/:id", posts.load);
    app.delete("/api/v1/posts/:id", posts.remove);

    app.put("/api/v1/posts/:id/addComment", posts.addComment);



    app.use(function (req, res) {
        res.status(404).json({
            error: true,
            errors: ["Route not found"]
        });
    });
}; 