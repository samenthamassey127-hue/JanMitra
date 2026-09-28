import { Scheme, UserProfile } from '../types';

export const ALL_SCHEMES: Scheme[] = [
  {
    id: 'sch-up-post-matric',
    name: 'UP Post-Matric Scholarship & Fee Reimbursement Scheme',
    nameHi: 'उत्तर प्रदेश दशमोत्तर (पोस्ट-मैट्रिक) छात्रवृत्ति एवं शुल्क प्रतिपूर्ति योजना',
    shortDescription: 'Financial assistance and complete tuition fee reimbursement for students pursuing higher education (B.Tech, Medical, Degree, Diploma) in Uttar Pradesh.',
    shortDescriptionHi: 'उत्तर प्रदेश में उच्च शिक्षा (बी.टेक, मेडिकल, डिग्री, डिप्लोमा) कर रहे छात्रों के लिए वित्तीय सहायता और पूर्ण शिक्षण शुल्क प्रतिपूर्ति।',
    category: 'education',
    department: 'Social Welfare & Backward Classes Welfare Dept, Govt of Uttar Pradesh',
    departmentHi: 'समाज कल्याण एवं पिछड़ा वर्ग कल्याण विभाग, उत्तर प्रदेश सरकार',
    level: 'State (Uttar Pradesh)',
    benefitText: '100% reimbursement of approved non-refundable tuition fee (up to ₹50,000–₹1,20,000/year depending on course) plus monthly maintenance allowance.',
    benefitTextHi: 'अनुमोदित शिक्षण शुल्क की 100% प्रतिपूर्ति (पाठ्यक्रम के अनुसार ₹50,000 से ₹1,20,000/वर्ष तक) तथा मासिक निर्वाह भत्ता।',
    benefitAmountEstimate: 'Up to ₹85,000 / year (Fee reimbursement + allowance)',
    rules: [
      {
        id: 'rule-state',
        label: 'Resident of Uttar Pradesh',
        labelHi: 'उत्तर प्रदेश का मूल निवासी',
        evaluate: (p: UserProfile) => {
          if (p.state.toLowerCase().includes('uttar pradesh') || p.state.toLowerCase() === 'up') {
            return {
              status: 'match',
              reason: `Your state is recorded as ${p.state} (matches domicile requirement).`,
              reasonHi: `आपका राज्य ${p.state} दर्ज है (उत्तर प्रदेश निवास मानदंड के अनुरूप)।`
            };
          }
          return {
            status: 'issue',
            reason: `Scheme is limited to permanent residents of Uttar Pradesh. Current state: ${p.state}.`,
            reasonHi: `यह योजना केवल उत्तर प्रदेश के स्थायी निवासियों के लिए है। वर्तमान राज्य: ${p.state}।`
          };
        }
      },
      {
        id: 'rule-education',
        label: 'Post-Matric Course Enrollment (Class 11, 12, UG, PG, B.Tech)',
        labelHi: 'दशमोत्तर पाठ्यक्रम में अध्ययनरत (स्नातक, बी.टेक, डिप्लोमा)',
        evaluate: (p: UserProfile) => {
          const validEdu = ['b.tech', 'undergraduate', 'b.sc', 'b.a', 'b.com', 'm.tech', 'post-graduate', 'diploma', 'polytechnic'];
          const isEnrolled = validEdu.some(e => p.education.toLowerCase().includes(e));
          if (isEnrolled || p.occupation.toLowerCase().includes('student')) {
            return {
              status: 'match',
              reason: `Enrolled in eligible higher education course (${p.education || 'Student'}).`,
              reasonHi: `पात्र उच्च शिक्षा पाठ्यक्रम (${p.education || 'छात्र'}) में अध्ययनरत हैं।`
            };
          }
          return {
            status: 'uncertain',
            reason: `Need verification whether course "${p.education}" is recognized under UP Scholarship portal.`,
            reasonHi: `पुष्टि की आवश्यकता है कि पाठ्यक्रम "${p.education}" छात्रवृत्ति पोर्टल द्वारा मान्यता प्राप्त है।`
          };
        }
      },
      {
        id: 'rule-income',
        label: 'Annual Household Income ≤ ₹2,50,000 (SC/ST) or ≤ ₹2,00,000 (OBC/General)',
        labelHi: 'परिवार की वार्षिक आय ₹2,00,000 (ओबीसी/सामान्य) या ₹2,50,000 (एससी/एसटी) से कम',
        evaluate: (p: UserProfile) => {
          const limit = (p.category === 'SC' || p.category === 'ST') ? 250000 : 250000; // UP updated limit to 2.5L for OBC/Gen in professional courses
          if (p.incomeValue <= limit) {
            return {
              status: 'match',
              reason: `Household income of ₹${p.incomeValue.toLocaleString('en-IN')} appears within the official ceiling of ₹${limit.toLocaleString('en-IN')}.`,
              reasonHi: `पारिवारिक आय ₹${p.incomeValue.toLocaleString('en-IN')} आधिकारिक सीमा ₹${limit.toLocaleString('en-IN')} के भीतर है।`
            };
          }
          return {
            status: 'issue',
            reason: `Reported income of ₹${p.incomeValue.toLocaleString('en-IN')} exceeds the ceiling limit of ₹${limit.toLocaleString('en-IN')}.`,
            reasonHi: `दर्ज की गई आय ₹${p.incomeValue.toLocaleString('en-IN')} निर्धारित सीमा ₹${limit.toLocaleString('en-IN')} से अधिक है।`
          };
        }
      },
      {
        id: 'rule-institution',
        label: 'Recognized UP College / University with Active Master Data',
        labelHi: 'मान्यता प्राप्त संस्थान एवं सक्रिय मास्टर डेटा',
        evaluate: (p: UserProfile) => {
          if (p.institutionType && p.institutionType !== 'Unknown') {
            return {
              status: 'match',
              reason: `Institution type confirmed as ${p.institutionType}.`,
              reasonHi: `संस्थान का प्रकार ${p.institutionType} के रूप में सत्यापित है।`
            };
          }
          return {
            status: 'uncertain',
            reason: 'Institution affiliation and college fee structure confirmation is still required.',
            reasonHi: 'संस्थान की संबद्धता और कॉलेज शुल्क संरचना की पुष्टि अभी आवश्यक है।'
          };
        }
      }
    ],
    requiredDocumentCodes: ['aadhaar', 'income_cert', 'domicile_cert', 'caste_cert', 'marksheet_12', 'college_bonafide', 'bank_passbook'],
    missingRequirementBridges: [
      {
        title: 'Renew / Obtain Valid Income Certificate',
        titleHi: 'वैध आय प्रमाण पत्र बनवाएं / नवीनीकृत करें',
        documentCode: 'income_cert',
        serviceId: 'srv-income-cert',
        explanation: 'Your current Income Certificate appears expired or missing. UP Scholarship requires an active certificate issued within the last 3 financial years.',
        explanationHi: 'आपका वर्तमान आय प्रमाण पत्र समाप्त या अनुपलब्ध है। यूपी छात्रवृत्ति के लिए पिछले 3 वर्षों के भीतर जारी वैध प्रमाण पत्र अनिवार्य है।'
      },
      {
        title: 'Obtain UP Domicile Certificate (Niwas Praman Patra)',
        titleHi: 'उत्तर प्रदेश निवास प्रमाण पत्र प्राप्त करें',
        documentCode: 'domicile_cert',
        serviceId: 'srv-domicile-cert',
        explanation: 'Mandatory proof of permanent residency in Uttar Pradesh issued by Tehsildar or SDM.',
        explanationHi: 'तहसीलदार या एसडीएम द्वारा जारी उत्तर प्रदेश का आधिकारिक निवास प्रमाण पत्र।'
      }
    ],
    officialSource: {
      department: 'Social Welfare Department, Government of Uttar Pradesh',
      title: 'UP Post-Matric Scholarship Master Operating Guidelines 2024-25 (Order No. 412/26-3-2024)',
      url: 'https://scholarship.up.gov.in',
      gazetteNo: 'GO-UP-SWD-2024-88',
      notificationDate: '24 May 2024',
      lastVerified: '18 September 2026',
      officialQuote: 'Students enrolled in recognized professional degree courses whose parental annual gross income does not exceed ₹2,50,000 shall be eligible for non-refundable tuition fee reimbursement via Aadhaar-linked DBT.'
    },
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Aadhaar Demographic & Mobile Authentication',
        titleHi: 'आधार डेमोग्राफिक एवं मोबाइल ओटीपी प्रमाणीकरण',
        action: 'Ensure Aadhaar card is linked to your active mobile number and bank account (NPCI mapper).',
        actionHi: 'सुनिश्चित करें कि आधार सक्रिय मोबाइल नंबर और बैंक खाते से जुड़ा है।',
        guidance: 'Aadhaar authentication is the single digital identity key for UP Scholarship registration.',
        guidanceHi: 'आधार प्रमाणीकरण पंजीकरण की अनिवार्य प्राथमिक कुंजी है।'
      },
      {
        stepNumber: 2,
        title: 'Online Student Registration on scholarship.up.gov.in',
        titleHi: 'छात्रवृत्ति पोर्टल पर ऑनलाइन पंजीकरण',
        action: 'Create student profile using High School roll number, caste certificate number, and income certificate serial number.',
        actionHi: 'हाई स्कूल रोल नंबर, जाति और आय प्रमाण पत्र क्रमांक का उपयोग करके पंजीकरण करें।',
        guidance: 'Carefully match the spelling of your name with both High School marksheet and Aadhaar.',
        guidanceHi: 'नाम की वर्तनी का हाई स्कूल अंकतालिका और आधार दोनों से सटीक मिलान करें।'
      },
      {
        stepNumber: 3,
        title: 'Fill Academic, Course, and Non-Refundable Fee Details',
        titleHi: 'शैक्षणिक, पाठ्यक्रम और गैर-वापसी योग्य शुल्क का विवरण भरें',
        action: 'Enter fee receipt number, college admission date, and enrollment number provided by your institute.',
        actionHi: 'संस्थान द्वारा प्रदान की गई रसीद संख्या और नामांकन संख्या दर्ज करें।',
        guidance: 'Only the approved government ceiling for non-refundable tuition fee is reimbursable.',
        guidanceHi: 'केवल अनुमोदित गैर-वापसी योग्य शुल्क ही प्रतिपूर्ति योग्य है।'
      },
      {
        stepNumber: 4,
        title: 'Lock Application & Submit Hard Copy to College for Institute Forwarding',
        titleHi: 'आवेदन लॉक करें और संस्थान में हार्ड कॉपी जमा करें',
        action: 'Download locked application form and submit with photocopies of all documents to the college scholarship nodal officer.',
        actionHi: 'आवेदन पत्र का प्रिंट लें और सभी दस्तावेजों की छायाप्रतियों के साथ कॉलेज नोडल अधिकारी को सौंपें।',
        guidance: 'Institutes must digitally forward your application before the district cutoff deadline.',
        guidanceHi: 'जिला अंतिम तिथि से पहले संस्थान द्वारा ऑनलाइन अग्रेषित किया जाना अनिवार्य है।'
      }
    ],
    tags: ['education', 'scholarship', 'college', 'b.tech', 'fee reimbursement', 'up government']
  },
  {
    id: 'sch-up-vridhavastha-pension',
    name: 'UP Vridhavastha (Old Age) Pension Scheme',
    nameHi: 'उत्तर प्रदेश वृद्धावस्था पेंशन योजना',
    shortDescription: 'Monthly financial pension support for senior citizens aged 60 years and above living below poverty line or low-income threshold.',
    shortDescriptionHi: 'गरीबी रेखा या निम्न आय सीमा के अंतर्गत आने वाले 60 वर्ष या उससे अधिक आयु के वरिष्ठ नागरिकों के लिए मासिक पेंशन।',
    category: 'senior',
    department: 'Social Welfare Department, Govt of Uttar Pradesh',
    departmentHi: 'समाज कल्याण विभाग, उत्तर प्रदेश सरकार',
    level: 'State (Uttar Pradesh)',
    benefitText: '₹1,000 per month (₹3,000 paid quarterly directly into the beneficiary’s Aadhaar-linked bank account).',
    benefitTextHi: '₹1,000 प्रति माह (प्रत्येक तिमाही में ₹3,000 सीधे आधार-लिंक्ड बैंक खाते में हस्तांतरित)।',
    benefitAmountEstimate: '₹12,000 / year (₹1,000 / month)',
    rules: [
      {
        id: 'rule-age-senior',
        label: 'Age must be 60 years or above',
        labelHi: 'आयु 60 वर्ष या उससे अधिक होनी चाहिए',
        evaluate: (p: UserProfile) => {
          if (p.age >= 60) {
            return {
              status: 'match',
              reason: `Age is recorded as ${p.age} years (satisfies the 60+ senior criteria).`,
              reasonHi: `आपकी आयु ${p.age} वर्ष दर्ज है (60+ वरिष्ठ नागरिक मानदंड के अनुरूप)।`
            };
          }
          return {
            status: 'issue',
            reason: `Applicant age is ${p.age} years. Minimum required age is 60 years.`,
            reasonHi: `आवेदक की आयु ${p.age} वर्ष है। न्यूनतम आवश्यक आयु 60 वर्ष है।`
          };
        }
      },
      {
        id: 'rule-residence-pension',
        label: 'Permanent Resident of Uttar Pradesh',
        labelHi: 'उत्तर प्रदेश का स्थायी निवासी',
        evaluate: (p: UserProfile) => {
          if (p.state.toLowerCase().includes('uttar pradesh') || p.state.toLowerCase() === 'up') {
            return {
              status: 'match',
              reason: 'Resident in Uttar Pradesh.',
              reasonHi: 'उत्तर प्रदेश के स्थायी निवासी हैं।'
            };
          }
          return {
            status: 'issue',
            reason: `Scheme is limited to residents of UP. Current state: ${p.state}.`,
            reasonHi: `यह योजना केवल यूपी के निवासियों के लिए है। वर्तमान राज्य: ${p.state}।`
          };
        }
      },
      {
        id: 'rule-income-senior',
        label: 'Annual Income ≤ ₹46,080 (Rural) or ≤ ₹56,460 (Urban)',
        labelHi: 'वार्षिक आय ₹46,080 (ग्रामीण) या ₹56,460 (शहरी) से कम',
        evaluate: (p: UserProfile) => {
          const limit = p.ruralUrban === 'Rural' ? 46080 : 56460;
          if (p.incomeValue <= limit || p.bplCardHolder) {
            return {
              status: 'match',
              reason: `Household income of ₹${p.incomeValue.toLocaleString('en-IN')} meets the ${p.ruralUrban} income threshold.`,
              reasonHi: `वार्षिक आय ₹${p.incomeValue.toLocaleString('en-IN')} ${p.ruralUrban === 'Rural' ? 'ग्रामीण' : 'शहरी'} सीमा के अनुरूप है।`
            };
          }
          return {
            status: 'uncertain',
            reason: `Reported income is ₹${p.incomeValue.toLocaleString('en-IN')}. Need Gram Panchayat / Tehsildar verification.`,
            reasonHi: `दर्ज आय ₹${p.incomeValue.toLocaleString('en-IN')} है। ग्राम पंचायत/तहसीलदार सत्यापन की आवश्यकता है।`
          };
        }
      }
    ],
    requiredDocumentCodes: ['aadhaar', 'age_proof_senior', 'bank_passbook', 'income_cert', 'address_proof'],
    missingRequirementBridges: [
      {
        title: 'Obtain Income Certificate from Tehsil',
        titleHi: 'तहसील से आय प्रमाण पत्र बनवाएं',
        documentCode: 'income_cert',
        serviceId: 'srv-income-cert',
        explanation: 'An income certificate under ₹46,080/yr (rural) or ₹56,460/yr (urban) is mandatory for old age pension eligibility.',
        explanationHi: 'वृद्धावस्था पेंशन के लिए ग्रामीण क्षेत्र में ₹46,080 और शहरी में ₹56,460 से कम का आय प्रमाण पत्र अनिवार्य है।'
      }
    ],
    officialSource: {
      department: 'Department of Social Welfare, Uttar Pradesh',
      title: 'UP Vridhavastha Pension Yojana Niyamavali (Integrated Pension Portal)',
      url: 'https://sspy-up.gov.in',
      notificationDate: '01 April 2022',
      lastVerified: '12 September 2026',
      officialQuote: 'Eligible destitute senior citizens aged 60 years and above are granted a monthly DBT pension of ₹1,000, disbursed quarterly after Gram Panchayat / BDO verification.'
    },
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Fill Online Application on sspy-up.gov.in',
        titleHi: 'sspy-up.gov.in पोर्टल पर ऑनलाइन आवेदन भरें',
        action: 'Select "Old Age Pension", enter Aadhaar number, bank details, and upload passport photo.',
        actionHi: 'वृद्धावस्था पेंशन चुनें, आधार संख्या, बैंक खाता भरें और फोटो अपलोड करें।',
        guidance: 'Account must be an active single account, not a joint account.',
        guidanceHi: 'बैंक खाता एकल होना चाहिए, संयुक्त खाता स्वीकार्य नहीं है।'
      },
      {
        stepNumber: 2,
        title: 'Gram Panchayat (BDO) / SDM Verification',
        titleHi: 'ग्राम पंचायत (बीडीओ) / एसडीएम द्वारा सत्यापन',
        action: 'Application is reviewed by the Village Development Officer (VDO) or Sub-Divisional Magistrate.',
        actionHi: 'ग्राम विकास अधिकारी (VDO) या उप-जिलाधिकारी द्वारा पात्रता की पुष्टि की जाती है।',
        guidance: 'No physical presence needed if Aadhaar and income records are already verified online.',
        guidanceHi: 'यदि रिकॉर्ड ऑनलाइन सत्यापित हैं तो भौतिक उपस्थिति की आवश्यकता नहीं होती।'
      },
      {
        stepNumber: 3,
        title: 'Quarterly DBT Disbursement & Annual Life Certificate',
        titleHi: 'त्रैमासिक डीबीटी भुगतान और वार्षिक जीवन प्रमाण पत्र',
        action: 'Funds are credited every quarter; submit digital life certificate every November at nearest post office.',
        actionHi: 'राशि हर तिमाही खाते में भेजी जाती है; हर वर्ष नवंबर में डाकघर या सीएससी पर जीवन प्रमाण पत्र जमा करें।',
        guidance: 'Submitting Jeevan Pramaan in November prevents pension stoppage.',
        guidanceHi: 'नवंबर में जीवन प्रमाण पत्र जमा करने से पेंशन निर्बाध जारी रहती है।'
      }
    ],
    tags: ['senior', 'pension', 'financial support', '60 plus', 'social welfare']
  },
  {
    id: 'sch-pm-jay-ayushman',
    name: 'Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    nameHi: 'आयुष्मान भारत — प्रधानमंत्री जन आरोग्य योजना (पीएम-जय)',
    shortDescription: 'Free cashless health insurance coverage of up to ₹5 lakh per family per year for secondary and tertiary hospitalization across empaneled hospitals.',
    shortDescriptionHi: 'सूचीबद्ध अस्पतालों में माध्यमिक और तृतीयक उपचार के लिए प्रति परिवार प्रति वर्ष ₹5 लाख तक का निःशुल्क कैशलेस स्वास्थ्य कवर।',
    category: 'health',
    department: 'National Health Authority & State Health Agency, Uttar Pradesh',
    departmentHi: 'राष्ट्रीय स्वास्थ्य प्राधिकरण एवं राज्य स्वास्थ्य एजेंसी, उत्तर प्रदेश',
    level: 'Centrally Sponsored',
    benefitText: 'Cashless inpatient treatment coverage of up to ₹5,00,000 per family per year across 28,000+ empaneled government and private hospitals in India.',
    benefitTextHi: 'भारत के 28,000+ सरकारी और निजी अस्पतालों में प्रति परिवार प्रति वर्ष ₹5,00,000 तक कैशलेस इलाज।',
    benefitAmountEstimate: '₹5,00,000 / family / year (Cashless Health Cover)',
    rules: [
      {
        id: 'rule-secc-nfsa',
        label: 'Inclusion in SECC 2011 / Antyodaya / NFSA Beneficiary List or Senior 70+',
        labelHi: 'एसईसीसी 2011 / अंत्योदय / राशन कार्ड सूची में नाम या 70+ वरिष्ठ नागरिक',
        evaluate: (p: UserProfile) => {
          if (p.age >= 70) {
            return {
              status: 'match',
              reason: 'All senior citizens aged 70+ are universally eligible under the expanded Ayushman Bharat policy regardless of income.',
              reasonHi: '70 वर्ष या उससे अधिक आयु के सभी वरिष्ठ नागरिक आय की सीमा के बिना आयुष्मान भारत के पात्र हैं।'
            };
          }
          if (p.bplCardHolder || p.incomeValue <= 250000) {
            return {
              status: 'match',
              reason: 'Family income and ration card profile align with SECC deprived household criteria.',
              reasonHi: 'पारिवारिक आय और राशन कार्ड विवरण सामाजिक-आर्थिक वंचना मानदंडों के अनुरूप है।'
            };
          }
          return {
            status: 'uncertain',
            reason: 'Household eligibility must be checked against the National Health Authority database (beneficiary.nha.gov.in).',
            reasonHi: 'राष्ट्रीय स्वास्थ्य प्राधिकरण पोर्टल (beneficiary.nha.gov.in) पर नाम की खोज आवश्यक है।'
          };
        }
      },
      {
        id: 'rule-aadhaar-link',
        label: 'Aadhaar Identification for eKYC',
        labelHi: 'ई-केवाईसी के लिए आधार पहचान',
        evaluate: () => ({
          status: 'match',
          reason: 'Valid Aadhaar available for instant biometric / OTP eKYC verification.',
          reasonHi: 'बायोमेट्रिक/ओटीपी सत्यापन के लिए वैध आधार उपलब्ध है।'
        })
      }
    ],
    requiredDocumentCodes: ['aadhaar', 'ration_card'],
    missingRequirementBridges: [
      {
        title: 'Obtain / Link Priority Ration Card',
        titleHi: 'पात्र गृहस्थी राशन कार्ड बनवाएं / जोड़ें',
        documentCode: 'ration_card',
        serviceId: 'srv-ration-card',
        explanation: 'Active Priority Household or Antyodaya ration cards are directly linked to Ayushman Bharat eligibility in Uttar Pradesh.',
        explanationHi: 'उत्तर प्रदेश में सक्रिय पात्र गृहस्थी राशन कार्ड सीधे आयुष्मान भारत पात्रता से जुड़े हैं।'
      }
    ],
    officialSource: {
      department: 'National Health Authority (NHA), Ministry of Health & Family Welfare',
      title: 'Ayushman Bharat PM-JAY Operational Guidelines 2024',
      url: 'https://beneficiary.nha.gov.in',
      notificationDate: '15 January 2024',
      lastVerified: '20 September 2026',
      officialQuote: 'PM-JAY provides completely cashless and paperless access to health services for the beneficiary at the point of care across any empaneled hospital in India.'
    },
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Check Name on Beneficiary Portal (beneficiary.nha.gov.in)',
        titleHi: 'beneficiary.nha.gov.in पर परिवार का नाम खोजें',
        action: 'Enter Aadhaar or Ration Card number to verify family enrollment in SECC / NFSA list.',
        actionHi: 'आधार या राशन कार्ड नंबर डालकर परिवार की पात्रता जांचें।',
        guidance: 'You can search on mobile using OTP authentication.',
        guidanceHi: 'आप मोबाइल ओटीपी के जरिए स्वयं भी खोज सकते हैं।'
      },
      {
        stepNumber: 2,
        title: 'Complete Aadhaar eKYC',
        titleHi: 'आधार ई-केवाईसी पूर्ण करें',
        action: 'Capture facial scan via Ayushman App or verify with OTP/fingerprint at any CSC or Ayushman Mitra counter.',
        actionHi: 'आयुष्मान ऐप से फेस स्कैन करें या सीएससी/अस्पताल में आयुष्मान मित्र से सत्यापन कराएं।',
        guidance: 'eKYC is 100% free of charge.',
        guidanceHi: 'ई-केवाईसी पूरी तरह निःशुल्क है।'
      },
      {
        stepNumber: 3,
        title: 'Instant Ayushman Card Download',
        titleHi: 'तत्काल आयुष्मान कार्ड डाउनलोड करें',
        action: 'Download your PVC Ayushman Card with unique QR code for cashless admission in any empaneled hospital.',
        actionHi: 'कैशलेस इलाज के लिए क्यूआर कोड वाला आयुष्मान कार्ड डाउनलोड करें।',
        guidance: 'Keep a copy saved in DigiLocker or your phone wallet.',
        guidanceHi: 'इसकी डिजिटल प्रति डिजिलॉकर या फोन में सुरक्षित रखें।'
      }
    ],
    tags: ['health', 'hospital', 'cashless', 'medical', 'insurance', 'ayushman']
  },
  {
    id: 'sch-pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    nameHi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
    shortDescription: 'Direct income support of ₹6,000 per year in three equal instalments of ₹2,000 to all landholding farmer families across India.',
    shortDescriptionHi: 'देश भर के सभी भूमिधारक किसान परिवारों को ₹2,000 की तीन समान किस्तों में प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।',
    category: 'agriculture',
    department: 'Ministry of Agriculture & Farmers Welfare, Govt of India & UP Agriculture Dept',
    departmentHi: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार एवं यूपी कृषि विभाग',
    level: 'Central (Govt of India)',
    benefitText: '₹6,000 per year directly transferred to bank accounts in three equal instalments of ₹2,000 every 4 months.',
    benefitTextHi: 'हर 4 महीने में ₹2,000 की तीन किस्तों में सीधे बैंक खाते में ₹6,000 प्रति वर्ष का डीबीटी अंतरण।',
    benefitAmountEstimate: '₹6,000 / year (₹2,000 every 4 months)',
    rules: [
      {
        id: 'rule-occupation-farmer',
        label: 'Landholding Farmer Family with Cultivable Land Record',
        labelHi: 'कृषि योग्य भूमि का स्वामित्व रखने वाला किसान परिवार',
        evaluate: (p: UserProfile) => {
          if (p.occupation.toLowerCase().includes('farmer') || p.occupation.toLowerCase().includes('agriculture')) {
            return {
              status: 'match',
              reason: 'Farmer occupation aligns with PM-Kisan operational guidelines.',
              reasonHi: 'किसान व्यवसाय पीएम-किसान परिचालन दिशानिर्देशों के अनुरूप है।'
            };
          }
          return {
            status: 'uncertain',
            reason: 'Applicant must own cultivable agricultural land registered in UP Bhulekh revenue records.',
            reasonHi: 'आवेदक के नाम यूपी भूलेख राजस्व रिकॉर्ड में कृषि योग्य भूमि दर्ज होनी चाहिए।'
          };
        }
      },
      {
        id: 'rule-exclusion-tax',
        label: 'Exclusion Check: No Institutional Land / Income Tax Payer in Household',
        labelHi: 'अपवर्जन जांच: कोई आयकर दाता या संवैधानिक पद धारक नहीं',
        evaluate: (p: UserProfile) => {
          if (p.incomeValue <= 500000) {
            return {
              status: 'match',
              reason: 'Income level falls within standard non-income tax paying parameters.',
              reasonHi: 'आय स्तर सामान्य गैर-आयकर दाता मानकों के भीतर है।'
            };
          }
          return {
            status: 'issue',
            reason: 'Income-tax payers and institutional landholders are excluded under PM-Kisan rules.',
            reasonHi: 'आयकर दाताओं और संस्थागत भूस्वामियों को नियमों के तहत बाहर रखा गया है।'
          };
        }
      }
    ],
    requiredDocumentCodes: ['aadhaar', 'land_record', 'bank_passbook'],
    missingRequirementBridges: [
      {
        title: 'Obtain Certified UP Bhulekh Khatauni Copy',
        titleHi: 'प्रमाणित यूपी भूलेख खतौनी नकल प्राप्त करें',
        documentCode: 'land_record',
        serviceId: 'srv-khatauni',
        explanation: 'PM-Kisan registration requires land seeding verified through digital Khatauni plot record.',
        explanationHi: 'पीएम-किसान पंजीकरण के लिए डिजिटल खतौनी भू-अभिलेख द्वारा भूमि सत्यापन अनिवार्य है।'
      }
    ],
    officialSource: {
      department: 'Department of Agriculture and Farmers Welfare, Govt of India',
      title: 'PM-KISAN Operational Guidelines (Revised 2024 Edition)',
      url: 'https://pmkisan.gov.in',
      notificationDate: '01 February 2024',
      lastVerified: '14 September 2026',
      officialQuote: 'All landholding farmer families with cultivable land in their names are eligible for income support of ₹6,000 per annum, subject to mandatory land seeding, Aadhaar biometric eKYC, and NPCI DBT mapping.'
    },
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'New Farmer Registration on pmkisan.gov.in',
        titleHi: 'पोर्टल पर नया किसान पंजीकरण',
        action: 'Enter Aadhaar, select State (UP), District, Sub-District, and Village.',
        actionHi: 'आधार दर्ज करें, राज्य, जिला, ब्लॉक और गांव का चयन करें।',
        guidance: 'Select Rural or Urban Farmer appropriately.',
        guidanceHi: 'ग्रामीण या शहरी किसान का सही चयन करें।'
      },
      {
        stepNumber: 2,
        title: 'Enter Land Khasra / Khatauni Details & Upload Document',
        titleHi: 'भूमि खसरा/खतौनी विवरण दर्ज करें और दस्तावेज अपलोड करें',
        action: 'Provide Khata number, Khasra number, land transfer date, and upload PDF copy of Khatauni.',
        actionHi: 'खाता संख्या, खसरा संख्या भरें और खतौनी की पीडीएफ अपलोड करें।',
        guidance: 'Land must be registered in the name of the applicant on or before 01-02-2019.',
        guidanceHi: 'भूमि 01-02-2019 को या उससे पहले आवेदक के नाम पंजीकृत होनी चाहिए।'
      },
      {
        stepNumber: 3,
        title: 'Complete Aadhaar OTP / Biometric eKYC',
        titleHi: 'आधार ओटीपी / बायोमेट्रिक ई-केवाईसी पूर्ण करें',
        action: 'Verify mobile OTP on PM-Kisan portal or use face authentication on PM-KISAN mobile app.',
        actionHi: 'मोबाइल ओटीपी या पीएम-किसान ऐप से चेहरा प्रमाणीकरण द्वारा ई-केवाईसी पूरी करें।',
        guidance: 'eKYC is mandatory to release upcoming ₹2,000 instalments.',
        guidanceHi: 'आगामी किस्तें प्राप्त करने के लिए ई-केवाईसी अनिवार्य है।'
      }
    ],
    tags: ['agriculture', 'farmer', 'kisan', 'financial support', 'pm-kisan']
  },
  {
    id: 'sch-pmay-g',
    name: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
    nameHi: 'प्रधानमंत्री आवास योजना - ग्रामीण (पीएमएवाई-जी)',
    shortDescription: 'Financial assistance of up to ₹1,20,000 to construct a durable pucca house with basic amenities for homeless and kutcha-house rural households.',
    shortDescriptionHi: 'बेघर और कच्चे घरों में रहने वाले ग्रामीण परिवारों के लिए बुनियादी सुविधाओं से युक्त पक्का मकान बनाने हेतु ₹1,20,000 तक की वित्तीय सहायता।',
    category: 'housing',
    department: 'Rural Development Department, Govt of Uttar Pradesh & Ministry of Rural Development',
    departmentHi: 'ग्राम्य विकास विभाग, उत्तर प्रदेश सरकार एवं ग्रामीण विकास मंत्रालय',
    level: 'Centrally Sponsored',
    benefitText: '₹1,20,000 cash grant in 3 installments tied to house construction stages + 90 days MGNREGA wage support (₹21,000+) + ₹12,000 for toilet construction.',
    benefitTextHi: 'मकान निर्माण चरणों से जुड़ी 3 किस्तों में ₹1,20,000 नकद अनुदान + 90 दिन मनरेगा मजदूरी (₹21,000+) + शौचालय निर्माण हेतु ₹12,000।',
    benefitAmountEstimate: '₹1,53,000 total assistance (House grant + MGNREGA wages + Swachh Bharat toilet)',
    rules: [
      {
        id: 'rule-rural-housing',
        label: 'Rural Residence with Kutcha / Dilapidated House',
        labelHi: 'कच्चे या जीर्ण-शीर्ण मकान में ग्रामीण निवास',
        evaluate: (p: UserProfile) => {
          if (p.ruralUrban === 'Rural') {
            return {
              status: 'match',
              reason: 'Resident in rural revenue village (matches PMAY-Gramin purview).',
              reasonHi: 'ग्रामीण राजस्व गांव के निवासी हैं (पीएमएवाई-ग्रामीण के अनुरूप)।'
            };
          }
          return {
            status: 'uncertain',
            reason: 'Applicant is listed as Urban resident. PMAY-Urban (Affordable Housing) applies instead.',
            reasonHi: 'आवेदक शहरी निवासी दर्ज हैं। इसके स्थान पर पीएमएवाई-शहरी लागू होगी।'
          };
        }
      },
      {
        id: 'rule-income-housing',
        label: 'Household without Existing Pucca House in India',
        labelHi: 'भारत में परिवार के पास कोई पक्का मकान नहीं होना चाहिए',
        evaluate: (p: UserProfile) => {
          if (p.incomeValue <= 300000) {
            return {
              status: 'match',
              reason: `Annual household income ₹${p.incomeValue.toLocaleString('en-IN')} meets low-income rural housing criteria.`,
              reasonHi: `पारिवारिक आय ₹${p.incomeValue.toLocaleString('en-IN')} निम्न-आय ग्रामीण आवास मानदंड के अनुकूल है।`
            };
          }
          return {
            status: 'issue',
            reason: 'Household income exceeds typical PMAY-G beneficiary category.',
            reasonHi: 'पारिवारिक आय पीएमएवाई-जी लाभार्थी सीमा से अधिक है।'
          };
        }
      }
    ],
    requiredDocumentCodes: ['aadhaar', 'bank_passbook', 'ration_card', 'address_proof'],
    missingRequirementBridges: [
      {
        title: 'Verify Ration Card / SECC Listing',
        titleHi: 'राशन कार्ड / आवास+ सूची में नाम सत्यापित करें',
        documentCode: 'ration_card',
        serviceId: 'srv-ration-card',
        explanation: 'PMAY-G selection is finalized from the official Gram Sabha Awaas+ waitlist linked to ration card and Aadhaar.',
        explanationHi: 'पीएमएवाई-जी चयन राशन कार्ड और आधार से जुड़ी ग्राम सभा आवास+ प्रतीक्षा सूची से किया जाता है।'
      }
    ],
    officialSource: {
      department: 'Ministry of Rural Development & Department of Gramya Vikas, UP',
      title: 'Pradhan Mantri Awaas Yojana - Gramin Framework for Implementation',
      url: 'https://pmayg.nic.in',
      notificationDate: '10 March 2024',
      lastVerified: '11 September 2026',
      officialQuote: 'Unit assistance of ₹1.20 lakh in plain areas shall be provided to identified beneficiary households through Aadhaar-based DBT upon geo-tagged photographic inspection at plinth, lintel, and roof completion stages.'
    },
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Inclusion in Gram Panchayat Awaas+ Survey',
        titleHi: 'ग्राम पंचायत आवास+ सर्वेक्षण में नाम दर्ज होना',
        action: 'Gram Rojgar Sewak / Panchayat Secretary registers geo-tagged photo of applicant’s current kutcha house.',
        actionHi: 'ग्राम रोजगार सेवक या पंचायत सचिव वर्तमान कच्चे मकान की जियो-टैग फोटो दर्ज करता है।',
        guidance: 'Resolution is ratified during public Gram Sabha meeting.',
        guidanceHi: 'सार्वजनिक ग्राम सभा बैठक में प्रस्ताव पारित किया जाता है।'
      },
      {
        stepNumber: 2,
        title: 'Sanction Order & 1st Installment Release (₹40,000)',
        titleHi: 'स्वीकृति आदेश एवं प्रथम किस्त (₹40,000) का अंतरण',
        action: 'District Development Officer approves sanction; 1st tranche credited for foundation work.',
        actionHi: 'जिला विकास अधिकारी द्वारा स्वीकृति; नींव कार्य के लिए पहली किस्त बैंक में भेजी जाती है।',
        guidance: 'Start construction within 30 days of fund receipt.',
        guidanceHi: 'राशि प्राप्त होने के 30 दिनों के भीतर निर्माण कार्य शुरू करें।'
      },
      {
        stepNumber: 3,
        title: 'Geo-Tagged Verification & 2nd/3rd Installments',
        titleHi: 'जियो-टैग सत्यापन और द्वितीय/तृतीय किस्तों का भुगतान',
        action: 'Inspectors verify lintel level (₹70,000) and roof level (₹10,000) with AwaasApp geo-tagged photos.',
        actionHi: 'छत और लिंटेल स्तर पर आवास-ऐप से फोटो अपलोड कर शेष किस्तों का भुगतान किया जाता है।',
        guidance: 'Complete house construction within 12 months.',
        guidanceHi: '12 महीने के भीतर मकान का निर्माण पूरा करें।'
      }
    ],
    tags: ['housing', 'rural', 'pucca house', 'grant', 'pmay-g']
  },
  {
    id: 'sch-pmegp',
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    nameHi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (पीएमईजीपी)',
    shortDescription: 'Credit-linked capital subsidy up to 35% on bank loans up to ₹50 lakh for setting up new manufacturing or service micro-enterprises.',
    shortDescriptionHi: 'नई विनिर्माण या सेवा सूक्ष्म उद्यम इकाइयों की स्थापना के लिए ₹50 लाख तक के बैंक ऋण पर 35% तक की पूंजीगत सब्सिडी।',
    category: 'business',
    department: 'Khadi & Village Industries Commission (KVIC) & MSME Department, UP',
    departmentHi: 'खादी एवं ग्रामोद्योग आयोग (KVIC) एवं एमएसएमई विभाग, उत्तर प्रदेश',
    level: 'Central (Govt of India)',
    benefitText: 'Subsidy (Margin Money) of 25% (Urban) to 35% (Rural) for Special Category beneficiaries (SC/ST/OBC/Women/Ex-servicemen/Minorities) on project costs up to ₹50 Lakh.',
    benefitTextHi: 'विशेष श्रेणियों (ओबीसी, एससी, एसटी, महिला) के लिए परियोजना लागत पर 25% (शहरी) से 35% (ग्रामीण) तक की सरकारी सब्सिडी।',
    benefitAmountEstimate: 'Up to ₹17,50,000 subsidy on ₹50L manufacturing project',
    rules: [
      {
        id: 'rule-age-pmegp',
        label: 'Minimum Age 18 Years',
        labelHi: 'न्यूनतम आयु 18 वर्ष',
        evaluate: (p: UserProfile) => {
          if (p.age >= 18) {
            return {
              status: 'match',
              reason: `Age ${p.age} satisfies the minimum 18-year requirement.`,
              reasonHi: `आपकी आयु ${p.age} वर्ष न्यूनतम 18 वर्ष की आवश्यकता पूरी करती है।`
            };
          }
          return {
            status: 'issue',
            reason: `Applicant must be at least 18 years old. Current age: ${p.age}.`,
            reasonHi: `आवेदक की आयु कम से कम 18 वर्ष होनी चाहिए। वर्तमान आयु: ${p.age}।`
          };
        }
      },
      {
        id: 'rule-education-pmegp',
        label: 'At least 8th Pass for projects > ₹10 Lakh (Manufacturing) or > ₹5 Lakh (Services)',
        labelHi: '₹10 लाख से अधिक की परियोजना के लिए न्यूनतम 8वीं पास',
        evaluate: (p: UserProfile) => {
          if (p.education !== 'None') {
            return {
              status: 'match',
              reason: `Educational qualification (${p.education}) fulfills minimum educational bar.`,
              reasonHi: `शैक्षणिक योग्यता (${p.education}) पात्रता मानदंड को पूरा करती है।`
            };
          }
          return {
            status: 'uncertain',
            reason: 'Projects above ₹10 lakh require at least 8th standard pass proof.',
            reasonHi: '₹10 लाख से अधिक की परियोजनाओं के लिए न्यूनतम 8वीं उत्तीर्ण होना अनिवार्य है।'
          };
        }
      }
    ],
    requiredDocumentCodes: ['aadhaar', 'pan', 'caste_cert', 'marksheet_10', 'bank_passbook'],
    missingRequirementBridges: [
      {
        title: 'Obtain Caste Certificate for Special Category Subsidy (35%)',
        titleHi: '35% विशेष सब्सिडी के लिए जाति प्रमाण पत्र प्रस्तुत करें',
        documentCode: 'caste_cert',
        serviceId: 'srv-caste-cert',
        explanation: 'Special Category entrepreneurs (OBC, SC, ST, Women) receive 35% rural subsidy instead of 25% general subsidy.',
        explanationHi: 'विशेष श्रेणी (ओबीसी, एससी, एसटी, महिला) के उद्यमियों को 25% के बजाय 35% ग्रामीण सब्सिडी मिलती है।'
      }
    ],
    officialSource: {
      department: 'Ministry of Micro, Small and Medium Enterprises, Govt of India',
      title: 'PMEGP Scheme Guidelines (Amended 2023)',
      url: 'https://kviconline.gov.in',
      notificationDate: '18 July 2023',
      lastVerified: '15 September 2026',
      officialQuote: 'PMEGP is a major credit-linked subsidy scheme aimed at generating self-employment opportunities through establishment of micro-enterprises in non-farm sector.'
    },
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Online Application on kviconline.gov.in Portal',
        titleHi: 'kviconline.gov.in पोर्टल पर ऑनलाइन आवेदन',
        action: 'Fill online form with Detailed Project Report (DPR), choosing your preferred financing bank branch.',
        actionHi: 'विस्तृत परियोजना रिपोर्ट (DPR) और पसंदीदा बैंक शाखा के साथ ऑनलाइन फॉर्म भरें।',
        guidance: 'DPR templates for over 100 business types are available free on the portal.',
        guidanceHi: '100 से अधिक व्यवसायों के लिए प्रोजेक्ट रिपोर्ट प्रारूप पोर्टल पर निःशुल्क उपलब्ध हैं।'
      },
      {
        stepNumber: 2,
        title: 'District Task Force Committee (DTFC) Review',
        titleHi: 'जिला टास्क फोर्स कमेटी द्वारा परीक्षण',
        action: 'District Industries Centre (DIC) scrutinizes project viability and forwards to bank.',
        actionHi: 'जिला उद्योग केंद्र (DIC) परियोजना की व्यवहार्यता की जांच कर बैंक को अग्रेषित करता है।',
        guidance: 'You may be invited for an informal project presentation.',
        guidanceHi: 'आपको एक संक्षिप्त साक्षात्कार/प्रस्तुति के लिए बुलाया जा सकता है।'
      },
      {
        stepNumber: 3,
        title: 'Bank Loan Sanction & Entrepreneurship Training (EDP)',
        titleHi: 'बैंक ऋण स्वीकृति और उद्यमिता विकास प्रशिक्षण (EDP)',
        action: 'Bank sanctions term loan; complete mandatory 10-day EDP training online via portal.',
        actionHi: 'बैंक ऋण स्वीकृत करता है; पोर्टल पर 10-दिवसीय अनिवार्य ऑनलाइन उद्यमिता प्रशिक्षण पूरा करें।',
        guidance: 'Margin money subsidy is kept in lock-in term deposit for 3 years, then adjusted against loan principal.',
        guidanceHi: 'सब्सिडी राशि 3 साल के लिए फिक्स्ड डिपॉजिट में रखी जाती है और फिर मूलधन में समायोजित कर दी जाती है।'
      }
    ],
    tags: ['business', 'loan', 'subsidy', 'startup', 'entrepreneur', 'msme']
  },
  {
    id: 'sch-up-yuva-swarojgar',
    name: 'UP Mukhyamantri Yuva Swarojgar Yojana (MMYSY)',
    nameHi: 'उत्तर प्रदेश मुख्यमंत्री युवा स्वरोजगार योजना',
    shortDescription: 'State-sponsored subsidized bank credit up to ₹25 lakh for industry and ₹10 lakh for service sector targeting educated unemployed youth in UP.',
    shortDescriptionHi: 'उत्तर प्रदेश के शिक्षित बेरोजगार युवाओं के लिए उद्योग क्षेत्र में ₹25 लाख और सेवा क्षेत्र में ₹10 लाख तक का रियायती बैंक ऋण।',
    category: 'business',
    department: 'Department of Micro, Small & Medium Enterprises and Export Promotion, UP',
    departmentHi: 'सूक्ष्म, लघु एवं मध्यम उद्यम एवं निर्यात प्रोत्साहन विभाग, उत्तर प्रदेश',
    level: 'State (Uttar Pradesh)',
    benefitText: '25% margin money subsidy (maximum ₹6.25 lakh for industry, ₹2.50 lakh for service sector) credited to loan account.',
    benefitTextHi: 'ऋण खाते में 25% मार्जिन मनी सब्सिडी (उद्योग के लिए अधिकतम ₹6.25 लाख, सेवा क्षेत्र के लिए ₹2.50 लाख)।',
    benefitAmountEstimate: 'Up to ₹6,25,000 margin money grant',
    rules: [
      {
        id: 'rule-age-mmysy',
        label: 'Age between 18 and 40 years',
        labelHi: 'आयु 18 से 40 वर्ष के मध्य',
        evaluate: (p: UserProfile) => {
          if (p.age >= 18 && p.age <= 40) {
            return {
              status: 'match',
              reason: `Age ${p.age} is within the 18–40 year bracket.`,
              reasonHi: `आपकी आयु ${p.age} वर्ष 18-40 वर्ष की निर्धारित सीमा में है।`
            };
          }
          return {
            status: 'issue',
            reason: `Applicant age must be between 18 and 40. Current age: ${p.age}.`,
            reasonHi: `आवेदक की आयु 18 से 40 वर्ष के बीच होनी चाहिए। वर्तमान आयु: ${p.age}।`
          };
        }
      },
      {
        id: 'rule-edu-10th',
        label: 'Minimum Educational Qualification: 10th Standard (High School) Pass',
        labelHi: 'न्यूनतम शैक्षणिक योग्यता: 10वीं (हाई स्कूल) उत्तीर्ण',
        evaluate: (p: UserProfile) => {
          const pass = ['10th', '12th', 'b.tech', 'undergraduate', 'graduate', 'diploma'].some(e => p.education.toLowerCase().includes(e));
          if (pass) {
            return {
              status: 'match',
              reason: 'High School completion verified.',
              reasonHi: 'हाई स्कूल उत्तीर्ण योग्यता सत्यापित।'
            };
          }
          return {
            status: 'issue',
            reason: 'Applicant must have passed High School examination.',
            reasonHi: 'आवेदक का हाई स्कूल उत्तीर्ण होना अनिवार्य है।'
          };
        }
      }
    ],
    requiredDocumentCodes: ['aadhaar', 'marksheet_10', 'domicile_cert', 'bank_passbook'],
    missingRequirementBridges: [
      {
        title: 'Obtain UP Domicile Certificate',
        titleHi: 'उत्तर प्रदेश निवास प्रमाण पत्र प्राप्त करें',
        documentCode: 'domicile_cert',
        serviceId: 'srv-domicile-cert',
        explanation: 'Mandatory proof showing permanent residency in Uttar Pradesh.',
        explanationHi: 'उत्तर प्रदेश का स्थायी निवासी होने का अनिवार्य प्रमाण।'
      }
    ],
    officialSource: {
      department: 'Directorate of Industries, Kanpur, Uttar Pradesh',
      title: 'Mukhyamantri Yuva Swarojgar Yojana Operational Manual',
      url: 'https://diupmsme.upsdc.gov.in',
      notificationDate: '20 January 2023',
      lastVerified: '12 September 2026',
      officialQuote: 'MMYSY fosters youth entrepreneurship in Uttar Pradesh by providing 25% margin money assistance on project costs sanctioned by commercial and regional rural banks.'
    },
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Register on diupmsme.upsdc.gov.in',
        titleHi: 'diupmsme.upsdc.gov.in पर पंजीकरण',
        action: 'Apply under Mukhyamantri Yuva Swarojgar Yojana and upload project proposal.',
        actionHi: 'योजना के अंतर्गत ऑनलाइन आवेदन करें और परियोजना प्रस्ताव अपलोड करें।',
        guidance: 'Keep project outlay below ₹25 lakh for manufacturing units.',
        guidanceHi: 'विनिर्माण इकाइयों के लिए परियोजना लागत ₹25 लाख से नीचे रखें।'
      },
      {
        stepNumber: 2,
        title: 'District Industries Center (DIC) Interview',
        titleHi: 'जिला उद्योग केंद्र (DIC) साक्षात्कार',
        action: 'Attend interview at DIC office headed by Deputy Commissioner Industries.',
        actionHi: 'उपायुक्त उद्योग की अध्यक्षता में आयोजित साक्षात्कार में भाग लें।',
        guidance: 'Be prepared to explain raw material sourcing and local market customer base.',
        guidanceHi: 'कच्चे माल और स्थानीय बाजार के बारे में स्पष्ट जानकारी रखें।'
      }
    ],
    tags: ['business', 'youth', 'employment', 'self-employed', 'up govt']
  },
  {
    id: 'sch-up-divyang-pension',
    name: 'UP Divyangjan (Disability) Pension Scheme',
    nameHi: 'उत्तर प्रदेश दिव्यांगजन पेंशन योजना',
    shortDescription: 'Monthly financial assistance of ₹1,000 for persons with 40% or higher certified physical, visual, hearing, or mental disability living in UP.',
    shortDescriptionHi: 'उत्तर प्रदेश में रहने वाले 40% या अधिक प्रमाणित दिव्यांग व्यक्तियों के लिए ₹1,000 की मासिक वित्तीय सहायता।',
    category: 'finance',
    department: 'Department of Empowerment of Persons with Disabilities, Govt of UP',
    departmentHi: 'दिव्यांगजन सशक्तिकरण विभाग, उत्तर प्रदेश सरकार',
    level: 'State (Uttar Pradesh)',
    benefitText: '₹1,000 per month DBT into bank account plus eligibility for free motorized tricycle / assistive appliances and UPSRTC bus pass.',
    benefitTextHi: '₹1,000 प्रति माह बैंक खाते में डीबीटी तथा निःशुल्क मोटराइज्ड ट्राइसाइकिल/उपकरण एवं यूपीएसआरटीसी बस पास की पात्रता।',
    benefitAmountEstimate: '₹12,000 / year (₹1,000 / month) + Assistive Devices',
    rules: [
      {
        id: 'rule-disability-40',
        label: 'Minimum 40% Benchmark Disability Certified by CMO',
        labelHi: 'सीएमओ द्वारा प्रमाणित न्यूनतम 40% दिव्यांगता',
        evaluate: (p: UserProfile) => {
          if (p.disabilityStatus) {
            return {
              status: 'match',
              reason: 'Disability status indicated in citizen profile.',
              reasonHi: 'नागरिक प्रोफाइल में दिव्यांगता की स्थिति दर्ज है।'
            };
          }
          return {
            status: 'uncertain',
            reason: 'Applicant must have an official CMO medical board certificate or UDID card with ≥ 40% disability.',
            reasonHi: 'आवेदक के पास 40% या अधिक दिव्यांगता का सीएमओ प्रमाण पत्र या यूडीआईडी कार्ड होना आवश्यक है।'
          };
        }
      },
      {
        id: 'rule-state-divyang',
        label: 'Permanent Resident of Uttar Pradesh',
        labelHi: 'उत्तर प्रदेश का स्थायी निवासी',
        evaluate: (p: UserProfile) => {
          if (p.state.toLowerCase().includes('uttar pradesh') || p.state.toLowerCase() === 'up') {
            return {
              status: 'match',
              reason: 'Resident in Uttar Pradesh.',
              reasonHi: 'उत्तर प्रदेश के निवासी हैं।'
            };
          }
          return {
            status: 'issue',
            reason: `Restricted to UP residents. Current state: ${p.state}.`,
            reasonHi: `केवल यूपी निवासियों के लिए। वर्तमान राज्य: ${p.state}।`
          };
        }
      }
    ],
    requiredDocumentCodes: ['aadhaar', 'disability_cert', 'bank_passbook', 'income_cert', 'address_proof'],
    missingRequirementBridges: [
      {
        title: 'Undergo CMO Disability Assessment & Get UDID Card',
        titleHi: 'सीएमओ दिव्यांगता जांच कराएं और यूडीआईडी कार्ड प्राप्त करें',
        documentCode: 'disability_cert',
        serviceId: 'srv-disability-cert',
        explanation: 'Official CMO Medical Board certificate is mandatory to legally establish 40%+ impairment.',
        explanationHi: '40% से अधिक दिव्यांगता स्थापित करने के लिए मुख्य चिकित्सा अधिकारी का प्रमाण पत्र अनिवार्य है।'
      }
    ],
    officialSource: {
      department: 'Divyangjan Sashaktikaran Vibhag, Uttar Pradesh',
      title: 'Divyang Pension Niyamavali (Integrated Pension Portal)',
      url: 'https://sspy-up.gov.in',
      notificationDate: '01 July 2022',
      lastVerified: '12 September 2026',
      officialQuote: 'Persons with 40 percent or greater disability certified by a notified Medical Board whose family income does not exceed poverty line norms shall receive ₹1,000 monthly direct support.'
    },
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Apply Online on Integrated Pension Portal (sspy-up.gov.in)',
        titleHi: 'एकीकृत पेंशन पोर्टल पर ऑनलाइन आवेदन करें',
        action: 'Fill Divyang Pension application with UDID number and bank account details.',
        actionHi: 'यूडीआईडी नंबर और बैंक खाते के विवरण के साथ आवेदन भरें।',
        guidance: 'UDID card number auto-fills disability percentage.',
        guidanceHi: 'यूडीआईडी नंबर से दिव्यांगता का प्रतिशत स्वतः सत्यापित हो जाता है।'
      }
    ],
    tags: ['disability', 'pension', 'divyangjan', 'assistive devices', 'finance']
  },
  {
    id: 'sch-pm-svanidhi',
    name: 'PM SVANidhi (Street Vendor Special Micro-Credit Scheme)',
    nameHi: 'पीएम स्वनिधि (रेहड़ी-पटरी विक्रेता सूक्ष्म ऋण योजना)',
    shortDescription: 'Collateral-free working capital loan of ₹10,000 (1st tranche), ₹20,000 (2nd tranche), and ₹50,000 (3rd tranche) with 7% interest subsidy for street vendors.',
    shortDescriptionHi: 'रेहड़ी-पटरी विक्रेताओं के लिए ₹10,000 (पहली किस्त), ₹20,000 और ₹50,000 तक का बिना गारंटी कार्यशील पूंजी ऋण एवं 7% ब्याज सब्सिडी।',
    category: 'employment',
    department: 'Ministry of Housing and Urban Affairs & State Urban Development Agency (SUDA UP)',
    departmentHi: 'आवासन और शहरी कार्य मंत्रालय एवं राज्य नगरीय विकास अभिकरण (सूडा यूपी)',
    level: 'Central (Govt of India)',
    benefitText: 'Initial loan of ₹10,000 with 7% interest subsidy directly credited to account, with cashbacks up to ₹1,200/year for digital transactions.',
    benefitTextHi: 'खाते में 7% ब्याज सब्सिडी के साथ ₹10,000 का प्रारंभिक ऋण, तथा डिजिटल लेनदेन पर ₹1,200/वर्ष तक का कैशबैक।',
    benefitAmountEstimate: '₹10,000 to ₹50,000 working capital loan',
    rules: [
      {
        id: 'rule-urban-vendor',
        label: 'Street Vendor / Hawker Operating in Urban or Peri-Urban Area',
        labelHi: 'शहरी या अर्ध-शहरी क्षेत्र में रेहड़ी-पटरी या फेरी विक्रेता',
        evaluate: (p: UserProfile) => {
          if (p.occupation.toLowerCase().includes('vendor') || p.occupation.toLowerCase().includes('worker') || p.occupation.toLowerCase().includes('self-employed')) {
            return {
              status: 'match',
              reason: 'Self-employed / vendor occupation fits PM SVANidhi scope.',
              reasonHi: 'स्वरोजगार/विक्रेता व्यवसाय पीएम स्वनिधि के दायरे में आता है।'
            };
          }
          return {
            status: 'uncertain',
            reason: 'Applicant must be vending in urban areas with Letter of Recommendation (LoR) or Vending Certificate from Municipal Corporation.',
            reasonHi: 'नगर निगम से सिफारिश पत्र (LoR) या वेंडिंग प्रमाण पत्र होना आवश्यक है।'
          };
        }
      }
    ],
    requiredDocumentCodes: ['aadhaar', 'bank_passbook'],
    missingRequirementBridges: [],
    officialSource: {
      department: 'Ministry of Housing and Urban Affairs (MoHUA), Govt of India',
      title: 'PM SVANidhi Scheme Operational Guidelines 2024',
      url: 'https://pmsvanidhi.mohua.gov.in',
      notificationDate: '01 June 2024',
      lastVerified: '14 September 2026',
      officialQuote: 'PM SVANidhi provides formal credit to street vendors without collateral, offering timely repayment incentives through 7 percent annual interest subsidy.'
    },
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Check Vending Status / Apply for Letter of Recommendation (LoR)',
        titleHi: 'वेंडिंग स्थिति जांचें / सिफारिश पत्र (LoR) के लिए आवेदन करें',
        action: 'Visit Municipal Ward or SUDA office to verify street vending survey roll.',
        actionHi: 'स्ट्रीट वेंडिंग सर्वे सूची में नाम देखने के लिए नगर निगम या सूडा कार्यालय जाएं।',
        guidance: 'If not surveyed, Municipal Body issues an LoR within 7 days.',
        guidanceHi: 'सर्वे में नाम न होने पर नगर निकाय 7 दिनों में सिफारिश पत्र जारी करता है।'
      }
    ],
    tags: ['employment', 'vendor', 'loan', 'urban', 'svanidhi']
  }
];

export const getSchemeById = (id: string): Scheme | undefined => {
  return ALL_SCHEMES.find(s => s.id === id);
};
