const db = require("../models");
const Course = db.Course;
const Topic = db.Topic;
const Resource = db.Resource;

// Create and Save a new Course
exports.create = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).send({ message: "Content can not be empty!" });
        }

        const courseData = {
            title: req.body.title,
            targetHours: req.body.targetHours,
            color: req.body.color,
            userId: req.body.userId,
            dueDate: req.body.dueDate,
            topics: req.body.topics // Expecting array of objects { title: "...", resources: [...] }
        };

        const data = await Course.create(courseData, {
            include: [
                {
                    model: Topic,
                    as: "topics",
                    include: [{ model: Resource, as: "resources" }]
                }
            ]
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Course."
        });
    }
};

// Retrieve all Courses for a User
exports.findAll = async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).send({ message: "UserId is required" });
    }

    try {
        const data = await Course.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Topic,
                    as: "topics",
                    include: [{ model: Resource, as: "resources" }]
                }
            ]
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving courses."
        });
    }
};

// Update a Course
exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        // Update Course Details
        await Course.update(req.body, { where: { id: id } });

        // Update Topics (Destroy & Recreate Strategy)
        if (req.body.topics) {
            // 1. Delete existing topics (Cascade deletes resources)
            await Topic.destroy({ where: { courseId: id } });

            // 2. Create new topics with resources
            // Structure: req.body.topics = [{ title, isCompleted, resources: [{...}] }]
            for (const t of req.body.topics) {
                await Topic.create({
                    title: t.title,
                    isCompleted: t.isCompleted,
                    targetMinutes: t.targetMinutes,
                    courseId: id,
                    resources: t.resources // Association alias must match
                }, {
                    include: [{ model: Resource, as: "resources" }]
                });
            }
        }

        res.send({ message: "Course was updated successfully." });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).send({ message: "Error updating Course with id=" + id });
    }
};

// Delete a Course
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Course.destroy({ where: { id: id } });
        if (num == 1) {
            res.send({ message: "Course was deleted successfully!" });
        } else {
            res.send({ message: `Cannot delete Course with id=${id}. Maybe Course was not found!` });
        }
    } catch (err) {
        res.status(500).send({ message: "Could not delete Course with id=" + id });
    }
};
