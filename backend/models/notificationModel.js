const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database"); 

const Notification = sequelize.define("Notification", {
    notification_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT, 
        allowNull: false,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'course',
    }
}, {
    tableName: "notifications",
    timestamps: true,
});

module.exports = Notification;