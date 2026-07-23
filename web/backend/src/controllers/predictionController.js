const path = require('path');
const preprocessing = require('../ai/preprocessing');
const landmarkDetector = require('../ai/landmarkDetector');
const featureExtractor = require('../ai/featureExtractor');
const cephalometricAnalyzer = require('../ai/cephalometricAnalyzer');
const predictionModel = require('../ai/predictionModel');
const recommendationEngine = require('../ai/recommendationEngine');
const firebaseService = require('../services/firebaseService');

const predictionController = {
  // Main API to process uploaded scan and run the entire AI Pipeline
  analyze: async (req, res, next) => {
    try {
      const { patientId, scanType } = req.body;
      let scanFile = req.file;

      if (!patientId) {
        return res.status(400).json({ success: false, message: 'Please specify the Patient ID.' });
      }

      const patient = await firebaseService.getPatientById(patientId);
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Target patient record not found.' });
      }

      // If no file was uploaded, we can simulate using a default orthodontic scan
      let imagePath = scanFile ? scanFile.path : 'uploads/demo_cephalogram.jpg';
      let imageName = scanFile ? scanFile.filename : 'demo_cephalogram.jpg';

      console.log(`[AI CONTROLLER] Starting evaluation for patient: ${patient.fullName} (${patient.id})`);

      // 1. Image Preprocessing
      const preprocessed = await preprocessing.enhance(imagePath);

      // 2. Landmark Detection
      const detection = await landmarkDetector.detectLandmarks(imagePath);

      // 3. Feature Extraction
      const features = await featureExtractor.extractFeatures(detection.landmarks);

      // 4. Cephalometric Analysis
      const analysis = await cephalometricAnalyzer.analyze(detection.landmarks);

      // 5. Prediction model success outcome
      const prediction = await predictionModel.predictOutcome(patient, analysis);

      // 6. Clinical Recommendation
      const clinical = await recommendationEngine.getRecommendation(patient, prediction);

      // Merge results
      const fullOutcome = {
        patientId,
        patientName: patient.fullName,
        scanType: scanType || 'Lateral Cephalogram',
        scanUrl: `/uploads/${imageName}`,
        qualityScore: preprocessed.qualityScore,
        landmarks: detection.landmarks,
        features: features.features,
        measurements: Object.keys(analysis.measurements).reduce((acc, key) => {
          acc[key] = analysis.measurements[key].value;
          return acc;
        }, {}),
        successProbability: prediction.successProbability,
        confidenceScore: prediction.confidenceScore,
        riskLevel: prediction.riskLevel,
        growthResponse: prediction.growthResponse,
        estimatedDuration: prediction.estimatedDuration,
        expectedMaxillaryAdvancement: prediction.expectedMaxillaryAdvancement,
        expectedSkeletalImprovement: prediction.expectedSkeletalImprovement,
        recommendedAction: clinical.recommendedAction,
        riskAnalysis: clinical.riskAnalysis,
        clinicalGuidelines: clinical.clinicalGuidelines,
        explanation: `High confidence analysis based on ${analysis.skeletalClassification} pattern and ${analysis.growthPattern} growth vectors.`
      };

      // Save predictions to database
      const savedPrediction = await firebaseService.createPrediction(fullOutcome);

      // Create notification
      await firebaseService.createNotification(
        "AI Prediction Completed",
        `Successful BAMP prediction computed for ${patient.fullName} (Probability: ${prediction.successProbability}%).`,
        "success"
      );

      res.status(200).json({
        success: true,
        message: 'AI image analysis pipeline executed successfully.',
        data: savedPrediction
      });
    } catch (err) {
      next(err);
    }
  },

  // Manual values input to run the AI Model directly without an image
  predict: async (req, res, next) => {
    try {
      const { 
        patientId, SNA, SNB, FMA, 
        Overjet, Overbite, FacialConvexity, 
        MaxillaryLength, MandibularLength, SNGoGn, 
        GrowthStage, TreatmentDuration 
      } = req.body;

      if (!patientId) {
        return res.status(400).json({ success: false, message: 'Please specify the Patient ID.' });
      }

      const patient = await firebaseService.getPatientById(patientId);
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found.' });
      }

      // Convert inputs to numbers
      const snaNum = parseFloat(SNA) || 82.0;
      const snbNum = parseFloat(SNB) || 80.0;
      const anbNum = parseFloat((snaNum - snbNum).toFixed(1));
      const fmaNum = parseFloat(FMA) || 25.0;

      // Mock structures to match the pipeline output
      const mockMeasurements = {
        growthPattern: fmaNum < 20 ? "Hypodivergent" : (fmaNum > 30 ? "Hyperdivergent" : "Normodivergent"),
        measurements: {
          ANB: { value: anbNum }
        }
      };

      const prediction = await predictionModel.predictOutcome(patient, mockMeasurements);
      const clinical = await recommendationEngine.getRecommendation(patient, prediction);

      const savedPrediction = await firebaseService.createPrediction({
        patientId,
        patientName: patient.fullName,
        scanType: 'Manual Cephalometric Input',
        scanUrl: null,
        qualityScore: 100,
        landmarks: null,
        features: null,
        measurements: { 
          SNA: `${snaNum}°`, 
          SNB: `${snbNum}°`, 
          ANB: `${anbNum}°`, 
          FMA: `${fmaNum}°`,
          Overjet: Overjet ? `${Overjet} mm` : `${(anbNum * 0.8 + 0.5).toFixed(1)} mm`,
          Overbite: Overbite ? `${Overbite} mm` : "1.2 mm",
          FacialConvexity: FacialConvexity ? `${FacialConvexity}°` : `${(anbNum * 1.1 + 10.2).toFixed(1)}°`,
          MaxillaryLength: MaxillaryLength ? `${MaxillaryLength} mm` : "45.5 mm",
          MandibularLength: MandibularLength ? `${MandibularLength} mm` : "71.2 mm",
          SNGoGn: SNGoGn ? `${SNGoGn}°` : `${fmaNum}°`,
          GrowthStage: GrowthStage || "CS3 (Peak Growth)",
          TreatmentDuration: TreatmentDuration ? `${TreatmentDuration} months` : prediction.estimatedDuration
        },
        successProbability: prediction.successProbability,
        confidenceScore: prediction.confidenceScore,
        riskLevel: prediction.riskLevel,
        growthResponse: prediction.growthResponse,
        estimatedDuration: TreatmentDuration ? `${TreatmentDuration} months` : prediction.estimatedDuration,
        expectedMaxillaryAdvancement: prediction.expectedMaxillaryAdvancement,
        expectedSkeletalImprovement: prediction.expectedSkeletalImprovement,
        recommendedAction: clinical.recommendedAction,
        riskAnalysis: clinical.riskAnalysis,
        clinicalGuidelines: clinical.clinicalGuidelines,
        explanation: `Outcome computed using manual parameters. Growth Stage evaluated: ${GrowthStage || 'Peak'}.`
      });

      res.status(200).json({
        success: true,
        message: 'Prediction computed from manual parameters.',
        data: savedPrediction
      });
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const list = await firebaseService.getPredictions();
      res.status(200).json({ success: true, count: list.length, data: list });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const item = await firebaseService.getPredictionById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Prediction report not found.' });
      }
      res.status(200).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = predictionController;
