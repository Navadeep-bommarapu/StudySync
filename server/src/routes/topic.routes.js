const controller = require("../controllers/topic.controller");

module.exports = function (app) {
    app.post("/api/topics", controller.create);
    app.put("/api/topics/:id/toggle", controller.toggle);
    app.delete("/api/topics/:id", controller.delete);
};
