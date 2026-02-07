const db = require("../models");
const ActivityLog = db.ActivityLog;
const Course = db.Course;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

// Log a study session
exports.logSession = async (req, res) => {
    try {
        const { userId, courseId, topicId, minutes, date } = req.body;

        // 1. Create Log
        await ActivityLog.create({
            userId,
            courseId,
            topicId: topicId || null,
            minutes,
            date: date || new Date()
        });

        // 2. Update Topic studiedMinutes (if applicable)
        if (topicId) {
            const Topic = db.Topic;
            const topic = await Topic.findByPk(topicId);
            if (topic) {
                topic.studiedMinutes = (topic.studiedMinutes || 0) + parseFloat(minutes);

                // Auto-complete if target reached
                if (topic.targetMinutes > 0 && topic.studiedMinutes >= topic.targetMinutes) {
                    topic.isCompleted = true;
                }

                await topic.save();
            }
        }

        // 3. Update Course studiedHours
        const course = await Course.findByPk(courseId);
        if (course) {
            course.studiedHours = (parseFloat(course.studiedHours) || 0) + (minutes / 60);
            await course.save();
        }

        res.send({ message: "Session logged successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Get Weekly Stats & Strict Streak
exports.getStats = async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).send({ message: "UserId required" });

    try {
        // --- 1. Yearly Data for Heatmap (Last 365 Days) ---
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setDate(today.getDate() - 365);
        oneYearAgo.setHours(0, 0, 0, 0);

        const logs = await ActivityLog.findAll({
            where: {
                userId: userId,
                date: {
                    [Op.gte]: oneYearAgo
                }
            }
        });

        // Pre-aggregate logs by Date String (YYYY-MM-DD)
        const statsMap = {};
        logs.forEach(log => {
            // Assume log.date is stored as UTC midnight (from DateOnly string)
            // safely handle both Date object and string
            let d = new Date(log.date);
            // Use UTC date parts to avoid timezone shifting if stored as UTC midnight
            const dateStr = d.toISOString().split('T')[0];

            statsMap[dateStr] = (statsMap[dateStr] || 0) + parseFloat(log.minutes);
        });

        // Initialize buckets for last 365 days
        const yearlyStats = [];

        // Use Local Time construction to match "Today" as defined by the user's browser/system context
        // This ensures dateStr matches the DB date string (YYYY-MM-DD) even if created from local time
        const statsToday = new Date();
        const statsStart = new Date();
        statsStart.setDate(statsToday.getDate() - 365);

        for (let i = 0; i <= 365; i++) {
            const d = new Date(statsStart);
            d.setDate(statsStart.getDate() + i);

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const minutes = statsMap[dateStr] || 0;

            let intensity = 0;
            if (minutes > 0) {
                if (minutes < 30) intensity = 1;      // Level 1
                else if (minutes < 60) intensity = 2; // Level 2
                else if (minutes < 90) intensity = 3; // Level 3
                else if (minutes < 120) intensity = 4;// Level 4
                else if (minutes < 150) intensity = 5;// Level 5
                else intensity = 6;                   // Level 6
            }

            yearlyStats.push({
                dateStr,
                date: d,
                minutes: minutes,
                hours: parseFloat((minutes / 60).toFixed(1)),
                intensity: intensity
            });
        }

        // --- 2. Strict Streak Calculation ---
        const allLogs = await ActivityLog.findAll({
            where: { userId: userId },
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('date')), 'formattedDate']
            ],
            group: ['formattedDate'],
            order: [[Sequelize.fn('DATE', Sequelize.col('date')), 'DESC']]
        });

        let streak = 0;
        const uniqueDates = allLogs.map(l => l.get('formattedDate'));

        if (uniqueDates.length > 0) {
            const todayStr = new Date().toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            // Check if user studied Today or Yesterday. If not, streak is broken -> 0.
            if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
                streak = 1;

                // Check backwards for consecutiveness
                // Start comparing from the relevant date (if today present, compare with yesterday, else compare yesterday with day before)
                let currentDate = new Date(uniqueDates[0]);

                for (let i = 1; i < uniqueDates.length; i++) {
                    const prevDate = new Date(currentDate);
                    prevDate.setDate(prevDate.getDate() - 1);
                    const prevDateStr = prevDate.toISOString().split('T')[0];

                    if (uniqueDates[i] === prevDateStr) {
                        streak++;
                        currentDate = new Date(uniqueDates[i]);
                    } else {
                        break; // Gap found
                    }
                }
            }
        }

        // Return response
        // Return response
        res.send({
            yearlyData: yearlyStats,
            streak,
            totalSessions: allLogs.length
        });

    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).send({ message: err.message });
    }
};
