const Notification = require('../models/Notification');

// Create Notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, role, message } = req.body;
    const notification = await Notification.create({ userId, role, message });
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find({ role: 'admin', isRead: false })
        .sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications", error });
    }
  };
  

// Get All Notifications for User (by role and userId)
exports.getNotifications = async (req, res) => {
  try {
    const { userId, role } = req.params;
    const notifications = await Notification.find({ userId, role }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark Notification as Read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ success: true, message: "Notification deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
