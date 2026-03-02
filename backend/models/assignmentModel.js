const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");

const Assignment = sequelize.define("Assignment", {
    assignment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true, 
    },
    course_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    }
}, {
    tableName: "assignments",
    timestamps: true,
});

module.exports = Assignment;