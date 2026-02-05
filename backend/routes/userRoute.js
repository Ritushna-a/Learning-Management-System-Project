const express = require("express").Router();
const authGuard = require("../helpers/authGuard");
const uploadProfileImage = require("../helpers/uploadProfile");

const { registerUser, loginUser, forgotPassword, resetPassword } = require("../controllers/authController");
const { getUserProfile, updateUserProfile, getAllStudents } = require("../controllers/userController");

express.post("/register",registerUser);
express.post("/login",loginUser);
express.post("/forgotpassword", forgotPassword);
express.post("/resetpassword", resetPassword); 

express.get("/profile", authGuard, getUserProfile);
express.put("/profile", authGuard, uploadProfileImage, updateUserProfile);
express.get("/students", authGuard, getAllStudents);
module.exports=express;