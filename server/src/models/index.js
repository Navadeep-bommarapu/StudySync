const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./User")(sequelize, Sequelize);
db.Course = require("./Course")(sequelize, Sequelize);
db.ActivityLog = require("./ActivityLog")(sequelize, Sequelize);
db.Review = require("./Review")(sequelize, Sequelize);

db.Topic = require("./Topic")(sequelize, Sequelize);
db.Resource = require("./Resource")(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Course, { as: "courses" });
db.Course.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.Course.hasMany(db.Topic, { as: "topics", onDelete: 'CASCADE' });
db.Topic.belongsTo(db.Course, { foreignKey: "courseId", as: "course" });

db.Topic.hasMany(db.Resource, { as: "resources", onDelete: 'CASCADE' });
db.Resource.belongsTo(db.Topic, { foreignKey: "topicId", as: "topic" });

db.User.hasMany(db.ActivityLog, { as: "activities" });
db.ActivityLog.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.Course.hasMany(db.ActivityLog, { as: "activities" });
db.ActivityLog.belongsTo(db.Course, { foreignKey: "courseId", as: "course" });

module.exports = db;
