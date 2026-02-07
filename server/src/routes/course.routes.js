const controller = require("../controllers/course.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/courses", controller.create);
    app.get("/api/courses", controller.findAll);
    app.put("/api/courses/:id", controller.update);
    app.delete("/api/courses/:id", controller.delete);
};
