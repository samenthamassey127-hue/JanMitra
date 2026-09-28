import { GovernmentService } from '../types';

export const ALL_SERVICES: GovernmentService[] = [
  {
    id: 'srv-income-cert',
    name: 'Income Certificate (Aay Praman Patra)',
    nameHi: 'आय प्रमाण पत्र (उत्तर प्रदेश ई-डिस्ट्रिक्ट)',
    shortDescription: 'Official certificate verifying gross annual household income issued by the Tehsil Revenue Authority.',
    shortDescriptionHi: 'तहसील राजस्व प्राधिकरण द्वारा परिवार की वार्षिक सकल आय सत्यापित करने वाला प्रमाण पत्र।',
    department: 'Revenue Department, Govt of Uttar Pradesh',
    departmentHi: 'राजस्व विभाग, उत्तर प्रदेश सरकार',
    state: 'Uttar Pradesh',
    serviceCategory: 'Certificates & Revenue',
    fees: '₹15 (Official portal charge) / ₹30 (at CSC/Jan Seva Kendra)',
    feesHi: '₹15 (आधिकारिक पोर्टल शुल्क) / ₹30 (जन सेवा केंद्र पर)',
    officialPortal: {
      name: 'UP eDistrict Portal (edistrict.up.gov.in)',
      url: 'https://edistrict.up.gov.in'
    },
    offlineOption: 'Nearest Jan Seva Kendra (CSC) or Tehsil e-Suvidha Kendra',
    offlineOptionHi: 'निकटतम जन सेवा केंद्र (सीएससी) या तहसील ई-सुविधा केंद्र',
    processingTime: '7 to 15 working days (Guaranteed under UP Right to Public Services Act)',
    processingTimeHi: '7 से 15 कार्य दिवस (उत्तर प्रदेश लोक सेवा गारंटी अधिनियम के तहत)',
    requiredDocumentCodes: ['aadhaar', 'self_declaration', 'address_proof', 'bank_passbook'],
    steps: [
      {
        stepNumber: 1,
        title: 'Check Eligibility & Income Limits',
        titleHi: 'पात्रता और आय सीमा की जांच',
        action: 'Ensure all household earning members are accounted for in the self-declaration.',
        actionHi: 'सुनिश्चित करें कि स्व-घोषणा में परिवार के सभी कमाऊ सदस्यों की आय शामिल है।',
        whereToGo: 'JanMitra Document Checklist',
        whereToGoHi: 'जनमित्र दस्तावेज चेकलिस्ट',
        nextConsequence: 'Prevents discrepancies during Lekhpal field inquiry.',
        nextConsequenceHi: 'लेखपाल की स्थलीय जांच के दौरान विसंगतियों से बचाता है।'
      },
      {
        stepNumber: 2,
        title: 'Prepare Required Documents & Photo',
        titleHi: 'आवश्यक दस्तावेज और पासपोर्ट फोटो तैयार करें',
        action: 'Scan Aadhaar card, signed self-declaration form, and passport-size photograph (under 50KB).',
        actionHi: 'आधार कार्ड, हस्ताक्षरित स्व-घोषणा पत्र और पासपोर्ट फोटो स्कैन करें।',
        requiredDocCode: 'aadhaar',
        whereToGo: 'Mobile Scanner or Jan Seva Kendra',
        whereToGoHi: 'मोबाइल स्कैनर या जन सेवा केंद्र',
        nextConsequence: 'Ensures portal upload passes file format validation.',
        nextConsequenceHi: 'पोर्टल पर अपलोड की तकनीकी त्रुटियों को रोकता है।'
      },
      {
        stepNumber: 3,
        title: 'Submit Application on UP eDistrict Citizen Portal',
        titleHi: 'यूपी ई-डिस्ट्रिक्ट पोर्टल पर आवेदन जमा करें',
        action: 'Register/Login at citizen.edistrict.up.gov.in, select "Aay Praman Patra", fill family details, and upload scans.',
        actionHi: 'पोर्टल पर लॉगिन करें, "आय प्रमाण पत्र" चुनें, पारिवारिक विवरण भरें और दस्तावेज अपलोड करें।',
        whereToGo: 'https://edistrict.up.gov.in',
        whereToGoHi: 'https://edistrict.up.gov.in',
        nextConsequence: 'Generates an official 12-digit Application Reference Number for tracking.',
        nextConsequenceHi: 'ट्रैकिंग के लिए 12 अंकों का आधिकारिक आवेदन संदर्भ नंबर प्राप्त होता है।'
      },
      {
        stepNumber: 4,
        title: 'Online Payment of Service Fee (₹15)',
        titleHi: 'सेवा शुल्क (₹15) का ऑनलाइन भुगतान',
        action: 'Complete payment via UPI, Debit Card, or Net Banking on the government treasury gateway.',
        actionHi: 'यूपीआई, डेबिट कार्ड या नेट बैंकिंग के माध्यम से सरकारी गेटवे पर ₹15 का भुगतान करें।',
        whereToGo: 'UP Treasury Payment Gateway',
        whereToGoHi: 'यूपी ट्रेजरी भुगतान गेटवे',
        nextConsequence: 'Application is dispatched automatically to the designated Tehsil Revenue Inspector.',
        nextConsequenceHi: 'आवेदन स्वचालित रूप से संबंधित राजस्व निरीक्षक/तहसील को भेजा जाता है।'
      },
      {
        stepNumber: 5,
        title: 'Tehsil & Lekhpal Field Verification',
        titleHi: 'तहसील व लेखपाल स्थलीय सत्यापन',
        action: 'Local Area Lekhpal conducts physical or telephonic verification of family income and land assets.',
        actionHi: 'क्षेत्रीय लेखपाल परिवार की आय और संपत्ति की जांच कर रिपोर्ट ऑनलाइन दर्ज करता है।',
        whereToGo: 'Handled internally by Tehsil Revenue Officer',
        whereToGoHi: 'तहसील राजस्व अधिकारी द्वारा आंतरिक रूप से संचालित',
        nextConsequence: 'Report submitted directly into the eDistrict portal workflow.',
        nextConsequenceHi: 'रिपोर्ट सीधे पोर्टल पर स्वीकृत/अस्वीकृत की जाती है।'
      },
      {
        stepNumber: 6,
        title: 'Download Digitally Signed Certificate',
        titleHi: 'डिजिटल रूप से हस्ताक्षरित प्रमाण पत्र डाउनलोड करें',
        action: 'Tehsildar approves with digital signature. Download the verified certificate directly from your citizen dashboard.',
        actionHi: 'तहसीलदार डिजिटल हस्ताक्षर द्वारा स्वीकृति देता है। डैशबोर्ड से प्रमाण पत्र डाउनलोड करें।',
        whereToGo: 'UP eDistrict Dashboard or DigiLocker',
        whereToGoHi: 'यूपी ई-डिस्ट्रिक्ट पोर्टल या डिजिलॉकर',
        nextConsequence: 'Valid for 3 consecutive financial years across all scholarship & welfare schemes.',
        nextConsequenceHi: 'सभी छात्रवृत्ति और कल्याणकारी योजनाओं के लिए 3 वित्तीय वर्षों तक मान्य।'
      }
    ],
    officialSource: {
      department: 'Board of Revenue & Department of Information Technology, Govt of Uttar Pradesh',
      title: 'UP eDistrict Citizen Services Compendium (Notification No. 1092/43-2-2015)',
      url: 'https://edistrict.up.gov.in',
      notificationDate: '12 January 2024',
      lastVerified: '15 September 2026',
      excerpt: 'Under the Uttar Pradesh Janhit Guarantee Act, an Income Certificate must be processed by the concerned Tehsildar within 15 working days following verification by the area Lekhpal.'
    }
  },
  {
    id: 'srv-domicile-cert',
    name: 'Domicile / Residence Certificate (Niwas Praman Patra)',
    nameHi: 'निवास प्रमाण पत्र (उत्तर प्रदेश)',
    shortDescription: 'Proof of permanent residence or continuous stay in Uttar Pradesh for at least 3 years.',
    shortDescriptionHi: 'कम से कम 3 वर्षों से उत्तर प्रदेश में स्थायी निवास या निरंतर रहने का कानूनी प्रमाण।',
    department: 'Revenue Department, Govt of Uttar Pradesh',
    departmentHi: 'राजस्व विभाग, उत्तर प्रदेश सरकार',
    state: 'Uttar Pradesh',
    serviceCategory: 'Certificates & Revenue',
    fees: '₹15 (Official portal) / ₹30 (CSC)',
    feesHi: '₹15 (आधिकारिक पोर्टल) / ₹30 (सीएससी)',
    officialPortal: {
      name: 'UP eDistrict Portal',
      url: 'https://edistrict.up.gov.in'
    },
    offlineOption: 'Tehsil SDM Office or Jan Seva Kendra',
    offlineOptionHi: 'तहसील एसडीएम कार्यालय या जन सेवा केंद्र',
    processingTime: '7 to 20 working days',
    processingTimeHi: '7 से 20 कार्य दिवस',
    requiredDocumentCodes: ['aadhaar', 'address_proof', 'marksheet_10', 'self_declaration'],
    steps: [
      {
        stepNumber: 1,
        title: 'Verify Continuity of Residence',
        titleHi: 'निवास की निरंतरता का प्रमाण एकत्र करें',
        action: 'Gather utility bills, schooling proof (10th/12th from UP), or rental agreement covering at least 3 continuous years.',
        actionHi: 'बिजली बिल, उत्तर प्रदेश से स्कूली शिक्षा का प्रमाण, या राशन कार्ड एकत्र करें।',
        whereToGo: 'Personal Records',
        whereToGoHi: 'व्यक्तिगत अभिलेख',
        nextConsequence: 'Prevents objection under domicile eligibility criteria.',
        nextConsequenceHi: 'पात्रता मानदंडों के तहत आपत्ति से बचाता है।'
      },
      {
        stepNumber: 2,
        title: 'Submit Application on UP eDistrict',
        titleHi: 'यूपी ई-डिस्ट्रिक्ट पर आवेदन भरें',
        action: 'Fill applicant address, parental details, duration of stay in village/ward, and upload Aadhaar.',
        actionHi: 'पता, माता-पिता का नाम, वार्ड में रहने की अवधि भरें और आधार अपलोड करें।',
        requiredDocCode: 'aadhaar',
        whereToGo: 'https://edistrict.up.gov.in',
        whereToGoHi: 'https://edistrict.up.gov.in',
        nextConsequence: 'Generates Acknowledgement receipt.',
        nextConsequenceHi: 'पावती रसीद प्राप्त होती है।'
      },
      {
        stepNumber: 3,
        title: 'Sub-Divisional Magistrate (SDM) / Lekhpal Endorsement',
        titleHi: 'एसडीएम / लेखपाल सत्यापन',
        action: 'Local administrative inquiry verifies voter list status or municipal ward records.',
        actionHi: 'स्थानीय प्रशासनिक जांच मतदाता सूची या नगर निकाय रिकॉर्ड की पुष्टि करती है।',
        whereToGo: 'Tehsil Office',
        whereToGoHi: 'तहसील कार्यालय',
        nextConsequence: 'Report submitted to Sub-Divisional Magistrate.',
        nextConsequenceHi: 'रिपोर्ट एसडीएम को प्रस्तुत की जाती है।'
      },
      {
        stepNumber: 4,
        title: 'Receive Digital Niwas Certificate',
        titleHi: 'डिजिटल निवास प्रमाण पत्र प्राप्त करें',
        action: 'Download QR-coded certificate valid for government jobs, scholarships, and land registrations.',
        actionHi: 'क्यूआर कोड वाला प्रमाण पत्र डाउनलोड करें।',
        whereToGo: 'eDistrict Citizen Portal',
        whereToGoHi: 'ई-डिस्ट्रिक्ट पोर्टल',
        nextConsequence: 'Lifetime validity unless permanent residence changes outside UP.',
        nextConsequenceHi: 'आजीवन मान्य जब तक स्थायी पता राज्य से बाहर न बदले।'
      }
    ],
    officialSource: {
      department: 'Department of Revenue, Govt of UP',
      title: 'UP Domicile Verification Rules 2018 (Amended 2023)',
      url: 'https://edistrict.up.gov.in',
      notificationDate: '05 October 2023',
      lastVerified: '12 September 2026',
      excerpt: 'Permanent residence requires 3 years continuous physical presence or ancestral property within the revenue limits of Uttar Pradesh.'
    }
  },
  {
    id: 'srv-caste-cert',
    name: 'Caste Certificate (Jati Praman Patra)',
    nameHi: 'जाति प्रमाण पत्र (ओबीसी / एससी / एसटी)',
    shortDescription: 'Certification of social category (OBC Non-Creamy Layer, SC, ST) for quotas and fee waivers.',
    shortDescriptionHi: 'आरक्षण और शुल्क छूट के लिए सामाजिक श्रेणी (ओबीसी, एससी, एसटी) का प्रमाणीकरण।',
    department: 'Social Welfare Department & Revenue Dept, UP',
    departmentHi: 'समाज कल्याण विभाग एवं राजस्व विभाग, उत्तर प्रदेश',
    state: 'Uttar Pradesh',
    serviceCategory: 'Certificates & Revenue',
    fees: '₹15 (Official portal) / ₹30 (CSC)',
    feesHi: '₹15 (आधिकारिक पोर्टल) / ₹30 (सीएससी)',
    officialPortal: {
      name: 'UP eDistrict',
      url: 'https://edistrict.up.gov.in'
    },
    offlineOption: 'Jan Seva Kendra / Tehsil Office',
    offlineOptionHi: 'जन सेवा केंद्र / तहसील कार्यालय',
    processingTime: '15 to 20 working days',
    processingTimeHi: '15 से 20 कार्य दिवस',
    requiredDocumentCodes: ['aadhaar', 'self_declaration', 'income_cert'],
    steps: [
      {
        stepNumber: 1,
        title: 'Confirm Caste Entry in UP State Gazette',
        titleHi: 'राज्य राजपत्र में जाति सूची की पुष्टि करें',
        action: 'Verify your sub-caste name against the notified list of Backward or Scheduled Classes in UP.',
        actionHi: 'अधिसूचित सूची के अनुसार अपनी उप-जाति का मिलान करें।',
        whereToGo: 'Social Welfare Portal Directory',
        whereToGoHi: 'समाज कल्याण पोर्टल निर्देशिका',
        nextConsequence: 'Ensures correct spelling and classification.',
        nextConsequenceHi: 'सटीक वर्गीकरण सुनिश्चित होता है।'
      },
      {
        stepNumber: 2,
        title: 'Provide Father / Ancestral Caste Proof',
        titleHi: 'पिता या पैतृक जाति प्रमाण प्रस्तुत करें',
        action: 'Attach father’s caste certificate or revenue land record mentioning lineage.',
        actionHi: 'पिता का जाति प्रमाण पत्र या वंशावली राजस्व अभिलेख संलग्न करें।',
        whereToGo: 'UP eDistrict Application Form',
        whereToGoHi: 'ई-डिस्ट्रिक्ट आवेदन पत्र',
        nextConsequence: 'Eliminates rejection risk in lineage verification.',
        nextConsequenceHi: 'वंशावली जांच में अस्वीकृति का जोखिम समाप्त होता है।'
      },
      {
        stepNumber: 3,
        title: 'Tehsildar Approval & Issuance',
        titleHi: 'तहसीलदार द्वारा स्वीकृति एवं निर्गमन',
        action: 'Tehsildar issues digitally signed certificate equipped with verification barcode.',
        actionHi: 'तहसीलदार सत्यापन बारकोड युक्त प्रमाण पत्र जारी करता है।',
        whereToGo: 'eDistrict Citizen Portal',
        whereToGoHi: 'ई-डिस्ट्रिक्ट पोर्टल',
        nextConsequence: 'Enables application to scholarship schemes and competitive entrance waivers.',
        nextConsequenceHi: 'छात्रवृत्ति और प्रवेश परीक्षाओं में शुल्क छूट के लिए मान्य।'
      }
    ],
    officialSource: {
      department: 'Backward Classes Welfare Dept & Social Welfare Dept, UP',
      title: 'UP Reservation and Caste Verification Guidelines',
      url: 'https://edistrict.up.gov.in',
      notificationDate: '18 March 2022',
      lastVerified: '14 September 2026',
      excerpt: 'Caste certificates are issued under the seal of the Tehsildar based on ancestral descent and revenue records.'
    }
  },
  {
    id: 'srv-ration-card',
    name: 'Ration Card Application / Amendment (NFSA)',
    nameHi: 'राशन कार्ड नया आवेदन / संशोधन (राष्ट्रीय खाद्य सुरक्षा)',
    shortDescription: 'Issuance or family member addition to Priority Household (Patra Grihasti) or Antyodaya ration cards.',
    shortDescriptionHi: 'पात्र गृहस्थी या अंत्योदय राशन कार्ड में नया आवेदन या परिवार के सदस्यों को जोड़ना।',
    department: 'Food & Civil Supplies Department, Uttar Pradesh',
    departmentHi: 'खाद्य एवं रसद विभाग, उत्तर प्रदेश',
    state: 'Uttar Pradesh',
    serviceCategory: 'Civil Supplies & Food Security',
    fees: '₹0 (Free government application) / ₹30 at CSC',
    feesHi: '₹0 (निःशुल्क सरकारी आवेदन) / ₹30 जन सेवा केंद्र पर',
    officialPortal: {
      name: 'FCS UP Portal (fcs.up.gov.in)',
      url: 'https://fcs.up.gov.in'
    },
    offlineOption: 'Block Supply Officer (BSO) / District Supply Office (DSO)',
    offlineOptionHi: 'प्रखंड आपूर्ति अधिकारी (BSO) या जिला आपूर्ति कार्यालय',
    processingTime: '30 working days',
    processingTimeHi: '30 कार्य दिवस',
    requiredDocumentCodes: ['aadhaar', 'income_cert', 'bank_passbook', 'address_proof'],
    steps: [
      {
        stepNumber: 1,
        title: 'Family Head & Member Aadhaar Mapping',
        titleHi: 'परिवार के मुखिया और सदस्यों का आधार मिलान',
        action: 'Senior-most female member must be registered as Head of Household (NFSA mandate).',
        actionHi: 'एनएफएसए नियम के अनुसार परिवार की वरिष्ठ महिला को मुखिया बनाना अनिवार्य है।',
        requiredDocCode: 'aadhaar',
        whereToGo: 'FCS Portal Form',
        whereToGoHi: 'खाद्य विभाग पोर्टल फॉर्म',
        nextConsequence: 'Meets mandatory statutory requirement under National Food Security Act.',
        nextConsequenceHi: 'खाद्य सुरक्षा अधिनियम के वैधानिक प्रावधानों को पूरा करता है।'
      },
      {
        stepNumber: 2,
        title: 'Supply Inspector Verification',
        titleHi: 'पूर्ति निरीक्षक द्वारा स्थलीय जांच',
        action: 'Area Supply Inspector validates family income criteria and living conditions.',
        actionHi: 'क्षेत्रीय पूर्ति निरीक्षक पारिवारिक आय और आवास की स्थिति की पुष्टि करता है।',
        whereToGo: 'Local Area Supply Office',
        whereToGoHi: 'स्थानीय आपूर्ति कार्यालय',
        nextConsequence: 'Application approved for inclusion in NFSA beneficiary roster.',
        nextConsequenceHi: 'लाभार्थी सूची में नाम शामिल करने की संस्तुति।'
      },
      {
        stepNumber: 3,
        title: 'Ration Card Allotment & e-Ration Download',
        titleHi: 'राशन कार्ड आवंटन और ई-राशन कार्ड डाउनलोड',
        action: 'Ration card number generated; link to Fair Price Shop (Kotedar) for monthly grain disbursement.',
        actionHi: 'राशन कार्ड नंबर प्राप्त करें और उचित दर विक्रेता (कोटेदार) से मासिक खाद्यान्न प्राप्त करें।',
        whereToGo: 'fcs.up.gov.in / Mera Ration App',
        whereToGoHi: 'fcs.up.gov.in / मेरा राशन मोबाइल ऐप',
        nextConsequence: 'Subsidized rations and priority eligibility for PM-JAY and housing schemes.',
        nextConsequenceHi: 'मुफ्त/रियायती राशन तथा आयुष्मान भारत में पात्रता का आधार।'
      }
    ],
    officialSource: {
      department: 'Department of Food and Civil Supplies, Govt of Uttar Pradesh',
      title: 'Targeted Public Distribution System Guidelines 2024',
      url: 'https://fcs.up.gov.in',
      notificationDate: '10 January 2024',
      lastVerified: '10 September 2026',
      excerpt: 'NFSA criteria in Uttar Pradesh stipulate that urban family annual income must not exceed ₹3,00,000 and rural family annual income must not exceed ₹2,00,000 for Priority Household cards.'
    }
  },
  {
    id: 'srv-disability-cert',
    name: 'CMO Disability Assessment & UDID Card',
    nameHi: 'दिव्यांगता प्रमाण पत्र एवं यूडीआईडी कार्ड',
    shortDescription: 'Medical board assessment establishing 40%+ permanent impairment required for monthly state disability pension.',
    shortDescriptionHi: 'मासिक दिव्यांग पेंशन के लिए मुख्य चिकित्सा अधिकारी (CMO) द्वारा 40% या अधिक दिव्यांगता का प्रमाण।',
    department: 'Department of Empowerment of Persons with Disabilities, UP',
    departmentHi: 'दिव्यांगजन सशक्तिकरण विभाग, उत्तर प्रदेश',
    state: 'Uttar Pradesh',
    serviceCategory: 'Healthcare & Disability Welfare',
    fees: '₹0 (Free medical assessment)',
    feesHi: '₹0 (निःशुल्क चिकित्सीय परीक्षण)',
    officialPortal: {
      name: 'Unique Disability ID Portal (swavlambancard.gov.in)',
      url: 'https://swavlambancard.gov.in'
    },
    offlineOption: 'District Hospital CMO Office (Every Monday & Thursday Medical Board)',
    offlineOptionHi: 'जिला अस्पताल सीएमओ कार्यालय (प्रत्येक सोमवार एवं गुरुवार मेडिकल बोर्ड)',
    processingTime: '21 to 30 days following board assessment',
    processingTimeHi: 'मेडिकल बोर्ड परीक्षण के 21 से 30 दिन बाद',
    requiredDocumentCodes: ['aadhaar', 'address_proof'],
    steps: [
      {
        stepNumber: 1,
        title: 'Online Application on Swavlamban Portal',
        titleHi: 'स्वावलंबन पोर्टल पर ऑनलाइन पंजीकरण',
        action: 'Register personal details, upload photo and ID proof, and select nearest District Hospital.',
        actionHi: 'व्यक्तिगत विवरण दर्ज करें और निकटतम जिला अस्पताल का चयन करें।',
        whereToGo: 'https://swavlambancard.gov.in',
        whereToGoHi: 'https://swavlambancard.gov.in',
        nextConsequence: 'Generates Medical Board appointment slip.',
        nextConsequenceHi: 'मेडिकल बोर्ड परीक्षण के लिए अप्वाइंटमेंट पर्ची मिलती है।'
      },
      {
        stepNumber: 2,
        title: 'Appear before Medical Assessment Board',
        titleHi: 'मेडिकल असेसमेंट बोर्ड के समक्ष उपस्थित होना',
        action: 'Visit District Hospital with clinical diagnosis reports for assessment by specialist doctors.',
        actionHi: 'विशेषज्ञ डॉक्टरों की टीम द्वारा शारीरिक/मानसिक परीक्षण कराएं।',
        whereToGo: 'District Hospital CMO Room',
        whereToGoHi: 'जिला अस्पताल सीएमओ कक्ष',
        nextConsequence: 'Board records exact percentage of impairment in national portal.',
        nextConsequenceHi: 'बोर्ड राष्ट्रीय पोर्टल पर दिव्यांगता का प्रतिशत दर्ज करता है।'
      },
      {
        stepNumber: 3,
        title: 'Receive Digital UDID Card',
        titleHi: 'डिजिटल यूडीआईडी कार्ड प्राप्त करें',
        action: 'Download QR-coded UDID Card; physical smart card delivered by India Post.',
        actionHi: 'क्यूआर कोड वाला स्मार्ट कार्ड डाउनलोड करें।',
        whereToGo: 'Swavlamban Portal / DigiLocker',
        whereToGoHi: 'स्वावलंबन पोर्टल या डिजिलॉकर',
        nextConsequence: 'Unlocks ₹1,000/month UP Divyangjan pension and free UPSRTC bus travel.',
        nextConsequenceHi: '₹1,000/माह पेंशन और राज्य परिवहन बसों में निःशुल्क यात्रा की पात्रता।'
      }
    ],
    officialSource: {
      department: 'Ministry of Social Justice & Empowerment & UP Divyangjan Kalyan Dept',
      title: 'Rights of Persons with Disabilities Rules 2017 & UDID National Guidelines',
      url: 'https://swavlambancard.gov.in',
      notificationDate: '01 July 2021',
      lastVerified: '08 September 2026',
      excerpt: 'A minimum of 40% benchmark disability certified by a notified medical authority is required for welfare entitlements.'
    }
  },
  {
    id: 'srv-khatauni',
    name: 'Certified Land Ownership Extract (Bhulekh Khatauni)',
    nameHi: 'प्रमाणित भूलेख खतौनी नकल (उत्तर प्रदेश)',
    shortDescription: 'Instant digitally verified copy of agricultural land holding ownership used for PM-Kisan & Kisan Credit Card.',
    shortDescriptionHi: 'पीएम-किसान और किसान क्रेडिट कार्ड के लिए कृषि भूमि स्वामित्व की डिजिटल प्रमाणित प्रति।',
    department: 'Revenue Council (Rajasva Parishad), Uttar Pradesh',
    departmentHi: 'राजस्व परिषद, उत्तर प्रदेश',
    state: 'Uttar Pradesh',
    serviceCategory: 'Agriculture & Land Records',
    fees: '₹0 (Free viewing) / ₹15 for certified download',
    feesHi: '₹0 (निःशुल्क देखना) / ₹15 प्रमाणित प्रति डाउनलोड',
    officialPortal: {
      name: 'UP Bhulekh Portal (upbhulekh.gov.in)',
      url: 'https://upbhulekh.gov.in'
    },
    offlineOption: 'Tehsil Computer Room or CSC',
    offlineOptionHi: 'तहसील कंप्यूटर कक्ष या सीएससी',
    processingTime: 'Instant (Real-time online download)',
    processingTimeHi: 'तत्काल (रियल-टाइम ऑनलाइन डाउनलोड)',
    requiredDocumentCodes: ['aadhaar'],
    steps: [
      {
        stepNumber: 1,
        title: 'Locate District, Tehsil, and Village (Gram)',
        titleHi: 'जिला, तहसील और ग्राम का चयन करें',
        action: 'Select revenue village on the UP Bhulekh interactive map.',
        actionHi: 'यूपी भूलेख पोर्टल पर अपने राजस्व ग्राम का चयन करें।',
        whereToGo: 'https://upbhulekh.gov.in',
        whereToGoHi: 'https://upbhulekh.gov.in',
        nextConsequence: 'Opens village plot directory.',
        nextConsequenceHi: 'ग्राम गाटा निर्देशिका खुलती है।'
      },
      {
        stepNumber: 2,
        title: 'Search by Khasra / Gata Number or Landowner Name',
        titleHi: 'खसरा / गाटा संख्या या भूस्वामी के नाम से खोजें',
        action: 'Enter plot number or farmer name in Hindi to display current ownership details.',
        actionHi: 'खसरा नंबर या किसान का नाम दर्ज करें।',
        whereToGo: 'UP Bhulekh Search Box',
        whereToGoHi: 'भूलेख खोज बॉक्स',
        nextConsequence: 'Displays ledger of shares, mortgages, and active co-sharers.',
        nextConsequenceHi: 'भूमि का रकबा और सह-खातेदारों का विवरण प्रदर्शित होता है।'
      },
      {
        stepNumber: 3,
        title: 'Download Certified Real-Time Khatauni',
        titleHi: 'प्रमाणित रियल-टाइम खतौनी डाउनलोड करें',
        action: 'Download QR-coded certified extract for bank loans or PM-Kisan portal eKYC.',
        actionHi: 'बैंक ऋण या पीएम-किसान ई-केवाईसी के लिए प्रमाणित नकल डाउनलोड करें।',
        whereToGo: 'UP Bhulekh Portal',
        whereToGoHi: 'भूलेख पोर्टल',
        nextConsequence: 'Enables direct attachment to PM-Kisan farmer registration.',
        nextConsequenceHi: 'पीएम-किसान पंजीकरण में सीधे संलग्न किया जा सकता है।'
      }
    ],
    officialSource: {
      department: 'Rajasva Parishad Uttar Pradesh',
      title: 'UP Real-Time Khatauni Digital Management System Order',
      url: 'https://upbhulekh.gov.in',
      notificationDate: '15 June 2023',
      lastVerified: '16 September 2026',
      excerpt: 'Certified computerized Khatauni issued via upbhulekh.gov.in has full legal validity under Section 31 of the UP Revenue Code 2006.'
    }
  }
];

export const getServiceById = (id: string): GovernmentService | undefined => {
  return ALL_SERVICES.find(s => s.id === id);
};
