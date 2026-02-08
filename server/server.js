const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const path = require("path");
const db = require("./src/models");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Serve Static Files (Frontend Build)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Routes
require("./src/routes/auth.routes")(app);
require("./src/routes/course.routes")(app);
require("./src/routes/activity.routes")(app);
require("./src/routes/review.routes")(app);
require("./src/routes/topic.routes")(app);

// Test Route (API)
app.get("/api", (req, res) => {
    res.json({ message: "Welcome to Smart Study Planner API" });
});

// Wildcard Route (Redirect to Home on Refresh/Deep Link)
app.get('*', (req, res) => {
    res.redirect('/');
});

// Sync Database and Start Server
const PORT = process.env.PORT || 5000;
console.log("Loaded Models:", Object.keys(db));
db.sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Failed to sync db: " + err.message);
});
