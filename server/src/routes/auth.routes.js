const controller = require("../controllers/auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/signup", controller.signup);
    app.post("/api/auth/login", controller.login);
    app.put("/api/auth/profile", controller.updateProfile);
    app.put("/api/auth/password", controller.changePassword);
    app.delete("/api/auth/account/:id", controller.deleteAccount);
};
