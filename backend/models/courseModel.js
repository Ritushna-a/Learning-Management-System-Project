const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");
const Assignment = require("./assignmentModel");
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

const Lesson = require("./lessonModel");

Course.hasMany(Lesson, {
  foreignKey: "course_id",
  onDelete: "CASCADE",
});

Lesson.belongsTo(Course, {
  foreignKey: "course_id",
});

Course.hasMany(Assignment, { foreignKey: "course_id", onDelete: "CASCADE" });
Assignment.belongsTo(Course, { foreignKey: "course_id" });

module.exports = Course;
