import { LegalSnippet } from '../types';

export const ALL_LEGAL_SNIPPETS: LegalSnippet[] = [
  {
    id: 'snip-scholarship-declaration',
    title: 'UP Scholarship Self-Declaration & Biometric Attendance Mandate',
    titleHi: 'यूपी छात्रवृत्ति स्व-प्रमाणित घोषणा एवं बायोमेट्रिक उपस्थिति नियम',
    officialDepartment: 'Social Welfare Department, Government of Uttar Pradesh',
    sourceDocument: 'Order No. 518/26-3-2024 (Section 7(a) & 14(c))',
    originalText: '“The applicant shall submit a self-attested declaration affirming that all particulars submitted in the portal correspond to true revenue and institutional records. Furthermore, disbursement of maintenance allowance is subject to minimum seventy-five percentum (75%) institutional biometric attendance as corroborated by the State Master Data Server. Any applicant found enjoying duplicate scholarship from central or state sources shall be liable to summary recovery under the Revenue Recovery Act.”',
    simpleExplanation: 'You must personally sign a statement that your details are 100% honest and that you are not taking two scholarships at once. Also, you must maintain at least 75% college attendance recorded through fingerprint/biometric machine to receive your money.',
    simpleExplanationHi: 'आपको एक सादे कागज पर स्वयं हस्ताक्षर करके घोषणा करनी है कि आपके सभी विवरण सही हैं और आप एक साथ दो छात्रवृत्तियां नहीं ले रहे हैं। इसके अलावा, खाते में पैसा आने के लिए कॉलेज में बायोमेट्रिक मशीन पर कम से कम 75% उपस्थिति होना अनिवार्य है।',
    actionSteps: [
      'Download and print the 1-page self-declaration format from scholarship.up.gov.in.',
      'Sign with your own pen (do not ask parents or agents to sign for you).',
      'Check with your college registrar to make sure your biometric punch attendance is registered on the portal.',
      'If you have already applied for any National Scholarship (NSP), choose only one before locking.'
    ],
    actionStepsHi: [
      'scholarship.up.gov.in से स्व-घोषणा पत्र डाउनलोड कर प्रिंट करें।',
      'स्वयं अपने पेन से हस्ताक्षर करें (किसी अन्य से हस्ताक्षर न कराएं)।',
      'कॉलेज रजिस्ट्रार से पुष्टि करें कि आपकी 75% बायोमेट्रिक हाजिरी पोर्टल पर दर्ज है।',
      'यदि आपने राष्ट्रीय छात्रवृत्ति (NSP) में भी आवेदन किया है, तो लॉक करने से पहले केवल एक का चयन करें।'
    ],
    pitfalls: [
      'Do not apply for both State and Central scholarship simultaneously — it triggers an automatic audit freeze.',
      'If your biometric attendance drops below 75%, the treasury automatically stops fee disbursal.'
    ],
    pitfallsHi: [
      'राज्य और केंद्र दोनों छात्रवृत्तियों में एक साथ आवेदन न करें — इससे खाता फ्रीज हो सकता है।',
      'यदि आपकी बायोमेट्रिक उपस्थिति 75% से कम होती है, तो भुगतान रोक दिया जाता है।'
    ],
    lastVerified: '18 September 2026'
  },
  {
    id: 'snip-income-lekhpal',
    title: 'Income Certificate Lekhpal Field Verification Clause',
    titleHi: 'आय प्रमाण पत्र लेखपाल स्थलीय जांच नियम',
    officialDepartment: 'Board of Revenue, Government of Uttar Pradesh',
    sourceDocument: 'UP Janhit Guarantee Act Circular Rev-2023/102',
    originalText: '“Upon remittance of statutory application fee, the requisition stands automatically assigned to the Circle Lekhpal who shall conduct a physical local inquiry within the village/mohalla. The Lekhpal shall record the gross aggregated receipts from all agricultural, artisanal, and mercantile vocations of all co-habiting adult family members before countersignature by the Revenue Inspector.”',
    simpleExplanation: 'After you pay ₹15 online, the local government field officer (Lekhpal) will verify how much your whole family actually earns from farming, shops, wages, or jobs before giving final approval.',
    simpleExplanationHi: 'जब आप ₹15 का ऑनलाइन शुल्क जमा करते हैं, तो क्षेत्रीय लेखपाल आपके गांव/मोहल्ले में जाकर जांच करता है कि आपके पूरे परिवार की खेती, दुकान या नौकरी से कुल कितनी कमाई होती है।',
    actionSteps: [
      'Keep your electricity bill, ration card, and family Aadhaar copies ready for when the Lekhpal calls.',
      'If self-employed or daily wager, be clear and consistent about your monthly earnings.',
      'Track your 12-digit application number on edistrict.up.gov.in; the Lekhpal has a strict 7-day timeline to submit the report.'
    ],
    actionStepsHi: [
      'बिजली बिल, राशन कार्ड और परिवार के आधार कार्ड की प्रतियां तैयार रखें।',
      'दैनिक मजदूर या स्वरोजगार होने पर अपनी मासिक आमदनी का स्पष्ट विवरण दें।',
      'पोर्टल पर 12 अंकों के आवेदन क्रमांक को ट्रैक करें; लेखपाल के लिए 7 दिन की समय सीमा तय है।'
    ],
    pitfalls: [
      'Never under-report land ownership: the Lekhpal cross-references your family name directly with Bhulekh records.',
      'Ensure the contact number given on the form is switched on and answered promptly.'
    ],
    pitfallsHi: [
      'जमीन का रकबा कभी न छिपाएं; लेखपाल सीधे भूलेख खतौनी से मिलान करता है।',
      'आवेदन में दिया गया मोबाइल नंबर हमेशा चालू रखें ताकि लेखपाल का फोन न छूटे।'
    ],
    lastVerified: '14 September 2026'
  },
  {
    id: 'snip-pmjay-preauth',
    title: 'Ayushman Bharat (PM-JAY) Hospital Pre-Authorization Clause',
    titleHi: 'आयुष्मान भारत अस्पताल प्री-ऑथराइजेशन और पैकेज नियम',
    officialDepartment: 'National Health Authority (NHA)',
    sourceDocument: 'PM-JAY Provider Operations Manual, Clause 12.3',
    originalText: '“Except in emergency life-threatening conditions where immediate resuscitation is required, no tertiary hospital shall initiate scheduled surgical or medical procedures without electronic pre-authorization transmission from the State Health Agency through the Transaction Management System (TMS). Out-of-pocket charges demanded from beneficiary for empaneled package components shall constitute immediate breach of contract.”',
    simpleExplanation: 'Except in extreme life-or-death emergencies, the hospital must first get digital permission from the government system before starting planned operations. Once approved, the hospital is strictly prohibited from asking you to pay any cash for medicines, tests, bed, or surgery.',
    simpleExplanationHi: 'आपातकालीन स्थिति को छोड़कर, अस्पताल को ऑपरेशन शुरू करने से पहले सरकारी सिस्टम से ऑनलाइन मंजूरी लेनी होती है। मंजूरी मिलने के बाद, अस्पताल आपसे दवा, जांच या बेड के लिए एक रुपया भी नकद नहीं मांग सकता।',
    actionSteps: [
      'Go directly to the “Ayushman Mitra” helpdesk located at the entrance of the hospital.',
      'Show your Ayushman Card and Aadhaar card for instant bed booking and TMS token creation.',
      'Ask the Ayushman Mitra: “Has the pre-authorization been submitted in TMS?”',
      'Never hand over cash for any surgical consumables covered in the package.'
    ],
    actionStepsHi: [
      'अस्पताल के मुख्य द्वार पर स्थित "आयुष्मान मित्र" काउंटर पर जाएं।',
      'आधार कार्ड और आयुष्मान कार्ड दिखाकर टोकन बनवाएं।',
      'आयुष्मान मित्र से पूछें कि क्या सिस्टम में "प्री-ऑथराइजेशन" दर्ज हो गया है।',
      'पैकेज में शामिल किसी भी जांच या दवा के लिए कभी नकद भुगतान न करें।'
    ],
    pitfalls: [
      'Do not pay private chemist bills inside an empaneled hospital without reporting it to the 14555 helpline.',
      'Always verify that the hospital is actively empaneled for that specific medical specialty.'
    ],
    pitfallsHi: [
      'सूचीबद्ध अस्पताल में निजी पर्ची पर बाहर से दवा खरीदने पर तत्काल 14555 हेल्पलाइन पर शिकायत करें।',
      'पुष्टि करें कि अस्पताल उस विशेष बीमारी के इलाज के लिए सूचीबद्ध है।'
    ],
    lastVerified: '20 September 2026'
  },
  {
    id: 'snip-jeevan-pramaan',
    title: 'Senior Citizen Pension Annual Digital Life Certificate (Jeevan Pramaan)',
    titleHi: 'वरिष्ठ नागरिक पेंशन वार्षिक डिजिटल जीवन प्रमाण पत्र नियम',
    officialDepartment: 'Department of Pension & Pensioners Welfare, Govt of India',
    sourceDocument: 'OM No. 1(4)/2021-P&PW(H)-7223',
    originalText: '“Every pensioner drawing monthly sustenance under the Central and State Welfare Roster is obligated to tender Proof of Life during the designated calendar window (1st to 30th November). Submission may be consummated via Face Authentication Technology (FAT), biometric micro-ATMs at Department of Posts / CSC, or certified digital biometric scanners, failing which treasury disbursements shall be held in abeyance effective 1st December.”',
    simpleExplanation: 'Every year during the month of November, you must prove that you are alive by doing a quick face scan on your smartphone or placing your thumb on a scanner at the post office. If you do not do this in November, your pension will pause from December.',
    simpleExplanationHi: 'हर साल 1 से 30 नवंबर के बीच पेंशनर को जीवित होने का प्रमाण देना होता है। यह काम घर बैठे मोबाइल कैमरे से चेहरा स्कैन करके या डाकघर/सीएससी पर अंगूठा लगाकर 2 मिनट में हो जाता है। ऐसा न करने पर दिसंबर से पेंशन रुक जाती है।',
    actionSteps: [
      'In November, download the free “Jeevan Pramaan Face App” on an Android phone.',
      'Or simply ask your local Gram Dak Sevak (Postman) to visit your home with their micro-ATM machine.',
      'Look into the camera for face recognition, or place your thumb on the biometric scanner.',
      'Save the SMS acknowledgement code confirming life certificate generation.'
    ],
    actionStepsHi: [
      'नवंबर में अपने मोबाइल पर "Jeevan Pramaan" ऐप डाउनलोड करें या नजदीकी डाकघर जाएं।',
      'डाकिया (Gram Dak Sevak) को घर पर बुलाकर भी बायोमेट्रिक सत्यापन कराया जा सकता है।',
      'कैमरे के सामने पलकें झपकाएं या बायोमेट्रिक स्कैनर पर अंगूठा लगाएं।',
      'सत्यापन पूरा होने पर मोबाइल पर आने वाला एसएमएस सुरक्षित रखें।'
    ],
    pitfalls: [
      'Do not wait until the last week of November when biometric server traffic is heavily congested.',
      'Ensure the mobile number linked with Aadhaar is handy to receive the confirmation OTP.'
    ],
    pitfallsHi: [
      'नवंबर के अंतिम दिनों का इंतजार न करें जब सरकारी सर्वर पर अत्यधिक लोड होता है।',
      'सुनिश्चित करें कि आधार से जुड़ा मोबाइल नंबर चालू है ताकि ओटीपी प्राप्त हो सके।'
    ],
    lastVerified: '12 September 2026'
  }
];
