import mongoose from "mongoose";
import debug from "debug";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";
import { _ } from "core-js";

const saltRounds = 10;

const logMessage = debug("api:contollers:auth:message");
const logError = debug("api:controllers:auth:error");

const User = mongoose.model("User");

const register = (req, res) => {
    User.findOne({ $or: [{ email: req.body.email }, { login: req.body.login }] })
        .then(userFound => {
            if (userFound) {
                return res.status(400)
                    .json({
                        error: true,
                        errors: ["User with same email or login exists"]
                    });
            }
            bcrypt.hash(req.body.password, saltRounds, (err, encrypted) => {
                if (err) {
                    logError("Bcrypt error: %O", err);
                    return res.status(500)
                        .json({
                            error: true,
                            errors: ["Internal server error"]
                        });
                }
                req.body.password = encrypted;
                const user = new User(req.body);
                user.save()
                    .then(saved => {
                        logMessage("User saved");
                        return res.json({
                            model: saved
                        })
                    })
                    .catch(err => {
                        logError("User save error: %O", err);
                        return res.status(500)
                            .json({
                                error: true,
                                errors: ["Internal server error"]
                            });
                    });
            });
        })
        .catch(err => {
            logError("User find error: %O", err);
            return res.status(500)
                .json({
                    error: true,
                    errors: ["Internal server error"]
                });
        });
};

const login = (req, res) => {
    User.findOne({ login: req.body.login })
        .then(userFound => {
            if (!userFound) {
                return res.status(404)
                    .json({
                        error: true,
                        errors: ["User not found"]
                    });
            }
            bcrypt.compare(req.body.password, userFound.password)
                .then(compareResult => {
                    if (!compareResult) {
                        return res.status(403)
                            .json({
                                error: true,
                                errors: ["Wrong password"]
                            });
                    }
                    const jwtOptions = req.body.rememberLogin ? {} : {
                        expiresIn: "2 days"
                    };
                    const jwtoken = jwt.sign({ userId: userFound._id.toString() }, config.jwtSecret, jwtOptions);
                    userFound.token = jwtoken;
                    userFound.save()
                        .then(() => {
                            return res.json({
                                error: false
                            });
                        })
                        .catch(err => {
                            logError('User save error: %O', err);
                            return res.status(500)
                                .json({
                                    error: true,
                                    errors: ['Internal server errror']
                                });
                        });
                })
                .catch(err => {
                    logError('Bcrypt error: %O', err);
                    return res.status(500)
                        .json({
                            error: true,
                            errors: ['Internal server errror']
                        });
                });
        })
        .catch(err => {
            logError('User find error: %O', err);
            return res.status(500)
                .json({
                    error: true,
                    errors: ['Internal server errror']
                });
        });
}

export default {
    register,
    login
};