module.exports = (sequelize, Sequelize) => {
    const ActivityLog = sequelize.define("activity_logs", {
        date: {
            type: Sequelize.DATEONLY, // Store YYYY-MM-DD
            allowNull: false
        },
        minutes: {
            type: Sequelize.FLOAT, // Changed to FLOAT to track seconds (e.g. 0.5 mins)
            defaultValue: 0
        },
        topicId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });

    return ActivityLog;
};
