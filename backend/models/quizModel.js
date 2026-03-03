const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");
const Course = require("./courseModel");

const Quiz = sequelize.define(
  "Quiz",
  {
    quiz_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    questions: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: "quizzes",
    timestamps: true,
  }
);

Course.hasMany(Quiz, { foreignKey: "course_id", onDelete: "CASCADE" });
Quiz.belongsTo(Course, { foreignKey: "course_id" });

module.exports = Quiz;
