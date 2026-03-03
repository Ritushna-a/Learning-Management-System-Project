const express = require("express").Router();

const { getMyNotifications, markAsRead, markAllAsRead } = require("../controllers/notificationController");

const authGuard = require("../helpers/authGuard"); 

express.get("/", authGuard, getMyNotifications);
express.put("/read/:id", authGuard, markAsRead);
express.put("/read-all", authGuard, markAllAsRead);

module.exports = express;
