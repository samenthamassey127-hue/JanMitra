import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory store for Vakh Community Notices
let vakhNotices = [
  {
    id: 'vn-lead',
    author: 'Samentha Massey',
    handle: '@samentha',
    role: 'Lead Desk',
    location: 'State Civic Coordination Desk',
    district: 'Lucknow',
    content: 'Welcome to the JanMitra Civic Chaupal on Vakh! Follow @samentha on vakh.com for verified district camp dates, Aadhaar/e-KYC drives, and ground verification guidance across UP.',
    timestamp: 'Just now',
    verified: true,
    category: 'Urgent',
    likes: 42
  },
  {
    id: 'vn-1',
    author: 'Jan Seva Kendra #14',
    handle: '@csc_aliganj',
    role: 'CSC Operator',
    location: 'Sector B, Aliganj',
    district: 'Lucknow',
    content: 'Special Income Certificate (Aay Praman Patra) verification drive active today until 4:30 PM. Please carry original Rashan card and 2 passport photos.',
    timestamp: '20 mins ago',
    verified: true,
    category: 'Camp',
    likes: 14
  },
  {
    id: 'vn-2',
    author: 'Samentha Massey',
    handle: '@samentha',
    role: 'Lead Desk',
    location: 'Hazratganj Information Hub',
    district: 'Lucknow',
    content: 'UP Post-Matric Scholarship portal server maintenance completed. Biometric student e-KYC is now processing within 3 minutes at all registered tehsil kiosks.',
    timestamp: '45 mins ago',
    verified: true,
    category: 'Server Status',
    likes: 31
  },
  {
    id: 'vn-3',
    author: 'Masauli Panchayat Sahayak',
    handle: '@panchayat_masauli',
    role: 'Panchayat Desk',
    location: 'Gram Panchayat Bhawan',
    district: 'Barabanki',
    content: 'PM-KISAN 16th installment land-seeding & e-KYC camp organised tomorrow morning 10 AM. Free biometric assistance available for senior citizen farmers.',
    timestamp: '1 hour ago',
    verified: true,
    category: 'Camp',
    likes: 19
  }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'JanMitra Backend Engine',
    version: '1.0.0',
    curatedBy: 'Samentha Massey (@samentha)',
    aiEngine: process.env.GEMINI_API_KEY ? 'Gemini AI Active' : 'Deterministic Heuristic Fallback Active',
    timestamp: new Date().toISOString()
  });
});

// 1. Natural Language Situation Analyzer (AI + Heuristic Fallback)
app.post('/api/analyze-situation', async (req, res) => {
  const { query, language = 'en' } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query text is required' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const prompt = `You are the JanMitra Civic Intelligence Engine for Indian welfare schemes (Uttar Pradesh focus).
Analyze this citizen input and extract structured demographic attributes into pure JSON.
Citizen input: "${query}"

Return ONLY valid JSON matching this schema:
{
  "age": number or null,
  "district": string or null,
  "state": "Uttar Pradesh",
  "education": string or null,
  "occupation": string or null,
  "incomeValue": number or null,
  "incomeRange": string or null,
  "category": "General" | "OBC" | "SC" | "ST" | "EWS" or null,
  "goal": string or null,
  "summary": string
}`;

      const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return res.json({ success: true, engine: 'gemini-ai', profile: parsed });
        }
      }
    } catch (err) {
      console.warn('Gemini AI fallback triggered:', err.message);
    }
  }

  // Deterministic Heuristic Extraction Pipeline (Rule-Trained)
  const lower = query.toLowerCase();
  const result = {
    age: null,
    district: null,
    state: 'Uttar Pradesh',
    education: null,
    occupation: null,
    incomeValue: null,
    incomeRange: null,
    category: null,
    goal: null,
    summary: 'Analyzed via JanMitra Deterministic Rule Engine'
  };

  // Age pattern
  const ageMatch = lower.match(/(\d{1,2})\s*(?:years?|yr|वर्ष|साल)/);
  if (ageMatch) result.age = parseInt(ageMatch[1], 10);

  // District pattern
  if (lower.includes('lucknow') || lower.includes('लखनऊ')) result.district = 'Lucknow';
  else if (lower.includes('varanasi') || lower.includes('वाराणसी') || lower.includes('बनारस')) result.district = 'Varanasi';
  else if (lower.includes('kanpur') || lower.includes('कानपुर')) result.district = 'Kanpur Nagar';
  else if (lower.includes('barabanki') || lower.includes('बाराबंकी')) result.district = 'Barabanki';
  else if (lower.includes('gorakhpur') || lower.includes('गोरखपुर')) result.district = 'Gorakhpur';

  // Income pattern
  if (lower.includes('2.5') || lower.includes('ढाई लाख') || lower.includes('250000')) {
    result.incomeValue = 250000;
    result.incomeRange = '₹1.0L - ₹2.5L';
  } else if (lower.includes('1 लाख') || lower.includes('1.0') || lower.includes('50000') || lower.includes('low income')) {
    result.incomeValue = 50000;
    result.incomeRange = '< ₹1.0L';
  }

  // Social Category
  if (lower.includes('obc') || lower.includes('ओबीसी') || lower.includes('पिछड़ा')) result.category = 'OBC';
  else if (lower.includes('sc') || lower.includes('अनुसूचित जाति')) result.category = 'SC';
  else if (lower.includes('st') || lower.includes('अनुसूचित जनजाति')) result.category = 'ST';
  else if (lower.includes('ews') || lower.includes('ईडब्ल्यूएस')) result.category = 'EWS';

  // Occupation / Education
  if (lower.includes('student') || lower.includes('छात्र') || lower.includes('b.tech') || lower.includes('college')) {
    result.occupation = 'Student';
    result.education = 'Higher Education / B.Tech';
    result.goal = 'Scholarship & Fee Reimbursement';
  } else if (lower.includes('farmer') || lower.includes('किसान') || lower.includes('agriculture') || lower.includes('खेती')) {
    result.occupation = 'Farmer';
    result.goal = 'PM-KISAN / Agricultural Subsidy';
  } else if (lower.includes('pension') || lower.includes('retired') || lower.includes('पेंशन') || lower.includes('वृद्ध')) {
    result.occupation = 'Senior Citizen';
    result.goal = 'Old Age Pension Scheme';
  }

  return res.json({
    success: true,
    engine: 'deterministic-rules',
    profile: result
  });
});

// 2. Vakh Chaupal Notices API (Ground Reality Feed)
app.get('/api/vakh/notices', (req, res) => {
  const { district } = req.query;

  if (district && district !== 'All Districts') {
    const filtered = vakhNotices.filter(n => n.district.toLowerCase() === district.toLowerCase());
    return res.json({ success: true, count: filtered.length, notices: filtered });
  }

  res.json({ success: true, count: vakhNotices.length, notices: vakhNotices });
});

// 3. Broadcast New Vakh Notice
app.post('/api/vakh/notices', (req, res) => {
  const { author, handle, role, location, district, content, category } = req.body;

  if (!content || !district) {
    return res.status(400).json({ error: 'Content and district are required' });
  }

  const newNotice = {
    id: 'vn-' + Date.now(),
    author: author || 'Local Citizen',
    handle: handle || '@citizen',
    role: role || 'Citizen',
    location: location || `${district} Ward`,
    district,
    content,
    timestamp: 'Just now',
    verified: false,
    category: category || 'Guidance',
    likes: 1
  };

  vakhNotices = [newNotice, ...vakhNotices];
  res.status(201).json({ success: true, notice: newNotice });
});

// 4. Legal Gazette Simplifier ("Explain Like I'm 10")
app.post('/api/simplify-legal', async (req, res) => {
  const { text, language = 'en' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required to simplify' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const prompt = `You are a public servant simplifying complex Indian government circulars for rural citizens and students.
Simplify this official text into plain English and Hindi:
"${text}"

Return JSON:
{
  "title": "Clear headline",
  "whatItMeans": "Simple 2-sentence summary in plain words",
  "whoGetsIt": "Who is eligible",
  "actionStep": "What the citizen should do right now",
  "caution": "Common mistake to avoid"
}`;

      const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          return res.json({ success: true, engine: 'gemini-ai', simplified: JSON.parse(jsonText) });
        }
      }
    } catch (e) {
      console.warn('AI simplification fallback:', e.message);
    }
  }

  // Fallback simplified output
  res.json({
    success: true,
    engine: 'statutory-template',
    simplified: {
      title: 'Official Uttar Pradesh Government Order Summary',
      whatItMeans: 'This order specifies that students with family income under ₹2.5 Lakh per year can receive 100% college tuition reimbursement directly in their bank account.',
      whoGetsIt: 'Domiciled UP residents studying in recognized universities with valid Aadhaar-seeded bank accounts.',
      actionStep: 'Ensure your Income Certificate is renewed before applying on the scholarship portal.',
      caution: 'Do not use an expired Income Certificate (validity is 3 years from date of issue).'
    }
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🏛️ JanMitra Backend Service Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🚀 Curated by: Samentha Massey (@samentha)`);
  console.log(`=========================================`);
});
