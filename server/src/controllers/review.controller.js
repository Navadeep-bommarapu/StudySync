const db = require("../models");
const Review = db.Review;

exports.create = async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.send(review);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const reviews = await Review.findAll({ order: [['createdAt', 'DESC']] });
        res.send(reviews);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Review.destroy({ where: { id: id } });
        res.send({ message: "Review deleted successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
