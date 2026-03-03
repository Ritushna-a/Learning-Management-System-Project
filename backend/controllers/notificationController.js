const Notification = require("../models/notificationModel");

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: req.user.user_id },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        await Notification.update({ is_read: true }, {
            where: { notification_id: req.params.id, user_id: req.user.user_id }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.update({ is_read: true }, {
            where: { user_id: req.user.user_id, is_read: false }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

module.exports = { 
    getMyNotifications, 
    markAsRead, 
    markAllAsRead 
};