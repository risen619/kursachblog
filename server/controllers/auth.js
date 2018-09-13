import mongoose from "mongoose";
import debug from "debug";
import bcrypt from "bcrypt";

const saltRounds = 10;

const logMessage = debug("api:contollers:auth:message");
const logError = debug("api:controllers:auth:error");

const User = mongoose.model("User");

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds, (err, encrypted) => {
        if (err) {
            return next(err);
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
                logMessage("Err")
                next(err);
            });
    });
};

export default { register };