const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret-key", {
            expiresIn: 86400, // 24 hours
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ accessToken: null, message: "Invalid Password!" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret-key", {
            expiresIn: 1800, // 30 minutes
        });

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            gender: user.gender,
            dob: user.dob,
            accessToken: token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.body.userId; // Matching existing pattern
        const { gender, dob } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (gender) user.gender = gender;
        if (dob) user.dob = dob;

        await user.save();

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            gender: user.gender,
            dob: user.dob,
            message: "Profile updated successfully!"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const passwordIsValid = await bcrypt.compare(oldPassword, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: "Invalid old password!" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.body.userId || req.params.id; // Support both just in case

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await user.destroy();
        res.status(200).json({ message: "Account deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
