import auth from "../controllers/auth";

module.exports = function registerRoutes(app) {

    app.post("/register", auth.register);

    app.use(function (req, res) {
        res.status(404).json({
            error: true,
            errors: ["Route not found"]
        });
    });
}; 