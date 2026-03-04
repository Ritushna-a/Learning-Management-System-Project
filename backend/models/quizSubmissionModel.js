const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");
const User = require("./userModel");
const Quiz = require("./quizModel");

const QuizSubmission = sequelize.define(
  "QuizSubmission",
  {
    quiz_submission_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answers: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "quiz_submissions",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["quiz_id", "student_id"],
      },
    ],
  }
);

Quiz.hasMany(QuizSubmission, { foreignKey: "quiz_id", onDelete: "CASCADE" });
QuizSubmission.belongsTo(Quiz, { foreignKey: "quiz_id" });

User.hasMany(QuizSubmission, { foreignKey: "student_id", onDelete: "CASCADE" });
QuizSubmission.belongsTo(User, { foreignKey: "student_id", as: "student" });

module.exports = QuizSubmission;
