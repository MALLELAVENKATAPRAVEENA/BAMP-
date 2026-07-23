const firebaseService = require('../services/firebaseService');
const { generateBampPdfReport } = require('../utils/pdfGenerator');

const reportController = {
  generateReport: async (req, res, next) => {
    try {
      const { predictionId } = req.query;

      if (!predictionId) {
        return res.status(400).json({ success: false, message: 'Please specify the target prediction report ID.' });
      }

      // Fetch prediction details
      const prediction = await firebaseService.getPredictionById(predictionId);
      if (!prediction) {
        return res.status(404).json({ success: false, message: 'AI prediction record not found.' });
      }

      // Fetch patient details
      const patient = await firebaseService.getPatientById(prediction.patientId);
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient record linked to this prediction is missing.' });
      }

      // Fetch settings/doctor details
      const settings = await firebaseService.getSettings();

      console.log(`[REPORTS API] Generating PDF for Patient: ${patient.fullName}, Report: ${predictionId}`);

      // Call PDF Generator
      const pdfBuffer = await generateBampPdfReport(prediction, patient, settings);

      // Set headers for download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=BAMP_Report_${patient.id}_${predictionId}.pdf`);
      res.setHeader('Content-Length', pdfBuffer.length);

      // Send PDF buffer
      res.end(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = reportController;
