const firebaseService = require('../services/firebaseService');

const patientController = {
  getAll: async (req, res, next) => {
    try {
      const patients = await firebaseService.getPatients();
      res.status(200).json({ success: true, count: patients.length, data: patients });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const patient = await firebaseService.getPatientById(req.params.id);
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient record not found.' });
      }
      res.status(200).json({ success: true, data: patient });
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const patient = await firebaseService.createPatient(req.body);
      
      // Log notification
      await firebaseService.createNotification(
        "New Patient Registered",
        `Patient ${patient.fullName} (${patient.id}) was successfully registered.`,
        "info"
      );

      res.status(201).json({ success: true, data: patient });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await firebaseService.updatePatient(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Patient not found.' });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const success = await firebaseService.deletePatient(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Patient not found.' });
      }
      res.status(200).json({ success: true, message: 'Patient record deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = patientController;
