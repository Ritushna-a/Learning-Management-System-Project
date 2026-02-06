const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");

const Course = sequelize.define(
  "Course",
  {
    course_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instructor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);

module.exports = Course;
