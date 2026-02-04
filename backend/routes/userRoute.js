const express = require("express").Router();

const { registerUser, loginUser, forgotPassword, resetPassword } = require("../controllers/authController");

express.post("/register",registerUser);
express.post("/login",loginUser);
express.post("/forgotpassword", forgotPassword);
express.post("/resetpassword", resetPassword); 

module.exports=express;