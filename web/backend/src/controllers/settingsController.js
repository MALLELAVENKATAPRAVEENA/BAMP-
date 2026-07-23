const firebaseService = require('../services/firebaseService');

const settingsController = {
  getSettings: async (req, res, next) => {
    try {
      const settings = await firebaseService.getSettings();
      res.status(200).json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  },

  updateSettings: async (req, res, next) => {
    try {
      const updated = await firebaseService.updateSettings(req.body);
      
      await firebaseService.createNotification(
        "Settings Updated",
        "Clinical profiles and configurations were successfully updated.",
        "info"
      );

      res.status(200).json({ success: true, message: 'Settings updated successfully.', data: updated });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = settingsController;
