const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");

const Lesson = sequelize.define(
  "Lesson",
  {
    lesson_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "lessons",
    timestamps: true,
  }
);

module.exports = Lesson;