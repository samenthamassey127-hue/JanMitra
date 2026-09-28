import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; hi: string }> = {
  // Brand & Tagline
  'brand.name': { en: 'JanMitra', hi: 'जनमित्र' },
  'brand.tagline': { en: 'Understand. Discover. Apply.', hi: 'समझें। खोजें। आवेदन करें।' },
  'brand.subtitle': { en: 'Citizen-First Benefits & Services Navigator', hi: 'नागरिक-हितैषी सरकारी योजना व सेवा मार्गदर्शक' },

  // Navigation
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.discover': { en: 'Discover Benefits', hi: 'योजनाएं खोजें' },
  'nav.services': { en: 'Services', hi: 'सरकारी सेवाएं' },
  'nav.journey': { en: 'My Journey', hi: 'मेरी प्रगति यात्रा' },
  'nav.documents': { en: 'My Documents', hi: 'मेरे दस्तावेज' },
  'nav.saved': { en: 'Saved', hi: 'सहेजे गए' },
  'nav.profile': { en: 'Profile', hi: 'प्रोफाइल' },
  'nav.explain': { en: 'Explain This', hi: 'नियम समझें' },

  // Disclaimer
  'disclaimer.text': {
    en: 'JanMitra is an independent information and navigation platform. It does not represent the Government of India or any state government. Government authorities make the final decision on eligibility and applications.',
    hi: 'जनमित्र एक स्वतंत्र नागरिक सूचना एवं सहायता मंच है। यह भारत सरकार या किसी भी राज्य सरकार का प्रतिनिधित्व नहीं करता है। पात्रता और आवेदन पर अंतिम निर्णय संबंधित सरकारी प्राधिकरण करते हैं।'
  },
  'disclaimer.short': {
    en: 'Independent Platform • Final decision rests with government authorities',
    hi: 'स्वतंत्र सूचना मंच • अंतिम निर्णय सरकारी अधिकारियों का'
  },

  // Hero
  'hero.title': { en: 'What are you trying to do?', hi: 'आप क्या करना चाहते हैं?' },
  'hero.subtitle': {
    en: "Tell JanMitra what you need. We'll help you find relevant government benefits and guide you through the process.",
    hi: 'जनमित्र को अपनी जरूरत बताएं। हम संबंधित सरकारी योजनाओं की खोज और पूरी प्रक्रिया में आपका मार्गदर्शन करेंगे।'
  },
  'hero.input_placeholder': {
    en: "E.g. I am a 20 yr B.Tech student in Lucknow looking for financial help, or I need an income certificate...",
    hi: "उदा. मैं लखनऊ से 20 वर्ष का बी.टेक छात्र हूँ और फीस सहायता चाहिए, या मुझे आय प्रमाण पत्र बनवाना है..."
  },
  'hero.analyze_button': { en: 'Analyze My Situation', hi: 'मेरी स्थिति का विश्लेषण करें' },
  'hero.voice_button': { en: 'Voice Search', hi: 'बोलकर खोजें' },

  // Categories
  'cat.education': { en: 'Education', hi: 'शिक्षा' },
  'cat.education_sub': { en: 'Scholarships, fee assistance and student benefits', hi: 'छात्रवृत्ति, फीस प्रतिपूर्ति एवं छात्र लाभ' },
  'cat.finance': { en: 'Financial Support', hi: 'वित्तीय सहायता' },
  'cat.finance_sub': { en: 'Assistance programs for low-income families', hi: 'कम आय वाले परिवारों के लिए सहायता कार्यक्रम' },
  'cat.senior': { en: 'Senior Citizens', hi: 'वरिष्ठ नागरिक' },
  'cat.senior_sub': { en: 'Pensions and senior citizen health services', hi: 'पेंशन एवं वृद्धजन स्वास्थ्य सेवाएं' },
  'cat.health': { en: 'Healthcare', hi: 'स्वास्थ्य सेवाएं' },
  'cat.health_sub': { en: 'Cashless medical treatment & Ayushman Bharat', hi: 'मुफ्त इलाज एवं आयुष्मान भारत योजना' },
  'cat.housing': { en: 'Housing', hi: 'आवास' },
  'cat.housing_sub': { en: 'PMAY housing grants & construction assistance', hi: 'पीएम आवास योजना एवं मकान निर्माण अनुदान' },
  'cat.employment': { en: 'Employment', hi: 'रोजगार व श्रम' },
  'cat.employment_sub': { en: 'Skill development, vendor credit & worker benefits', hi: 'कौशल विकास, वेंडर ऋण एवं श्रमिक कल्याण' },
  'cat.certificates': { en: 'Certificates & Documents', hi: 'प्रमाण पत्र एवं दस्तावेज' },
  'cat.certificates_sub': { en: 'Income, domicile, caste and other public certificates', hi: 'आय, निवास, जाति और अन्य सरकारी प्रमाण पत्र' },
  'cat.agriculture': { en: 'Agriculture', hi: 'कृषि एवं किसान' },
  'cat.agriculture_sub': { en: 'PM-Kisan, crop insurance & farmer schemes', hi: 'पीएम-किसान, फसल बीमा एवं कृषक सहायता' },
  'cat.business': { en: 'Business & MSME', hi: 'व्यापार एवं स्वरोजगार' },
  'cat.business_sub': { en: 'Subsidized loans and entrepreneurship programs', hi: 'रियायती ऋण, सब्सिडी एवं स्टार्टअप सहायता' },
  'cat.not_sure': { en: "I'm Not Sure", hi: 'मुझे समझ नहीं आ रहा' },
  'cat.not_sure_sub': { en: "Tell us your situation and we'll help you navigate", hi: 'अपनी स्थिति बताएं और हम सही रास्ता दिखाएंगे' },

  // Results & Evaluation
  'results.heading': { en: 'Potentially relevant for you', hi: 'आपके लिए संभावित रूप से उपयोगी' },
  'results.subheading': {
    en: 'Based on the personal information provided. You may be eligible.',
    hi: 'प्रस्तुत विवरण के आधार पर। आप पात्र हो सकते हैं।'
  },
  'results.matched': { en: 'Match', hi: 'अनुरूप' },
  'results.uncertain': { en: 'Need More Info', hi: 'और जानकारी चाहिए' },
  'results.issue': { en: 'Potential Issue', hi: 'संभावित बाधा' },
  'results.check_eligibility': { en: 'Check Full Eligibility & Requirements', hi: 'पूर्ण पात्रता व आवश्यकताएं देखें' },
  'results.why_matched': { en: "Why you're seeing this", hi: 'आपको यह योजना क्यों दिखाई गई' },
  'results.missing_info': { en: 'Information still required', hi: 'आवश्यक अतिरिक्त जानकारी' },
  'results.potential_benefit': { en: 'Potential Benefit', hi: 'संभावित लाभ' },

  // What am I missing
  'missing.progress': { en: 'Your Progress', hi: 'आपकी तैयारी' },
  'results.completed': { en: 'Completed', hi: 'पूर्ण विवरण' },
  'results.needed': { en: 'Still Needed', hi: 'अभी आवश्यक' },
  'results.how_to_get': { en: 'How do I get the missing certificate?', hi: 'लापता प्रमाण पत्र कैसे बनवाएं?' },

  // Common UI
  'action.save': { en: 'Save', hi: 'सहेजें' },
  'action.saved': { en: 'Saved', hi: 'सहेजा गया' },
  'action.start_journey': { en: 'Start Application Journey', hi: 'आवेदन यात्रा शुरू करें' },
  'action.view_source': { en: 'View Official Source', hi: 'आधिकारिक स्रोत देखें' },
  'action.why_saying_this': { en: 'Why is JanMitra saying this?', hi: 'जनमित्र यह जानकारी किस आधार पर दे रहा है?' },
  'action.upload_doc': { en: 'Upload Document', hi: 'दस्तावेज अपलोड करें' },
  'action.preliminary_check': { en: 'Preliminary Document Check', hi: 'दस्तावेज की प्रारंभिक जांच' },
  'action.close': { en: 'Close', hi: 'बंद करें' },
  'action.search': { en: 'Search benefits, services, documents...', hi: 'योजनाएं, सेवाएं, दस्तावेज खोजें...' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('janmitra_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('janmitra_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
