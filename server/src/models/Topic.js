module.exports = (sequelize, Sequelize) => {
    const Topic = sequelize.define("topics", {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isCompleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        targetMinutes: {
            type: Sequelize.INTEGER,
            defaultValue: 30 // Default 30 mins if not specified
        },
        studiedMinutes: {
            type: Sequelize.FLOAT, // Changed to FLOAT to track seconds
            defaultValue: 0
        }
    });

    return Topic;
};
