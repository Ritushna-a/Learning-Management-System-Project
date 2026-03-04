const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/Database");
const User = require("./userModel");
const Course = require("./courseModel");

const Enrollment = sequelize.define(
  "Enrollment",
  {
    enrollment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "course_enrollments",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["course_id", "student_id"],
      },
    ],
  }
);

Course.hasMany(Enrollment, { foreignKey: "course_id", onDelete: "CASCADE" });
Enrollment.belongsTo(Course, { foreignKey: "course_id" });

User.hasMany(Enrollment, { foreignKey: "student_id", onDelete: "CASCADE" });
Enrollment.belongsTo(User, { foreignKey: "student_id", as: "student" });

module.exports = Enrollment;
