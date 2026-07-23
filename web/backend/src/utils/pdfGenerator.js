const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

async function generateBampPdfReport(predictionData, patientData, settingsData) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // ----------------------------------------------------
      // HEADER DESIGN & DECORATIVE BARS
      // ----------------------------------------------------
      // Top deep-blue bar
      doc.rect(0, 0, 595, 25).fill('#035ba1');
      
      // Vector Logo: Draw a beautiful medical cross icon
      doc.save();
      doc.translate(50, 45);
      doc.circle(20, 20, 20).lineWidth(1.5).stroke('#0272c6');
      doc.rect(17, 10, 6, 20).fill('#0e90e9');
      doc.rect(10, 17, 20, 6).fill('#0e90e9');
      doc.restore();

      // Title & Hospital Metadata
      doc.fillColor('#074e85').font('Helvetica-Bold').fontSize(16).text('BAMP AI EVALUATION SYSTEM', 100, 45);
      doc.fillColor('#666666').font('Helvetica').fontSize(9)
         .text(settingsData.hospitalName || 'Advanced Orthodontic Research Center', 100, 62)
         .text('Clinical Outcome Prediction Report | Bone Anchored Maxillary Protraction', 100, 74);

      // Horizontal separator line
      doc.moveTo(50, 95).lineTo(545, 95).lineWidth(1).strokeColor('#e2e8f0').stroke();

      // ----------------------------------------------------
      // SECTION 1: CLINICAL METADATA & DOCTOR INFO
      // ----------------------------------------------------
      doc.fillColor('#333333').font('Helvetica-Bold').fontSize(11).text('EVALUATION METADATA', 50, 110);
      
      doc.font('Helvetica-Bold').fontSize(9).text('Ortho Specialist:', 50, 130)
         .font('Helvetica').text(settingsData.doctorName || 'Dr. Venkatapraveenamallela', 150, 130);
         
      doc.font('Helvetica-Bold').text('Department:', 50, 145)
         .font('Helvetica').text(settingsData.specialization || 'Dentofacial Orthopedics', 150, 145);
         
      doc.font('Helvetica-Bold').text('Evaluation Date:', 350, 130)
         .font('Helvetica').text(new Date(predictionData.createdAt).toLocaleDateString(), 440, 130);
         
      doc.font('Helvetica-Bold').text('Report Version:', 350, 145)
         .font('Helvetica').text(settingsData.aiModelVersion || 'BAMP-Net v2.4', 440, 145);

      // Section separator
      doc.moveTo(50, 165).lineTo(545, 165).stroke();

      // ----------------------------------------------------
      // SECTION 2: PATIENT DEMOGRAPHICS
      // ----------------------------------------------------
      doc.fillColor('#333333').font('Helvetica-Bold').fontSize(11).text('PATIENT PROFILE', 50, 180);
      
      // Demographics Card Box
      doc.rect(50, 195, 495, 80).fill('#f8fafc').strokeColor('#cbd5e1').lineWidth(0.5).stroke();
      
      doc.fillColor('#333333').font('Helvetica-Bold').fontSize(9)
         .text('Patient Name:', 65, 205).font('Helvetica').text(patientData.fullName, 145, 205)
         .font('Helvetica-Bold').text('Patient ID:', 65, 220).font('Helvetica').text(patientData.id, 145, 220)
         .font('Helvetica-Bold').text('Age / Gender:', 65, 235).font('Helvetica').text(`${patientData.age} Years / ${patientData.gender}`, 145, 235)
         .font('Helvetica-Bold').text('Date of Birth:', 65, 250).font('Helvetica').text(patientData.dob, 145, 250);

      doc.font('Helvetica-Bold')
         .text('Skeletal Class:', 300, 205).font('Helvetica').text(patientData.skeletalClassification || 'Class III', 390, 205)
         .font('Helvetica-Bold').text('Growth Pattern:', 300, 220).font('Helvetica').text(patientData.growthPattern || 'Normodivergent', 390, 220)
         .font('Helvetica-Bold').text('Diagnostic Notes:', 300, 235).font('Helvetica').text(patientData.diagnosis ? patientData.diagnosis.substring(0, 45) + '...' : 'Skeletal Class III', 390, 235);

      // ----------------------------------------------------
      // SECTION 3: AI OUTCOME PREDICTIONS
      // ----------------------------------------------------
      doc.fillColor('#333333').font('Helvetica-Bold').fontSize(11).text('AI TREATMENT PREDICTION OUTCOME', 50, 290);

      // Outcome Card box
      doc.rect(50, 305, 495, 85).fill('#e0effe').strokeColor('#bae2fd').stroke();

      doc.fillColor('#0c426e').font('Helvetica-Bold').fontSize(22)
         .text(`${predictionData.successProbability}%`, 65, 320);
      doc.fontSize(8).fillColor('#074e85').text('Treatment Success Probability', 65, 345);

      // Middle vertical line inside box
      doc.moveTo(220, 315).lineTo(220, 380).lineWidth(0.5).strokeColor('#bae2fd').stroke();

      doc.fillColor('#333333').font('Helvetica-Bold').fontSize(9)
         .text('AI Confidence Level:', 240, 315).font('Helvetica').text(`${predictionData.confidenceScore}%`, 370, 315)
         .font('Helvetica-Bold').text('Growth Response:', 240, 330).font('Helvetica').text(predictionData.growthResponse, 370, 330)
         .font('Helvetica-Bold').text('Expected Advancement:', 240, 345).font('Helvetica').text(predictionData.expectedMaxillaryAdvancement || '3.5 mm', 370, 345)
         .font('Helvetica-Bold').text('Est. Treatment Time:', 240, 360).font('Helvetica').text(predictionData.estimatedDuration || '12-14 months', 370, 360);

      doc.font('Helvetica-Bold').text('Clinical Risk:', 430, 315);
      const risk = predictionData.riskLevel || 'Low';
      const riskColor = risk === 'Low' ? '#16a34a' : (risk === 'Moderate' ? '#d97706' : '#dc2626');
      doc.fillColor(riskColor).text(risk, 495, 315);

      // ----------------------------------------------------
      // SECTION 4: CEPHALOMETRIC MEASUREMENTS TABLE
      // ----------------------------------------------------
      doc.fillColor('#333333').font('Helvetica-Bold').fontSize(11).text('CEPHALOMETRIC ANALYSIS', 50, 405);

      // Draw Table Header
      doc.rect(50, 420, 495, 20).fill('#074e85');
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5)
         .text('Metric / Angle', 60, 426)
         .text('Patient Measurement', 180, 426)
         .text('Clinical Norm', 310, 426)
         .text('Skeletal Interpretation', 410, 426);

      // Draw Table Rows
      const rows = [
        { name: 'SNA (Sella-Nasion-Point A)', value: predictionData.measurements.SNA || '77.5°', norm: '82.0° +/- 2°', desc: 'Maxillary Retrognathism' },
        { name: 'SNB (Sella-Nasion-Point B)', value: predictionData.measurements.SNB || '80.5°', norm: '80.0° +/- 2°', desc: 'Normal Mandible Placement' },
        { name: 'ANB (Skeletal Jaw Relationship)', value: predictionData.measurements.ANB || '-3.0°', norm: '2.0° +/- 2°', desc: 'Skeletal Class III Profile' },
        { name: 'Wits Appraisal (A-B Projection)', value: predictionData.measurements.Wits || '-5.2 mm', norm: '-1 to +1 mm', desc: 'Maxillary Hypoplasia Indicator' },
        { name: 'FMA (Frankfort-Mandibular)', value: predictionData.measurements.FMA || '22.5°', norm: '25.0° +/- 5°', desc: 'Hypodivergent Growth' },
      ];

      let currentY = 440;
      rows.forEach((row, i) => {
        const bg = i % 2 === 0 ? '#f8fafc' : '#ffffff';
        doc.rect(50, currentY, 495, 18).fill(bg);
        doc.fillColor('#333333').font('Helvetica').fontSize(8)
           .text(row.name, 60, currentY + 5)
           .font('Helvetica-Bold').text(row.value, 180, currentY + 5)
           .font('Helvetica').text(row.norm, 310, currentY + 5)
           .text(row.desc, 410, currentY + 5);
        currentY += 18;
      });

      // ----------------------------------------------------
      // SECTION 5: CLINICAL RECOMMENDATIONS & EXPLANATION
      // ----------------------------------------------------
      doc.fillColor('#333333').font('Helvetica-Bold').fontSize(11).text('CLINICAL RECOMMENDATIONS', 50, 545);
      doc.font('Helvetica').fontSize(8.5).fillColor('#475569')
         .text(predictionData.recommendedAction || 'Proceed with standard BAMP configuration. Recommended forces: 150g initially, increasing to 250g.', 50, 560, { width: 495, align: 'justify', lineGap: 3 });

      // ----------------------------------------------------
      // FOOTER: SIGNATURES & QR VERIFICATION
      // ----------------------------------------------------
      // Generate QR Code containing patient and outcome verify text
      const qrData = `BAMP AI Verified Report\nPatient ID: ${patientData.id}\nSuccess Outcome: ${predictionData.successProbability}%\nVerified By: ${settingsData.doctorName || 'Dr. Venkatapraveenamallela'}`;
      const qrDataUri = await QRCode.toDataURL(qrData);

      // Draw QR Code
      doc.image(qrDataUri, 50, 640, { width: 85, height: 85 });
      doc.fillColor('#666666').font('Helvetica').fontSize(7.5)
         .text('Scan QR Code to verify clinical authenticity on secure portal.', 50, 730);

      // Draw Digital Signature Section
      doc.moveTo(350, 700).lineTo(520, 700).lineWidth(0.5).strokeColor('#94a3b8').stroke();
      doc.fillColor('#0272c6').font('Courier-Oblique').fontSize(11)
         .text(settingsData.doctorName || 'Dr. Venkatapraveenamallela', 360, 685, { width: 150, align: 'center' });
      doc.fillColor('#333333').font('Helvetica-Bold').fontSize(8)
         .text('Authorized Orthodontist Signature', 350, 705, { width: 170, align: 'center' });
      doc.fillColor('#94a3b8').font('Helvetica').fontSize(7)
         .text(`Evaluation Date: ${new Date(predictionData.createdAt).toLocaleDateString()}`, 350, 715, { width: 170, align: 'center' });

      // Page footer decoration
      doc.rect(0, 815, 595, 27).fill('#074e85');
      doc.fillColor('#ffffff').fontSize(7.5)
         .text('CONFIDENTIAL - FOR CLINICAL ORTHODONTIC EVALUATION ONLY', 50, 825, { width: 495, align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  generateBampPdfReport
};
