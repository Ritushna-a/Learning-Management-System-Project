const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");
const User = require("./userModel");
const Assignment = require("./assignmentModel");

const Submission = sequelize.define(
  "Submission",
  {
    submission_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    assignment_id: { type: DataTypes.INTEGER, allowNull: false },
    student_id: { type: DataTypes.INTEGER, allowNull: false }, 
    content: { type: DataTypes.TEXT, allowNull: false },
    grade: { type: DataTypes.STRING, allowNull: true },
    feedback: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "submissions",
    timestamps: true,
  }
);

Submission.belongsTo(User, { foreignKey: "student_id", as: "student" });
Assignment.hasMany(Submission, { foreignKey: "assignment_id", onDelete: "CASCADE" });
Submission.belongsTo(Assignment, { foreignKey: "assignment_id" });

module.exports = Submission;