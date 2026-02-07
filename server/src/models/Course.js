module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define("courses", {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        targetHours: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        studiedHours: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        color: {
            type: Sequelize.STRING,
            defaultValue: "bg-orange-100" // Default UI color
        },
        dueDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        }
    });

    return Course;
};
