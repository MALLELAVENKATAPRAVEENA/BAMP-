// Clinical Recommendation Engine Module
const recommendationEngine = {
  getRecommendation: async (patientInfo, prediction) => {
    console.log('[AI PIPELINE] Generating Clinical Insights & Recommendations...');

    const prob = prediction.successProbability;
    const age = parseInt(patientInfo.age);
    const growth = patientInfo.growthPattern || "Normodivergent";
    
    let recommendation = "";
    let riskAnalysis = "";

    if (prob >= 80) {
      recommendation = "Excellent candidate for Bone Anchored Maxillary Protraction (BAMP). Proceed with anchor placement: place two miniplates in the infrazygomatic crests of the maxilla and two in the anterior mandible between the lateral incisors and canines. Load immediately with Class III elastics (150g per side, increasing to 250g). Monitoring every 4-6 weeks is advised.";
      riskAnalysis = "Low risk of growth relapse. Excellent skeletal growth potential. Minimal dental tipping is expected due to direct skeletal anchorage.";
    } else if (prob >= 65) {
      recommendation = "Favorable candidate for BAMP. Place skeletal miniplates in the maxilla and mandible. Consider a 1-month delayed loading protocol to ensure osseointegration if bone density is low on CBCT. Standard Class III elastics. Monitor patient compliance closely as elastics must be worn 24 hours/day.";
      riskAnalysis = "Moderate risk. Relapse potential exists if elastic compliance is less than 18 hours/day. Slight vertical rotation of the mandible may occur if growth pattern shifts vertically.";
    } else {
      recommendation = "Guarded prognosis for isolated BAMP. High vertical growth pattern or late chronological age suggests reduced sutural responsiveness. Consider combining BAMP with a hybrid hyrax/rapid maxillary expansion (RME) device for sutural disruption. Inform parents that orthognathic surgery (Le Fort I osteotomy) may be required post-growth (age 18+).";
      riskAnalysis = "High risk. High skeletal divergence may lead to undesirable vertical facial height increase. Relapse rate of up to 45% post-retention if vertical vector is unmanaged.";
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          recommendedAction: recommendation,
          riskAnalysis: riskAnalysis,
          clinicalGuidelines: [
            "Verify miniplate stability 2 weeks post-surgery prior to heavy force loading.",
            "Verify patient changes elastics at least twice daily to maintain constant force vectors.",
            "Obtain secondary progress cephalogram at 6 months to quantify maxillary advancement."
          ],
          status: "Insights Generated"
        });
      }, 300);
    });
  }
};

module.exports = recommendationEngine;
