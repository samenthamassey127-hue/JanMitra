import { ShowcaseScenario, UserProfile } from '../types';
import { ALL_DOCUMENTS } from './documents';

export const SHOWCASE_SCENARIOS: ShowcaseScenario[] = [
  {
    id: 'student',
    name: 'Scenario A: Student',
    nameHi: 'परिदृश्य क: विद्यार्थी (बी.टेक)',
    badge: 'Education & Scholarship',
    userQuery: "I'm a 20-year-old B.Tech student from Lucknow. My family's annual income is around ₹2.5 lakh and I'm looking for financial help with my education.",
    userQueryHi: 'मैं लखनऊ से 20 वर्षीय बी.टेक का छात्र हूँ। मेरे परिवार की वार्षिक आय लगभग ₹2.5 लाख है और मुझे अपनी शिक्षा के लिए वित्तीय सहायता चाहिए।',
    initialProfile: {
      name: 'Aman Verma',
      age: 20,
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      education: 'B.Tech (Computer Science)',
      occupation: 'Student',
      incomeRange: '₹1.0L - ₹2.5L',
      incomeValue: 250000,
      category: 'OBC',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      disabilityStatus: false,
      ruralUrban: 'Urban',
      institutionType: 'Government-Aided',
      extractedChips: [
        { id: 'c1', label: '20 years', field: 'age', value: 20 },
        { id: 'c2', label: 'Lucknow, UP', field: 'district', value: 'Lucknow' },
        { id: 'c3', label: 'B.Tech', field: 'education', value: 'B.Tech (Computer Science)' },
        { id: 'c4', label: 'Student', field: 'occupation', value: 'Student' },
        { id: 'c5', label: '₹2.5L income', field: 'incomeValue', value: 250000 },
        { id: 'c6', label: 'OBC', field: 'category', value: 'OBC' }
      ]
    },
    initialDocuments: ALL_DOCUMENTS.map(doc => {
      if (doc.code === 'income_cert') return { ...doc, status: 'expired' as const };
      if (doc.code === 'domicile_cert') return { ...doc, status: 'missing' as const };
      if (['aadhaar', 'caste_cert', 'marksheet_10', 'marksheet_12', 'college_bonafide', 'bank_passbook'].includes(doc.code)) {
        return { ...doc, status: 'available' as const };
      }
      return { ...doc, status: 'missing' as const };
    }),
    targetSchemeId: 'sch-up-post-matric',
    targetServiceId: 'srv-income-cert'
  },
  {
    id: 'senior',
    name: 'Scenario B: Senior Citizen',
    nameHi: 'परिदृश्य ख: वरिष्ठ नागरिक (पेंशन व स्वास्थ्य)',
    badge: 'Senior Citizen & Pension',
    userQuery: 'My father is 66 years old, retired, living in rural Varanasi. Our family has low income and we need monthly financial and healthcare support.',
    userQueryHi: 'मेरे पिताजी 66 वर्ष के हैं, सेवानिवृत्त हैं और वाराणसी के ग्रामीण क्षेत्र में रहते हैं। हमें मासिक वित्तीय और स्वास्थ्य सहायता की आवश्यकता है।',
    initialProfile: {
      name: 'Ram Charan Yadav',
      age: 66,
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      education: 'Primary',
      occupation: 'Retired / Senior Citizen',
      incomeRange: '< ₹1.0L',
      incomeValue: 42000,
      category: 'OBC',
      gender: 'Male',
      maritalStatus: 'Married',
      disabilityStatus: false,
      ruralUrban: 'Rural',
      bplCardHolder: true,
      extractedChips: [
        { id: 'cs1', label: '66 years', field: 'age', value: 66 },
        { id: 'cs2', label: 'Varanasi, UP', field: 'district', value: 'Varanasi' },
        { id: 'cs3', label: 'Retired', field: 'occupation', value: 'Retired / Senior Citizen' },
        { id: 'cs4', label: 'Rural', field: 'ruralUrban', value: 'Rural' },
        { id: 'cs5', label: '₹42k income', field: 'incomeValue', value: 42000 },
        { id: 'cs6', label: 'Priority Ration Card', field: 'bplCardHolder', value: true }
      ]
    },
    initialDocuments: ALL_DOCUMENTS.map(doc => {
      if (['aadhaar', 'age_proof_senior', 'ration_card', 'bank_passbook'].includes(doc.code)) {
        return { ...doc, status: 'available' as const };
      }
      if (doc.code === 'income_cert') return { ...doc, status: 'missing' as const };
      return { ...doc, status: 'missing' as const };
    }),
    targetSchemeId: 'sch-up-vridhavastha-pension',
    targetServiceId: 'srv-income-cert'
  },
  {
    id: 'certificate',
    name: 'Scenario C: Certificate Service',
    nameHi: 'परिदृश्य ग: आय प्रमाण पत्र सेवा',
    badge: 'eDistrict Public Service',
    userQuery: 'I need an official Income Certificate (Aay Praman Patra) for scholarship and college admission. How do I get it in Uttar Pradesh?',
    userQueryHi: 'मुझे छात्रवृत्ति और कॉलेज प्रवेश के लिए आय प्रमाण पत्र की आवश्यकता है। उत्तर प्रदेश में इसे कैसे प्राप्त करें?',
    initialProfile: {
      name: 'Pooja Shukla',
      age: 22,
      state: 'Uttar Pradesh',
      district: 'Kanpur Nagar',
      education: 'Undergraduate',
      occupation: 'Student',
      incomeRange: '₹1.0L - ₹2.5L',
      incomeValue: 180000,
      category: 'General',
      gender: 'Female',
      maritalStatus: 'Unmarried',
      disabilityStatus: false,
      ruralUrban: 'Urban',
      institutionType: 'Government',
      extractedChips: [
        { id: 'cc1', label: '22 years', field: 'age', value: 22 },
        { id: 'cc2', label: 'Kanpur, UP', field: 'district', value: 'Kanpur Nagar' },
        { id: 'cc3', label: 'Need: Income Certificate', field: 'goal', value: 'Income Certificate' }
      ]
    },
    initialDocuments: ALL_DOCUMENTS.map(doc => {
      if (['aadhaar', 'address_proof', 'bank_passbook'].includes(doc.code)) {
        return { ...doc, status: 'available' as const };
      }
      return { ...doc, status: 'missing' as const };
    }),
    targetServiceId: 'srv-income-cert'
  },
  {
    id: 'explain',
    name: 'Scenario D: Confusing Government Language',
    nameHi: 'परिदृश्य घ: सरकारी नियम सरलीकरण',
    badge: 'AI Language Simplifier',
    userQuery: 'The portal says: "The applicant shall submit a self-attested declaration affirming that all particulars submitted correspond to true revenue records... minimum 75% biometric attendance..." What does this mean?',
    userQueryHi: 'पोर्टल पर लिखा है: "आवेदक को स्व-प्रमाणित घोषणा जमा करनी होगी... 75% बायोमेट्रिक उपस्थिति..." इसका सरल अर्थ क्या है?',
    initialProfile: {
      name: 'Citizen Explorer',
      age: 23,
      state: 'Uttar Pradesh',
      district: 'Prayagraj',
      education: 'Graduate',
      occupation: 'Applicant',
      incomeRange: '₹1.0L - ₹2.5L',
      incomeValue: 200000,
      category: 'OBC',
      gender: 'Female',
      maritalStatus: 'Unmarried',
      disabilityStatus: false,
      ruralUrban: 'Urban',
      extractedChips: [
        { id: 'ce1', label: 'Notice Simplification', field: 'goal', value: 'Understand Rules' }
      ]
    },
    initialDocuments: ALL_DOCUMENTS,
    targetLegalSnippetId: 'snip-scholarship-declaration'
  }
];
