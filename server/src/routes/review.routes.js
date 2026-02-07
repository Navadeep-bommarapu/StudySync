const controller = require("../controllers/review.controller");

module.exports = function (app) {
    app.get("/api/reviews", controller.findAll);
    app.post("/api/reviews", controller.create);
    app.delete("/api/reviews/:id", controller.delete);
};
