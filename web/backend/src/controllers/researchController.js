const firebaseService = require('../services/firebaseService');

const researchController = {
  exportCsv: async (req, res, next) => {
    try {
      const patients = await firebaseService.getPatients();
      const predictions = await firebaseService.getPredictions();

      // Create CSV Headers
      let csvContent = "Patient ID,Full Name,Age,Gender,Skeletal Class,Growth Pattern,SNA,SNB,ANB,FMA,Success Probability (%),Confidence Score (%),Date Evaluated\n";

      // Join patients and predictions
      patients.forEach(patient => {
        // Find corresponding predictions
        const matchedPreds = predictions.filter(pred => pred.patientId === patient.id);
        
        if (matchedPreds.length > 0) {
          matchedPreds.forEach(pred => {
            const snaVal = pred.measurements?.SNA || 'N/A';
            const snbVal = pred.measurements?.SNB || 'N/A';
            const anbVal = pred.measurements?.ANB || 'N/A';
            const fmaVal = pred.measurements?.FMA || 'N/A';

            csvContent += `"${patient.id}","${patient.fullName}",${patient.age},"${patient.gender}","${patient.skeletalClassification || 'Class III'}","${patient.growthPattern || 'Normodivergent'}",${parseFloat(snaVal)},${parseFloat(snbVal)},${parseFloat(anbVal)},${parseFloat(fmaVal)},${pred.successProbability},${pred.confidenceScore},"${new Date(pred.createdAt).toLocaleDateString()}"\n`;
          });
        } else {
          // Patient exists but has no prediction runs yet
          csvContent += `"${patient.id}","${patient.fullName}",${patient.age},"${patient.gender}","${patient.skeletalClassification || 'Class III'}","${patient.growthPattern || 'Normodivergent'}",N/A,N/A,N/A,N/A,N/A,N/A,"${new Date(patient.createdAt).toLocaleDateString()}"\n`;
        }
      });

      console.log(`[RESEARCH PORTAL] Exported CSV database containing ${patients.length} patient records.`);

      // Send CSV headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=BAMP_Clinical_Research_Database.csv');
      res.status(200).send(csvContent);

    } catch (err) {
      next(err);
    }
  }
};

module.exports = researchController;
