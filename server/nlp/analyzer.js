// JanMitra Multilingual NLP & Uncertainty Handling Engine
// Supports English, Hindi, Hinglish, Awadhi, Bhojpuri nuances

export const UP_DISTRICTS = [
  'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh',
  'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti',
  'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
  'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad',
  'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun',
  'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi',
  'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura',
  'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
  'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur',
  'Shamli', 'Shrawasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
];

export async function analyzeSituationWithUncertainty(query, language = 'en') {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Valid query string is required');
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const prompt = `You are the JanMitra Civic Intelligence Engine for Uttar Pradesh, India.
Analyze the citizen input and return structured demographic parameters, along with strict uncertainty handling.

Citizen query: "${query}"

Guidelines:
1. Extract age (number between 0 and 120, or null).
2. Extract district (match one of 75 UP districts if mentioned, or null).
3. Extract annualIncome (number in INR, or null).
4. Extract socialCategory ("General" | "OBC" | "SC" | "ST" | "EWS" | null).
5. Extract occupation ("Student" | "Farmer" | "Laborer" | "Senior Citizen" | "Homemaker" | "Unemployed" | "Artisan" | null).
6. Calculate confidenceScore (0.0 to 1.0).
7. List uncertaintyFlags (e.g., "MISSING_AGE", "MISSING_DISTRICT", "UNCLEAR_INCOME_TYPE", "UNSPECIFIED_CATEGORY").
8. List 1-3 targeted clarifyingQuestions in English and Hindi to resolve missing attributes.
9. Summarize situation in 1 clear sentence.

Return ONLY pure valid JSON in this schema:
{
  "profile": {
    "age": number | null,
    "district": string | null,
    "state": "Uttar Pradesh",
    "occupation": string | null,
    "education": string | null,
    "annualIncome": number | null,
    "category": string | null,
    "goal": string | null,
    "summary": string
  },
  "uncertainty": {
    "confidenceScore": number,
    "ambiguityLevel": "Low" | "Medium" | "High",
    "flags": string[],
    "clarifyingQuestions": string[]
  }
}`;

      const aiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );

      if (aiResponse.ok) {
        const data = await aiResponse.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const result = JSON.parse(jsonText);
          return {
            success: true,
            engine: 'gemini-ai',
            ...result
          };
        }
      }
    } catch (err) {
      console.warn('Gemini NLP fallback triggered:', err.message);
    }
  }

  // Deterministic Multilingual Rule Engine with Uncertainty & Ambiguity Scoring
  return executeDeterministicNLP(query);
}

function executeDeterministicNLP(query) {
  const lower = query.toLowerCase();
  const profile = {
    age: null,
    district: null,
    state: 'Uttar Pradesh',
    occupation: null,
    education: null,
    annualIncome: null,
    category: null,
    goal: null,
    summary: ''
  };

  const uncertaintyFlags = [];
  const clarifyingQuestions = [];
  let confidenceWeight = 1.0;

  // 1. Age extraction with validation (0 - 120)
  const ageMatch = lower.match(/(\d{1,2})\s*(?:years?|yr|yrs|वर्ष|साल|उम्र)/);
  if (ageMatch) {
    const parsedAge = parseInt(ageMatch[1], 10);
    if (parsedAge >= 0 && parsedAge <= 120) {
      profile.age = parsedAge;
    }
  } else {
    uncertaintyFlags.push('MISSING_AGE');
    clarifyingQuestions.push('What is your exact age? / आपकी वर्तमान आयु क्या है?');
    confidenceWeight -= 0.15;
  }

  // 2. District extraction (matching 75 UP districts + regional aliases)
  const districtAliasMap = {
    'lucknow': 'Lucknow', 'लखनऊ': 'Lucknow',
    'varanasi': 'Varanasi', 'वाराणसी': 'Varanasi', 'बनारस': 'Varanasi', 'kashi': 'Varanasi',
    'kanpur': 'Kanpur Nagar', 'कानपुर': 'Kanpur Nagar',
    'barabanki': 'Barabanki', 'बाराबंकी': 'Barabanki',
    'gorakhpur': 'Gorakhpur', 'गोरखपुर': 'Gorakhpur',
    'prayagraj': 'Prayagraj', 'allahabad': 'Prayagraj', 'इलाहाबाद': 'Prayagraj', 'प्रयागराज': 'Prayagraj',
    'ayodhya': 'Ayodhya', 'faizabad': 'Ayodhya', 'अयोध्या': 'Ayodhya',
    'agra': 'Agra', 'आगरा': 'Agra',
    'bareilly': 'Bareilly', 'बरेली': 'Bareilly',
    'aligarh': 'Aligarh', 'अलीगढ़': 'Aligarh',
    'jhansi': 'Jhansi', 'झांसी': 'Jhansi',
    'meerut': 'Meerut', 'मेरठ': 'Meerut',
    'noida': 'Gautam Buddha Nagar', 'greater noida': 'Gautam Buddha Nagar'
  };

  for (const [alias, distName] of Object.entries(districtAliasMap)) {
    if (lower.includes(alias)) {
      profile.district = distName;
      break;
    }
  }

  // Check against full list if not found
  if (!profile.district) {
    for (const d of UP_DISTRICTS) {
      if (lower.includes(d.toLowerCase())) {
        profile.district = d;
        break;
      }
    }
  }

  if (!profile.district) {
    uncertaintyFlags.push('MISSING_DISTRICT');
    clarifyingQuestions.push('Which district in Uttar Pradesh do you belong to? / आप उत्तर प्रदेश के किस जिले से हैं?');
    confidenceWeight -= 0.2;
  }

  // 3. Social Category extraction
  if (lower.includes('obc') || lower.includes('ओबीसी') || lower.includes('पिछड़ा') || lower.includes('अन्य पिछड़ा')) {
    profile.category = 'OBC';
  } else if (lower.includes('sc') || lower.includes('अनुसूचित जाति') || lower.includes('दलित')) {
    profile.category = 'SC';
  } else if (lower.includes('st') || lower.includes('अनुसूचित जनजाति') || lower.includes('आदिवासी')) {
    profile.category = 'ST';
  } else if (lower.includes('ews') || lower.includes('ईडब्ल्यूएस') || lower.includes('सामान्य निर्धन')) {
    profile.category = 'EWS';
  } else if (lower.includes('general') || lower.includes('सामान्य')) {
    profile.category = 'General';
  } else {
    uncertaintyFlags.push('UNSPECIFIED_CATEGORY');
    confidenceWeight -= 0.1;
  }

  // 4. Annual Income extraction & validation
  const incomeRegex = /(?:rs\.?|₹|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख|l)/;
  const lakhMatch = lower.match(incomeRegex);
  if (lakhMatch) {
    profile.annualIncome = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else if (lower.includes('ढाई लाख') || lower.includes('2.5 lakh')) {
    profile.annualIncome = 250000;
  } else if (lower.includes('एक लाख') || lower.includes('1 lakh')) {
    profile.annualIncome = 100000;
  } else {
    const rawNumberMatch = lower.match(/(?:income|aay|आय|कमाई).*?(\d{5,7})/);
    if (rawNumberMatch) {
      profile.annualIncome = parseInt(rawNumberMatch[1], 10);
    }
  }

  if (!profile.annualIncome) {
    uncertaintyFlags.push('UNCERTAIN_ANNUAL_INCOME');
    clarifyingQuestions.push('What is your estimated total family annual income? / आपके परिवार की कुल वार्षिक आय कितनी है?');
    confidenceWeight -= 0.2;
  }

  // 5. Occupation & Education (including Awadhi/Bhojpuri terms)
  if (lower.includes('student') || lower.includes('छात्र') || lower.includes('लइका') || lower.includes('b.tech') || lower.includes('college') || lower.includes('पढ़ाई') || lower.includes('डिग्री')) {
    profile.occupation = 'Student';
    profile.education = 'Higher Education / College';
    profile.goal = 'Scholarship & Fee Reimbursement';
  } else if (lower.includes('farmer') || lower.includes('किसान') || lower.includes('खेती') || lower.includes('खेत') || lower.includes('agriculture') || lower.includes('फसल')) {
    profile.occupation = 'Farmer';
    profile.goal = 'Agricultural Subsidies & PM-KISAN';
  } else if (lower.includes('senior citizen') || lower.includes('old age') || lower.includes('वृद्ध') || lower.includes('पेंशन') || lower.includes('बुजुर्ग')) {
    profile.occupation = 'Senior Citizen';
    profile.goal = 'Old Age Pension Scheme';
  } else if (lower.includes('labor') || lower.includes('labour') || lower.includes('मजदूर') || lower.includes('मजदूरी') || lower.includes('shramik') || lower.includes('श्रमिक')) {
    profile.occupation = 'Laborer / Construction Worker';
    profile.goal = 'BOCW Welfare Board Benefits';
  }

  // Compute final confidence & ambiguity
  const finalConfidence = Math.max(0.4, Math.min(0.98, parseFloat(confidenceWeight.toFixed(2))));
  const ambiguityLevel = finalConfidence >= 0.85 ? 'Low' : finalConfidence >= 0.65 ? 'Medium' : 'High';

  profile.summary = `Profile extracted for ${profile.occupation || 'Citizen'} in ${profile.district || 'Uttar Pradesh'}${profile.annualIncome ? ` with income ₹${profile.annualIncome.toLocaleString('en-IN')}` : ''}.`;

  return {
    success: true,
    engine: 'deterministic-multilingual-nlp',
    profile,
    uncertainty: {
      confidenceScore: finalConfidence,
      ambiguityLevel,
      flags: uncertaintyFlags,
      clarifyingQuestions
    }
  };
}
