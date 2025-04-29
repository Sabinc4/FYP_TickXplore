const express = require('express');
const { 
  createNotification, 
  getNotifications, 
  markAsRead, 
  deleteNotification, 
  getAdminNotifications
} = require('../controllers/notificationController');

const router = express.Router();

// Create Notification
router.post('/', createNotification);

// Get All Notifications (userId and role from params)
router.get('/:role/:userId', getNotifications);

// Admin notifications route
router.get('/notifications/admin', getAdminNotifications);

// Mark Notification as Read
router.put('/:notificationId/read', markAsRead);

// Delete Notification
router.delete('/:notificationId', deleteNotification);

module.exports = router;
