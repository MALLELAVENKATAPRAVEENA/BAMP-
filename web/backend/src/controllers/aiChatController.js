const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Local Orthodontic clinical Q&A database for offline fallback
const localMedicalAnswers = [
  {
    keywords: ['anchor', 'plate', 'zygomatic', 'mandible', 'screw'],
    answer: "For BAMP, the standard surgical protocol involves placing four miniplates: two in the infrazygomatic crests of the maxilla and two in the anterior mandible between the lateral incisors and canines. They are secured using monocortical bone screws (usually 2mm diameter, 5-7mm length)."
  },
  {
    keywords: ['elastic', 'force', 'wear', 'hour'],
    answer: "Class III elastics should be loaded immediately or 2 weeks post-surgery. Initial force is 150g per side, increasing to 250g after 1 month. Elastics must be worn 24 hours a day, including during sleep, and changed at least twice daily to maintain constant force vectors."
  },
  {
    keywords: ['age', 'optimal', 'puberty', 'years', 'grow'],
    answer: "The optimal age for BAMP treatment is during the late mixed or early permanent dentition stage, typically between 10 to 12 years of age. This window capitalizes on high sutural activity before the fusion of the circummaxillary sutures."
  },
  {
    keywords: ['sna', 'snb', 'anb', 'wits', 'skeletal', 'class iii'],
    answer: "Skeletal Class III malocclusions are defined by a negative ANB angle (ANB < 0°) and a negative Wits appraisal. A decreased SNA angle (< 80°) denotes maxillary retrognathism (maxillary hypoplasia), which is the primary indicator for BAMP protraction."
  },
  {
    keywords: ['relapse', 'risk', 'divergent', 'fma'],
    answer: "Hyperdivergent growth patterns (FMA > 30°) present a higher risk of vertical relapse and downward-backward mandibular rotation. Hypodivergent patterns (FMA < 20°) are highly stable and achieve excellent horizontal skeletal correction."
  },
  {
    keywords: ['duration', 'length', 'time', 'treatment'],
    answer: "Active BAMP protraction generally spans 12 to 18 months, depending on skeletal responsiveness and patient compliance. Retentive elastics are worn for a further 6-12 months, usually night-only, to secure stability during growth."
  }
];

const aiChatController = {
  chat: async (req, res, next) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ success: false, message: 'Message content cannot be blank.' });
      }

      console.log(`[AI CHAT] Processing message: "${message.substring(0, 60)}"`);

      // 1. Check if Gemini API key is configured
      if (GEMINI_API_KEY) {
        try {
          const systemPrompt = "You are BAMP-AI, a professional orthodontic clinical assistant specializing in Bone Anchored Maxillary Protraction (BAMP) treatment evaluations for Class III skeletal malocclusions with maxillary hypoplasia. Keep your answers scientific, helpful, and concise. Format with bullet points if explaining guidelines.";
          
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
          
          const payload = {
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }]
              }
            ]
          };

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await response.json();
          const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (responseText) {
            return res.status(200).json({
              success: true,
              reply: responseText,
              source: 'Gemini Generative API'
            });
          }
        } catch (apiError) {
          console.error('[AI CHAT] Gemini API error, falling back to local database:', apiError.message);
        }
      }

      // 2. Fallback to Local Rule-Based Medical Expert System
      const cleanMsg = message.toLowerCase();
      let matchedAnswer = null;

      for (const item of localMedicalAnswers) {
        const matches = item.keywords.filter(keyword => cleanMsg.includes(keyword));
        if (matches.length > 0) {
          matchedAnswer = item.answer;
          break;
        }
      }

      const defaultReply = "I am BAMP-AI, your clinical assistant. You can ask me details about skeletal anchors placement, elastic force values (150g-250g), optimal treatment ages (10-12 years), SNA/SNB/ANB parameters, or growth divergence risks. For patient-specific evaluations, please complete the Cephalometric Measurements form.";

      res.status(200).json({
        success: true,
        reply: matchedAnswer || defaultReply,
        source: 'Local Medical Expert Rules'
      });

    } catch (err) {
      next(err);
    }
  }
};

module.exports = aiChatController;
