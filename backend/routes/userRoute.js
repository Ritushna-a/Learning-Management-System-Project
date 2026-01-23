const express = require("express").Router();

const { registerUser, loginUser } = require("../controllers/authController");

express.post("/register",registerUser);
express.post("/login",loginUser);

module.exports=express;