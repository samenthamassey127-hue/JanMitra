import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let pgPool = null;
let usePg = false;

// Initialize PostgreSQL if DATABASE_URL is provided
if (process.env.DATABASE_URL) {
  try {
    const { Pool } = pg;
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
    console.log('🔗 PostgreSQL pool configured with DATABASE_URL.');
  } catch (err) {
    console.warn('⚠️ PostgreSQL initialization error, defaulting to local persistence store:', err.message);
  }
}

// Initial Seed Data for Schemes, Services, Notices, and Demo Users
const DEFAULT_SCHEMES = [
  {
    id: 'up-post-matric-scholarship',
    scheme_code: 'UP-SCH-PMS-2024',
    title: 'UP Post-Matric Scholarship & Fee Reimbursement Scheme',
    title_hi: 'उत्तर प्रदेश दशमोत्तर छात्रवृत्ति एवं शुल्क प्रतिपूर्ति योजना',
    ministry: 'Social Welfare Department, Government of Uttar Pradesh',
    department: 'Samaj Kalyan Vibhag',
    category: 'Education & Scholarship',
    target_group: 'Post-Matric / Higher Education Students (Class 11, 12, UG, PG, Polytechnic, Engineering)',
    financial_benefit: '100% Non-Refundable Tuition Fee Reimbursement + Monthly Maintenance Allowance up to ₹1,200/mo',
    benefit_type: 'Direct Benefit Transfer (DBT - Aadhaar Seeded Account)',
    sla_days: 45,
    is_active: true,
    application_url: 'https://scholarship.up.gov.in',
    helpline: '1800 180 5131',
    eligibility_criteria: {
      minAge: 16,
      maxAge: 35,
      requiredDomicile: 'Uttar Pradesh',
      maxIncomeAnnual: 250000,
      socialCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      attendanceThreshold: 75
    },
    document_checklist: [
      { name: 'Income Certificate (आय प्रमाण पत्र)', maxAgeMonths: 36, mandatory: true },
      { name: 'Domicile / Residence Certificate (निवास प्रमाण पत्र)', mandatory: true },
      { name: 'Caste Certificate (जाति प्रमाण पत्र)', mandatory: false, note: 'Mandatory for SC/ST/OBC' },
      { name: 'Aadhaar Card (Mobile Linked)', mandatory: true },
      { name: 'Fee Receipt & College Admission Verification', mandatory: true },
      { name: 'Active Bank Passbook (NPCI DBT Mapped)', mandatory: true }
    ],
    statutory_rules: [
      { rule: 'Mandatory Aadhaar Biometric / OTP e-KYC on UP Scholarship portal before final submission.' },
      { rule: 'Income certificate must be verified from the Revenue Board e-District database.' },
      { rule: 'Bank account must be seeded with Aadhaar on NPCI mapping server; non-seeded accounts fail DBT transfer.' }
    ]
  },
  {
    id: 'pm-kisan-samman-nidhi',
    scheme_code: 'GOI-AGR-PMKISAN-2019',
    title: 'PM Kisan Samman Nidhi Yojana',
    title_hi: 'प्रधानमंत्री किसान सम्मान निधि योजना',
    ministry: 'Ministry of Agriculture and Farmers Welfare, Govt of India',
    department: 'Agriculture Department, UP',
    category: 'Agriculture & Rural Development',
    target_group: 'Small, Marginal and Landholding Farming Families',
    financial_benefit: '₹6,000 per year paid in three equal installments of ₹2,000 directly via DBT',
    benefit_type: 'Direct Benefit Transfer (DBT)',
    sla_days: 30,
    is_active: true,
    application_url: 'https://pmkisan.gov.in',
    helpline: '155261 / 011-24300606',
    eligibility_criteria: {
      minAge: 18,
      maxAge: 99,
      requiredDomicile: 'All India (UP Farmers)',
      mustOwnCultivableLand: true,
      excludeTaxPayers: true
    },
    document_checklist: [
      { name: 'Aadhaar Card', mandatory: true },
      { name: 'Land Record / Khatauni (खतौनी नकल)', mandatory: true },
      { name: 'Aadhaar-seeded Bank Account Passbook', mandatory: true }
    ],
    statutory_rules: [
      { rule: 'Land Seeding (भूलेख अंकन) must be confirmed in UP Revenue Khatauni records.' },
      { rule: 'Mandatory e-KYC via PM-KISAN Portal OTP or CSC biometric scan.' },
      { rule: 'Institutional landholders and serving/retired government employees are strictly excluded.' }
    ]
  },
  {
    id: 'up-kanya-sumangala',
    scheme_code: 'UP-WCD-MKSY-2019',
    title: 'Mukhyamantri Kanya Sumangala Yojana',
    title_hi: 'मुख्यमंत्री कन्या सुमंगला योजना',
    ministry: 'Women & Child Development Department, Uttar Pradesh',
    department: 'Mahila Kalyan Vibhag',
    category: 'Women & Child Welfare',
    target_group: 'Girl Children from Birth to Higher Education / Degree Entry',
    financial_benefit: 'Conditional cash grant of ₹25,000 distributed across 6 chronological milestones',
    benefit_type: 'Direct Benefit Transfer (DBT)',
    sla_days: 21,
    is_active: true,
    application_url: 'https://mksy.up.gov.in',
    helpline: '181',
    eligibility_criteria: {
      minAge: 0,
      maxAge: 25,
      gender: 'Female',
      requiredDomicile: 'Uttar Pradesh',
      maxIncomeAnnual: 300000,
      maxGirlsPerFamily: 2
    },
    document_checklist: [
      { name: 'Child Birth Certificate / Proof of Age', mandatory: true },
      { name: 'Parent UP Domicile Certificate / Voter ID / Ration Card', mandatory: true },
      { name: 'Family Income Certificate (under ₹3,00,000)', mandatory: true },
      { name: 'Joint or Mother Bank Account Passbook', mandatory: true }
    ],
    statutory_rules: [
      { rule: 'Family must be resident of Uttar Pradesh and have living residence within UP.' },
      { rule: 'Application for stage 1 (Birth) must be submitted within 6 months of childbirth.' }
    ]
  },
  {
    id: 'up-old-age-pension',
    scheme_code: 'UP-SWD-OAP-2022',
    title: 'UP Vridhavastha (Old Age) Pension Scheme',
    title_hi: 'उत्तर प्रदेश वृद्धावस्था पेंशन योजना',
    ministry: 'Social Welfare Department, Government of Uttar Pradesh',
    department: 'Samaj Kalyan Vibhag',
    category: 'Social Security & Pension',
    target_group: 'Senior Citizens living below poverty threshold',
    financial_benefit: '₹1,000 per month (₹3,000 disbursed quarterly) via DBT',
    benefit_type: 'Direct Benefit Transfer (DBT)',
    sla_days: 30,
    is_active: true,
    application_url: 'https://sspy-up.gov.in',
    helpline: '1800 419 0001',
    eligibility_criteria: {
      minAge: 60,
      maxAge: 120,
      requiredDomicile: 'Uttar Pradesh',
      maxIncomeAnnualRural: 46080,
      maxIncomeAnnualUrban: 56460,
      notReceivingOtherPension: true
    },
    document_checklist: [
      { name: 'Aadhaar Card with Age >= 60', mandatory: true },
      { name: 'Income Certificate issued by Tehsildar', mandatory: true },
      { name: 'Bank Passbook linked with Aadhaar', mandatory: true },
      { name: 'UP Domicile Certificate', mandatory: true }
    ],
    statutory_rules: [
      { rule: 'Annual verification (वार्षिक सत्यापन / Jeevan Praman) required every November.' },
      { rule: 'Disbursement is routed directly to PFMS via NPCI Aadhaar payment bridge.' }
    ]
  }
];

const DEFAULT_SCHEME_VERSIONS = [
  {
    id: 'ver-pms-2024-2',
    scheme_id: 'up-post-matric-scholarship',
    version_tag: 'v2024.2.1',
    gazette_order_number: 'UP-GO-SWD/1842/XXVI-3-2024',
    gazette_date: '2024-08-15',
    changes_summary: 'Mandatory Aadhaar biometric e-KYC integration introduced; Income Certificate ceiling confirmed at ₹2.50 Lakh for OBC/General, ₹2.50 Lakh for SC/ST.',
    statutory_reference_url: 'https://shasanadesh.up.gov.in',
    verified_by_officer: 'Shri R.K. Mishra, Joint Secretary (Samaj Kalyan)',
    verification_status: 'Gazette Verified'
  },
  {
    id: 'ver-pmk-2024-1',
    scheme_id: 'pm-kisan-samman-nidhi',
    version_tag: 'v16.0',
    gazette_order_number: 'GOI-AGR-401/2024-PK',
    gazette_date: '2024-02-28',
    changes_summary: 'Mandatory digital land registry linkage (Khatauni Bhulekh seeding) implemented for 16th and subsequent tranches.',
    statutory_reference_url: 'https://pmkisan.gov.in/guidelines',
    verified_by_officer: 'Deputy Commissioner, UP Land Records',
    verification_status: 'Gazette Verified'
  },
  {
    id: 'ver-mksy-2024-1',
    scheme_id: 'up-kanya-sumangala',
    version_tag: 'v2024.1',
    gazette_order_number: 'UP-GO-WCD/904/2024',
    gazette_date: '2024-04-01',
    changes_summary: 'Enhanced total grant from ₹15,000 to ₹25,000 across the 6 chronological education and immunisation milestones.',
    statutory_reference_url: 'https://mksy.up.gov.in/notification',
    verified_by_officer: 'Director, Mahila Kalyan Uttar Pradesh',
    verification_status: 'Gazette Verified'
  }
];

const DEFAULT_SERVICES = [
  {
    id: 'up-srv-income',
    service_code: 'UP-SRV-INC',
    name: 'Income Certificate (आय प्रमाण पत्र)',
    name_hi: 'आय प्रमाण पत्र',
    department: 'Revenue Department (राजस्व विभाग)',
    sla_days: 15,
    statutory_act: 'UP Right to Public Services Act (Janhit Guarantee) 2011',
    designated_officer: 'Tehsildar',
    appellate_officer: 'Sub-Divisional Magistrate (SDM)',
    fee_in_inr: 30.00,
    required_documents: ['Aadhaar Card', 'Ration Card / Parivar Register', 'Self Declaration (स्वप्रमाणित घोषणा)']
  },
  {
    id: 'up-srv-domicile',
    service_code: 'UP-SRV-DOM',
    name: 'Domicile / Residence Certificate (निवास प्रमाण पत्र)',
    name_hi: 'निवास प्रमाण पत्र',
    department: 'Revenue Department (राजस्व विभाग)',
    sla_days: 20,
    statutory_act: 'UP Right to Public Services Act (Janhit Guarantee) 2011',
    designated_officer: 'Tehsildar',
    appellate_officer: 'Sub-Divisional Magistrate (SDM)',
    fee_in_inr: 30.00,
    required_documents: ['Aadhaar Card', 'Electricity Bill / Water Bill', 'School Leaving / Birth Certificate']
  },
  {
    id: 'up-srv-caste',
    service_code: 'UP-SRV-CAS',
    name: 'Caste Certificate (जाति प्रमाण पत्र - OBC/SC/ST)',
    name_hi: 'जाति प्रमाण पत्र',
    department: 'Revenue Department (राजस्व विभाग)',
    sla_days: 20,
    statutory_act: 'UP Right to Public Services Act (Janhit Guarantee) 2011',
    designated_officer: 'Tehsildar',
    appellate_officer: 'Sub-Divisional Magistrate (SDM)',
    fee_in_inr: 30.00,
    required_documents: ['Aadhaar Card', 'Paternal Relative Caste Certificate / Parivar Register', 'Self Declaration']
  },
  {
    id: 'up-srv-khatauni',
    service_code: 'UP-SRV-KHT',
    name: 'Digital Khatauni / Land Record Copy (खतौनी नकल)',
    name_hi: 'डिजिटल खतौनी नकल',
    department: 'Board of Revenue UP (राजस्व परिषद)',
    sla_days: 1,
    statutory_act: 'UP Right to Public Services Act 2011',
    designated_officer: 'Registrar Kanoongo / Lekhpal',
    appellate_officer: 'Tehsildar',
    fee_in_inr: 15.00,
    required_documents: ['Khasra / Gata Number', 'Khata Number']
  }
];

const DEFAULT_NOTICES = [
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
    likes: 42,
    pinned: true,
    created_at: new Date().toISOString()
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
    likes: 14,
    pinned: false,
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
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
    likes: 31,
    pinned: false,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
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
    likes: 19,
    pinned: false,
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  }
];

const DEFAULT_USERS = [
  {
    id: 'usr-samentha',
    email: 'samentha@janmitra.gov.in',
    password_hash: bcrypt.hashSync('Janmitra@2026', 10),
    full_name: 'Samentha Massey',
    phone: '9876543210',
    role: 'officer',
    district: 'Lucknow',
    tehsil: 'Hazratganj',
    social_category: 'General',
    created_at: new Date().toISOString()
  },
  {
    id: 'usr-citizen-demo',
    email: 'citizen@janmitra.in',
    password_hash: bcrypt.hashSync('Citizen@123', 10),
    full_name: 'Rameshwar Sharma',
    phone: '9812345678',
    role: 'citizen',
    district: 'Lucknow',
    tehsil: 'Aliganj',
    social_category: 'OBC',
    annual_income: 120000,
    created_at: new Date().toISOString()
  },
  {
    id: 'usr-pradhan-demo',
    email: 'pradhan@barabanki.in',
    password_hash: bcrypt.hashSync('Pradhan@123', 10),
    full_name: 'Ram Prakash Yadav (Gram Pradhan)',
    phone: '9450001122',
    role: 'gram_pradhan',
    district: 'Barabanki',
    tehsil: 'Nawabganj',
    social_category: 'OBC',
    created_at: new Date().toISOString()
  }
];

// Helper to read local JSON store
function readStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading store file, creating fresh:', err);
  }

  // Initialize fresh store
  const initial = {
    users: DEFAULT_USERS,
    schemes: DEFAULT_SCHEMES,
    scheme_versions: DEFAULT_SCHEME_VERSIONS,
    services: DEFAULT_SERVICES,
    notices: DEFAULT_NOTICES,
    journeys: [
      {
        id: 'jrn-demo-1',
        user_id: 'usr-citizen-demo',
        scheme_id: 'up-post-matric-scholarship',
        scheme_title: 'UP Post-Matric Scholarship & Fee Reimbursement Scheme',
        citizen_name: 'Rameshwar Sharma',
        phone: '9812345678',
        district: 'Lucknow',
        current_stage: 'under_scrutiny',
        application_number: 'UP/2026/PMS/884219',
        dbt_account_seeded: true,
        notes: 'Documents verified at Tehsil Aliganj; forward to District Social Welfare Officer.',
        documents_submitted: [
          { name: 'Income Certificate', status: 'Verified', issueDate: '2025-06-10' },
          { name: 'Aadhaar e-KYC', status: 'Verified' },
          { name: 'Fee Receipt', status: 'Verified' }
        ],
        stage_history: [
          { stage: 'discovered', timestamp: '2026-09-01T10:00:00Z', note: 'Scheme discovered via JanMitra match' },
          { stage: 'docs_collected', timestamp: '2026-09-05T14:30:00Z', note: 'Income and Domicile certificates uploaded' },
          { stage: 'applied', timestamp: '2026-09-10T11:15:00Z', note: 'Application submitted on UP Scholarship Portal' },
          { stage: 'under_scrutiny', timestamp: '2026-09-20T09:00:00Z', note: 'Tehsil scrutiny completed; awaiting DSWO sanction' }
        ],
        created_at: '2026-09-01T10:00:00Z',
        updated_at: '2026-09-20T09:00:00Z'
      }
    ],
    audit_logs: []
  };

  writeStore(initial);
  return initial;
}

function writeStore(data) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to store file:', err);
  }
}

// Database Manager Interface
export const db = {
  async init() {
    if (pgPool) {
      try {
        const client = await pgPool.connect();
        usePg = true;
        client.release();
        console.log('✅ PostgreSQL connection verified and active.');
        // Run schema setup if tables don't exist
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
          const sql = fs.readFileSync(schemaPath, 'utf-8');
          await pgPool.query(sql);
          console.log('✅ PostgreSQL schema verified/synchronized.');
        }
        return { mode: 'postgresql' };
      } catch (err) {
        console.warn('⚠️ PostgreSQL connection failed, switching to local store:', err.message);
        usePg = false;
      }
    }
    // Ensure local store initialized
    readStore();
    console.log('📂 Local dual-mode persistence active at', STORE_FILE);
    return { mode: 'local-store' };
  },

  getMode() {
    return usePg ? 'PostgreSQL' : 'Local JSON Store (Dual-Mode Fallback)';
  },

  // USERS
  async findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    if (usePg) {
      const res = await pgPool.query('SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1', [cleanEmail]);
      return res.rows[0] || null;
    }
    const store = readStore();
    return store.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findUserById(id) {
    if (usePg) {
      const res = await pgPool.query('SELECT id, email, full_name, role, district, tehsil, social_category, annual_income, phone FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    const store = readStore();
    const user = store.users.find(u => u.id === id);
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  },

  async createUser({ email, password, full_name, phone, role = 'citizen', district = 'Lucknow', tehsil, social_category = 'General', annual_income = 0 }) {
    const password_hash = await bcrypt.hash(password, 10);
    const cleanEmail = email.trim().toLowerCase();

    if (usePg) {
      const res = await pgPool.query(
        `INSERT INTO users (email, password_hash, full_name, phone, role, district, tehsil, social_category, annual_income)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, email, full_name, role, district, tehsil, social_category, annual_income, created_at`,
        [cleanEmail, password_hash, full_name, phone, role, district, tehsil, social_category, annual_income]
      );
      return res.rows[0];
    }

    const store = readStore();
    const newUser = {
      id: 'usr-' + Date.now(),
      email: cleanEmail,
      password_hash,
      full_name,
      phone,
      role,
      district,
      tehsil,
      social_category,
      annual_income,
      created_at: new Date().toISOString()
    };
    store.users.push(newUser);
    writeStore(store);

    const { password_hash: _, ...safeUser } = newUser;
    return safeUser;
  },

  // SCHEMES
  async getSchemes({ category, district, search } = {}) {
    if (usePg) {
      let query = 'SELECT * FROM schemes WHERE is_active = true';
      const params = [];
      if (category && category !== 'All') {
        params.push(`%${category}%`);
        query += ` AND category ILIKE $${params.length}`;
      }
      if (search) {
        params.push(`%${search}%`);
        query += ` AND (title ILIKE $${params.length} OR title_hi ILIKE $${params.length} OR department ILIKE $${params.length})`;
      }
      query += ' ORDER BY title ASC';
      const res = await pgPool.query(query, params);
      return res.rows;
    }

    const store = readStore();
    let schemes = store.schemes.filter(s => s.is_active);
    if (category && category !== 'All') {
      schemes = schemes.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      schemes = schemes.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.title_hi.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }
    return schemes;
  },

  async getSchemeById(id) {
    if (usePg) {
      const res = await pgPool.query('SELECT * FROM schemes WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    const store = readStore();
    return store.schemes.find(s => s.id === id) || null;
  },

  // SCHEME VERSIONS (Gazette Verification)
  async getSchemeVersions(schemeId) {
    if (usePg) {
      const res = await pgPool.query('SELECT * FROM scheme_versions WHERE scheme_id = $1 ORDER BY gazette_date DESC', [schemeId]);
      return res.rows;
    }
    const store = readStore();
    return store.scheme_versions.filter(v => v.scheme_id === schemeId);
  },

  async addSchemeVersion(versionData) {
    const id = 'ver-' + Date.now();
    const newVersion = { id, ...versionData, created_at: new Date().toISOString() };
    if (usePg) {
      const res = await pgPool.query(
        `INSERT INTO scheme_versions (scheme_id, version_tag, gazette_order_number, gazette_date, changes_summary, statutory_reference_url, verified_by_officer)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [newVersion.scheme_id, newVersion.version_tag, newVersion.gazette_order_number, newVersion.gazette_date, newVersion.changes_summary, newVersion.statutory_reference_url, newVersion.verified_by_officer]
      );
      return res.rows[0];
    }
    const store = readStore();
    store.scheme_versions.unshift(newVersion);
    writeStore(store);
    return newVersion;
  },

  // SERVICES
  async getServices() {
    if (usePg) {
      const res = await pgPool.query('SELECT * FROM services ORDER BY name ASC');
      return res.rows;
    }
    const store = readStore();
    return store.services;
  },

  // VAKH NOTICES
  async getNotices(district) {
    if (usePg) {
      let query = 'SELECT * FROM notices';
      const params = [];
      if (district && district !== 'All Districts') {
        params.push(district.toLowerCase());
        query += ' WHERE LOWER(district) = $1';
      }
      query += ' ORDER BY pinned DESC, created_at DESC';
      const res = await pgPool.query(query, params);
      return res.rows;
    }
    const store = readStore();
    if (district && district !== 'All Districts') {
      return store.notices.filter(n => n.district.toLowerCase() === district.toLowerCase());
    }
    return store.notices;
  },

  async createNotice(notice) {
    const id = 'vn-' + Date.now();
    const newNotice = {
      id,
      author: notice.author || 'Civic Participant',
      handle: notice.handle || '@citizen',
      role: notice.role || 'Citizen',
      location: notice.location || `${notice.district || 'UP'} Ward`,
      district: notice.district || 'Lucknow',
      content: notice.content,
      verified: Boolean(notice.verified),
      category: notice.category || 'Camp',
      likes: notice.likes || 1,
      pinned: false,
      timestamp: 'Just now',
      created_at: new Date().toISOString()
    };

    if (usePg) {
      const res = await pgPool.query(
        `INSERT INTO notices (id, author, handle, role, location, district, content, verified, category, likes, pinned)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [newNotice.id, newNotice.author, newNotice.handle, newNotice.role, newNotice.location, newNotice.district, newNotice.content, newNotice.verified, newNotice.category, newNotice.likes, newNotice.pinned]
      );
      return res.rows[0];
    }

    const store = readStore();
    store.notices.unshift(newNotice);
    writeStore(store);
    return newNotice;
  },

  // APPLICATION JOURNEYS
  async getJourneys(userId) {
    if (usePg) {
      let query = 'SELECT * FROM journeys';
      const params = [];
      if (userId) {
        params.push(userId);
        query += ' WHERE user_id = $1';
      }
      query += ' ORDER BY updated_at DESC';
      const res = await pgPool.query(query, params);
      return res.rows;
    }
    const store = readStore();
    if (userId) {
      return store.journeys.filter(j => j.user_id === userId);
    }
    return store.journeys;
  },

  async getJourneyByApplicationNumber(appNumber) {
    if (!appNumber) return null;
    const cleanNum = appNumber.trim().toUpperCase();
    if (usePg) {
      const res = await pgPool.query('SELECT * FROM journeys WHERE UPPER(application_number) = $1 LIMIT 1', [cleanNum]);
      return res.rows[0] || null;
    }
    const store = readStore();
    return store.journeys.find(j => j.application_number && j.application_number.toUpperCase() === cleanNum) || null;
  },

  async saveJourney(journey) {
    const id = journey.id || ('jrn-' + Date.now());
    const applicationNumber = journey.application_number || `UP/${new Date().getFullYear()}/${journey.scheme_id ? journey.scheme_id.slice(0, 3).toUpperCase() : 'JM'}/${Math.floor(100000 + Math.random() * 900000)}`;

    const newJourney = {
      id,
      user_id: journey.user_id || null,
      scheme_id: journey.scheme_id || null,
      scheme_title: journey.scheme_title || 'Government Welfare Scheme',
      citizen_name: journey.citizen_name || 'Anonymous Citizen',
      phone: journey.phone || '',
      district: journey.district || 'Lucknow',
      current_stage: journey.current_stage || 'discovered',
      application_number: applicationNumber,
      dbt_account_seeded: Boolean(journey.dbt_account_seeded),
      notes: journey.notes || '',
      documents_submitted: journey.documents_submitted || [],
      stage_history: journey.stage_history || [
        { stage: journey.current_stage || 'discovered', timestamp: new Date().toISOString(), note: 'Journey initiated in JanMitra' }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (usePg) {
      const res = await pgPool.query(
        `INSERT INTO journeys (id, user_id, scheme_id, scheme_title, citizen_name, phone, district, current_stage, application_number, dbt_account_seeded, notes, documents_submitted, stage_history)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO UPDATE SET
           current_stage = EXCLUDED.current_stage,
           notes = EXCLUDED.notes,
           stage_history = EXCLUDED.stage_history,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [newJourney.id, newJourney.user_id, newJourney.scheme_id, newJourney.scheme_title, newJourney.citizen_name, newJourney.phone, newJourney.district, newJourney.current_stage, newJourney.application_number, newJourney.dbt_account_seeded, newJourney.notes, JSON.stringify(newJourney.documents_submitted), JSON.stringify(newJourney.stage_history)]
      );
      return res.rows[0];
    }

    const store = readStore();
    const existingIdx = store.journeys.findIndex(j => j.id === id);
    if (existingIdx >= 0) {
      store.journeys[existingIdx] = { ...store.journeys[existingIdx], ...newJourney, updated_at: new Date().toISOString() };
    } else {
      store.journeys.unshift(newJourney);
    }
    writeStore(store);
    return newJourney;
  },

  async updateJourneyStage(id, stage, note = '') {
    const timestamp = new Date().toISOString();
    if (usePg) {
      const res = await pgPool.query(
        `UPDATE journeys 
         SET current_stage = $2,
             stage_history = stage_history || $3::jsonb,
             notes = COALESCE($4, notes),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 RETURNING *`,
        [id, stage, JSON.stringify([{ stage, timestamp, note }]), note]
      );
      return res.rows[0] || null;
    }

    const store = readStore();
    const journey = store.journeys.find(j => j.id === id);
    if (!journey) return null;

    journey.current_stage = stage;
    journey.stage_history = journey.stage_history || [];
    journey.stage_history.push({ stage, timestamp, note });
    if (note) journey.notes = note;
    journey.updated_at = timestamp;

    writeStore(store);
    return journey;
  },

  // AUDIT LOG
  async logAudit(userId, action, entityType, entityId, metadata = {}) {
    const entry = {
      id: 'aud-' + Date.now(),
      user_id: userId || null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      timestamp: new Date().toISOString()
    };
    if (usePg) {
      try {
        await pgPool.query(
          'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata) VALUES ($1, $2, $3, $4, $5)',
          [entry.user_id, entry.action, entry.entity_type, entry.entity_id, JSON.stringify(entry.metadata)]
        );
      } catch (err) {
        console.warn('Failed to insert audit log to PG:', err.message);
      }
      return;
    }
    const store = readStore();
    store.audit_logs.push(entry);
    writeStore(store);
  }
};
