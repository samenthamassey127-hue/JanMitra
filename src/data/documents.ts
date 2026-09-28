import { DocumentItem } from '../types';

export const ALL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-aadhaar',
    code: 'aadhaar',
    name: 'Aadhaar Card',
    nameHi: 'आधार कार्ड',
    type: 'Identity Proof',
    status: 'available',
    uploadedDate: '2026-01-15',
    expiryDate: 'Lifetime',
    fileSize: '412 KB',
    issuingAuthority: 'UIDAI',
    detectedFields: {
      'UID Number': 'XXXX-XXXX-4921',
      'Name': 'Samentha Massey',
      'DOB / YOB': '2006 (Age: 20)',
      'Gender': 'Female',
      'Biometric Linked': 'Yes (Active)'
    },
    description: 'Primary 12-digit biometric identity document issued by UIDAI.',
    descriptionHi: 'यूआईडीएआई द्वारा जारी 12 अंकों का प्राथमिक बायोमेट्रिक पहचान पत्र।'
  },
  {
    id: 'doc-pan',
    code: 'pan',
    name: 'PAN Card',
    nameHi: 'पैन कार्ड',
    type: 'Financial Identity',
    status: 'available',
    uploadedDate: '2026-02-10',
    expiryDate: 'Lifetime',
    fileSize: '298 KB',
    issuingAuthority: 'Income Tax Department, Govt of India',
    detectedFields: {
      'PAN': 'ABCPS****K',
      'Father Name': 'R. K. Massey',
      'Status': 'Individual'
    },
    description: 'Permanent Account Number used for financial accounts, bank transfers, and taxation.',
    descriptionHi: 'वित्तीय खातों, बैंक हस्तांतरण और कराधान के लिए स्थायी खाता संख्या।'
  },
  {
    id: 'doc-income',
    code: 'income_cert',
    name: 'Income Certificate (Aay Praman Patra)',
    nameHi: 'आय प्रमाण पत्र',
    type: 'Revenue Certificate',
    status: 'expired',
    uploadedDate: '2023-04-10',
    expiryDate: '2026-04-09 (Validity: 3 Years - Expired)',
    fileSize: '540 KB',
    issuingAuthority: 'Tehsildar, Revenue Department, UP eDistrict',
    relatedServiceId: 'srv-income-cert',
    detectedFields: {
      'Certificate No': 'UP-EDIST-23094812',
      'Certified Annual Income': '₹2,50,000 / year',
      'Issued Date': '10-Apr-2023',
      'Validity Period': '3 years (Needs renewal for current academic cycle)'
    },
    description: 'Official revenue document certifying family annual gross income in Uttar Pradesh.',
    descriptionHi: 'उत्तर प्रदेश में परिवार की वार्षिक सकल आय प्रमाणित करने वाला आधिकारिक राजस्व दस्तावेज।'
  },
  {
    id: 'doc-domicile',
    code: 'domicile_cert',
    name: 'Domicile Certificate (Niwas Praman Patra)',
    nameHi: 'निवास प्रमाण पत्र',
    type: 'Residency Certificate',
    status: 'missing',
    issuingAuthority: 'Sub-Divisional Magistrate (SDM) / Tehsildar, UP',
    relatedServiceId: 'srv-domicile-cert',
    description: 'Proof of permanent residence in Uttar Pradesh for at least 3 consecutive years.',
    descriptionHi: 'कम से कम 3 लगातार वर्षों से उत्तर प्रदेश में स्थायी निवास का कानूनी प्रमाण।'
  },
  {
    id: 'doc-caste',
    code: 'caste_cert',
    name: 'Caste Certificate (Jati Praman Patra)',
    nameHi: 'जाति प्रमाण पत्र',
    type: 'Social Category Proof',
    status: 'available',
    uploadedDate: '2025-08-20',
    expiryDate: 'Lifetime (Central/State OBC rules apply)',
    fileSize: '620 KB',
    issuingAuthority: 'Tehsildar, District Administration Lucknow',
    relatedServiceId: 'srv-caste-cert',
    detectedFields: {
      'Category': 'Other Backward Class (OBC)',
      'Sub-Caste': 'Kurmi',
      'Non-Creamy Layer': 'Certified'
    },
    description: 'Mandatory certificate for availing fee concessions and quota benefits under OBC/SC/ST categories.',
    descriptionHi: 'ओबीसी/एससी/एसटी श्रेणियों के तहत शुल्क छूट और आरक्षण लाभ प्राप्त करने के लिए अनिवार्य प्रमाण पत्र।'
  },
  {
    id: 'doc-marksheet-10',
    code: 'marksheet_10',
    name: '10th / High School Marksheet & Certificate',
    nameHi: '10वीं / हाई स्कूल अंक पत्र',
    type: 'Academic Record & Age Proof',
    status: 'available',
    uploadedDate: '2024-06-12',
    fileSize: '710 KB',
    issuingAuthority: 'UP Board of High School & Intermediate Education',
    detectedFields: {
      'Roll Number': '2214981',
      'Year of Passing': '2022',
      'Marks': '84.2%',
      'DOB Verified': '14-Aug-2006'
    },
    description: 'Standard document accepted universally across India for verification of Date of Birth.',
    descriptionHi: 'जन्म तिथि के सत्यापन के लिए पूरे भारत में सार्वभौमिक रूप से स्वीकृत दस्तावेज।'
  },
  {
    id: 'doc-marksheet-12',
    code: 'marksheet_12',
    name: '12th / Intermediate Marksheet',
    nameHi: '12वीं / इंटरमीडिएट अंक पत्र',
    type: 'Academic Record',
    status: 'available',
    uploadedDate: '2024-07-05',
    fileSize: '680 KB',
    issuingAuthority: 'UP Board / CBSE',
    detectedFields: {
      'Stream': 'Science (PCM)',
      'Year of Passing': '2024',
      'Percentage': '81.6%'
    },
    description: 'Required for post-matric higher education and professional degree scholarships.',
    descriptionHi: 'पोस्ट-मैट्रिक उच्च शिक्षा और व्यावसायिक डिग्री छात्रवृत्ति के लिए आवश्यक।'
  },
  {
    id: 'doc-college-bonafide',
    code: 'college_bonafide',
    name: 'College Bonafide & Fee Receipt',
    nameHi: 'कॉलेज बोनाफाइड और फीस रसीद',
    type: 'Institutional Proof',
    status: 'available',
    uploadedDate: '2026-08-14',
    fileSize: '450 KB',
    issuingAuthority: 'Lucknow Institute of Technology, Lucknow',
    detectedFields: {
      'Course': 'B.Tech (Computer Science)',
      'Year': '2nd Year (Semester 3)',
      'Non-refundable Fee Paid': '₹55,000'
    },
    description: 'Proves current admission and exact non-refundable fee deposited for reimbursement.',
    descriptionHi: 'पुनर्भुगतान के लिए वर्तमान प्रवेश और सटीक गैर-वापसी योग्य जमा शुल्क साबित करता है।'
  },
  {
    id: 'doc-bank-passbook',
    code: 'bank_passbook',
    name: 'Bank Passbook (Aadhaar-Seeded DBT Account)',
    nameHi: 'बैंक पासबुक (आधार सीडेड डीबीटी खाता)',
    type: 'Financial Disbursal Proof',
    status: 'available',
    uploadedDate: '2025-11-02',
    fileSize: '390 KB',
    issuingAuthority: 'State Bank of India, Hazratganj Branch',
    detectedFields: {
      'Account No': 'XXXX-XXXX-8821',
      'IFSC': 'SBIN0001234',
      'NPCI Aadhaar Mapping': 'Active / Seeded'
    },
    description: 'Direct Benefit Transfer (DBT) requires an active account mapped to Aadhaar in the NPCI mapper.',
    descriptionHi: 'प्रत्यक्ष लाभ हस्तांतरण (DBT) के लिए एनपीसीआई मैपर में आधार से जुड़ा खाता आवश्यक है।'
  },
  {
    id: 'doc-address-proof',
    code: 'address_proof',
    name: 'Electricity Bill / Water Tax Receipt',
    nameHi: 'बिजली बिल / जल कर रसीद',
    type: 'Address Verification',
    status: 'available',
    uploadedDate: '2026-08-01',
    fileSize: '310 KB',
    issuingAuthority: 'Madhyanchal Vidyut Vitran Nigam Ltd (MVVNL)',
    description: 'Utility bill issued in the last 3 months verifying physical street address.',
    descriptionHi: 'पिछले 3 महीनों में जारी किया गया बिल जो पते को सत्यापित करता है।'
  },
  {
    id: 'doc-ration-card',
    code: 'ration_card',
    name: 'Ration Card (NFSA / BPL / Antyodaya)',
    nameHi: 'राशन कार्ड (राष्ट्रीय खाद्य सुरक्षा अधिनियम / बीपीएल)',
    type: 'Household Entitlement',
    status: 'available',
    uploadedDate: '2025-03-11',
    fileSize: '490 KB',
    issuingAuthority: 'Food & Civil Supplies Department, Uttar Pradesh',
    relatedServiceId: 'srv-ration-card',
    detectedFields: {
      'Card Type': 'Patra Grihasti (Priority Household)',
      'Total Family Members': '4'
    },
    description: 'Crucial for social welfare benefits, housing assistance, and subsidized food grains.',
    descriptionHi: 'सामाजिक कल्याणकारी योजनाओं, आवास और रियायती खाद्यान्न के लिए महत्वपूर्ण।'
  },
  {
    id: 'doc-self-declaration',
    code: 'self_declaration',
    name: 'Self-Attested Declaration Affidavit',
    nameHi: 'स्वप्रमाणित घोषणा पत्र',
    type: 'Legal Undertaking',
    status: 'missing',
    issuingAuthority: 'Self / Notary Public',
    description: 'Signed affidavit declaring that details submitted are accurate and applicant has not claimed double benefits.',
    descriptionHi: 'हस्ताक्षरित हलफनामा जिसमें घोषणा की गई हो कि प्रस्तुत विवरण सही हैं।'
  },
  {
    id: 'doc-age-proof-senior',
    code: 'age_proof_senior',
    name: 'Senior Citizen Age Proof (60+ Years)',
    nameHi: 'वरिष्ठ नागरिक आयु प्रमाण (60+ वर्ष)',
    type: 'Eligibility Certificate',
    status: 'available',
    issuingAuthority: 'Voter ID Card / Aadhaar / CMO Certificate',
    description: 'Mandatory proof showing applicant has completed 60 years of age for state/central pensions.',
    descriptionHi: 'पेंशन के लिए आवेदक की आयु 60 वर्ष पूरी होने का अनिवार्य प्रमाण।'
  },
  {
    id: 'doc-life-certificate',
    code: 'life_certificate',
    name: 'Annual Digital Life Certificate (Jeevan Pramaan)',
    nameHi: 'वार्षिक जीवन प्रमाण पत्र',
    type: 'Pension Continuity',
    status: 'missing',
    issuingAuthority: 'CSC Centre / Post Office / Jeevan Pramaan App',
    description: 'Biometric life certificate required every November to keep pension disbursals active.',
    descriptionHi: 'पेंशन जारी रखने के लिए प्रतिवर्ष नवंबर में बायोमेट्रिक सत्यापन आवश्यक है।'
  },
  {
    id: 'doc-disability-cert',
    code: 'disability_cert',
    name: 'UDID / CMO Disability Certificate (40%+)',
    nameHi: 'दिव्यांगता प्रमाण पत्र (40%+)',
    type: 'Medical Board Certificate',
    status: 'missing',
    issuingAuthority: 'Chief Medical Officer (CMO), District Hospital',
    relatedServiceId: 'srv-disability-cert',
    description: 'Official medical board assessment certifying 40% or higher disability.',
    descriptionHi: 'मुख्य चिकित्सा अधिकारी (CMO) द्वारा 40% या अधिक दिव्यांगता प्रमाणित करने वाला दस्तावेज।'
  },
  {
    id: 'doc-land-record',
    code: 'land_record',
    name: 'Land Record / Khatauni Copy (Bhulekh)',
    nameHi: 'भूलेख / खतौनी नकल',
    type: 'Agriculture Property Proof',
    status: 'missing',
    issuingAuthority: 'Revenue Department / UP Bhulekh Portal',
    relatedServiceId: 'srv-khatauni',
    description: 'Certified extract of land holding for agricultural schemes like PM-Kisan and crop insurance.',
    descriptionHi: 'पीएम-किसान जैसी कृषि योजनाओं के लिए भूमि स्वामित्व का प्रमाणित अंश।'
  }
];

export const getDocumentByCode = (code: string): DocumentItem | undefined => {
  return ALL_DOCUMENTS.find(d => d.code === code);
};
