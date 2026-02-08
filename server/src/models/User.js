module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING, // "male" or "female"
        },
        dob: {
            type: DataTypes.DATEONLY,
        },
        streak: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        lastActiveDate: {
            type: DataTypes.DATEONLY, // YYYY-MM-DD
        }
    });

    return User;
};
