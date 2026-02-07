const db = require("../models");
const Topic = db.Topic;
const Resource = db.Resource;

exports.create = async (req, res) => {
    try {
        const data = await Topic.create(req.body);
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.toggle = async (req, res) => {
    const id = req.params.id;
    try {
        const topic = await Topic.findByPk(id);
        if (topic) {
            topic.isCompleted = !topic.isCompleted;
            await topic.save();
            res.send(topic);
        } else {
            res.status(404).send({ message: "Topic not found" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await Topic.destroy({ where: { id: req.params.id } });
        res.send({ message: "Topic deleted" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}
