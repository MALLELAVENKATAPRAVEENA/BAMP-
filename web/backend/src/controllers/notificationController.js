const firebaseService = require('../services/firebaseService');

const notificationController = {
  getAll: async (req, res, next) => {
    try {
      const list = await firebaseService.getNotifications();
      res.status(200).json({ success: true, count: list.length, data: list });
    } catch (err) {
      next(err);
    }
  },

  markAsRead: async (req, res, next) => {
    try {
      const { id } = req.params;
      const success = await firebaseService.markNotificationAsRead(id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Notification not found.' });
      }
      res.status(200).json({ success: true, message: 'Notification marked as read.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = notificationController;
