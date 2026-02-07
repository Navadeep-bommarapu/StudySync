module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("reviews", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        rating: {
            type: Sequelize.INTEGER,
            validate: { min: 1, max: 5 }
        },
        comment: {
            type: Sequelize.TEXT
        }
    });

    return Review;
};
