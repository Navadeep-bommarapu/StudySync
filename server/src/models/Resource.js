module.exports = (sequelize, Sequelize) => {
    const Resource = sequelize.define("resources", {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.ENUM('video', 'article', 'link', 'other'),
            defaultValue: 'link'
        }
    });

    return Resource;
};
