const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const getUserProfile = async (req, res) => {
  try {
    res.json({
      username: req.user.username,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      address: req.user.address,
      role: req.user.role,
      profilePicture: req.user.profilePicture,
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;

    const { username, phoneNumber, address } = req.body;

    if (username) user.username = username;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (req.file) user.profilePicture = `/uploads/profile/${req.file.filename}`;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllStudents = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await User.findAll({ where: { role: "student" } });
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

module.exports = { getUserProfile, updateUserProfile, getAllStudents };