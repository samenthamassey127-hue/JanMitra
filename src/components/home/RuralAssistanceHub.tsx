import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { CategoryKey } from '../../types';
import { speakText, stopSpeaking, subscribeSpeakingStatus } from '../../utils/speech';
import { 
  Sprout, 
  Activity, 
  Home, 
  HeartHandshake, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  CreditCard,
  Building2,
  Users,
  Sparkles,
  PhoneCall,
  Check
} from 'lucide-react';

interface RuralAssistanceHubProps {
  onSelectCategory: (category: CategoryKey) => void;
}

export const RuralAssistanceHub: React.FC<RuralAssistanceHubProps> = ({ onSelectCategory }) => {
  const { language, t } = useLanguage();
  const { setActiveTab, setSelectedServiceId, loadScenario } = useCitizen();
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeSpeakingStatus((id) => {
      setActiveSpeechId(id);
    });
    return () => {
      unsubscribe();
      stopSpeaking();
    };
  }, []);

  const handleListen = (id: string, textHi: string, textEn: string) => {
    const textToSpeak = language === 'hi' ? textHi : textEn;
    speakText(id, textToSpeak, language);
  };

  const ruralPillars = [
    {
      id: 'kisan',
      category: 'agriculture' as CategoryKey,
      icon: Sprout,
      color: 'bg-emerald-600 text-white',
      badgeHi: '₹6,000 / वर्ष + फसल बीमा',
      badgeEn: '₹6,000 / yr + Crop Shield',
      titleHi: '🌾 खेती व किसान (Kisan)',
      titleEn: '🌾 Farming & Agriculture',
      descHi: 'पीएम किसान सम्मान निधि, किसान क्रेडिट कार्ड (KCC), और फसल नुकसान पर मुआवजा।',
      descEn: 'PM-Kisan direct cash transfer, Kisan Credit Card loans, and crop damage insurance.',
      speechHi: 'खेती और किसान सहायता: पीएम किसान योजना के तहत हर साल 6000 रुपये सीधे आपके बैंक खाते में आते हैं। साथ ही कम ब्याज पर किसान क्रेडिट कार्ड लोन और फसल बीमा उपलब्ध है।',
      speechEn: 'Farming and agriculture benefits: Under PM-Kisan, you receive 6,000 rupees per year directly into your bank account. Low-interest Kisan Credit Card loans and crop insurance are also available.'
    },
    {
      id: 'health',
      category: 'health' as CategoryKey,
      icon: Activity,
      color: 'bg-rose-600 text-white',
      badgeHi: '₹5,00,000 तक मुफ्त इलाज',
      badgeEn: '₹5 Lakh Free Treatment',
      titleHi: '🩺 इलाज व अस्पताल (Hospital)',
      titleEn: '🩺 Healthcare & Hospital',
      descHi: 'आयुष्मान गोल्डन कार्ड से सरकारी व बड़े प्राइवेट अस्पतालों में 5 लाख रुपये तक का कैशलेस इलाज।',
      descEn: 'Ayushman Bharat card provides up to 5 lakh rupees cashless hospital treatment annually.',
      speechHi: 'मुफ्त इलाज योजना: आयुष्मान कार्ड बनवाएं और सरकारी या प्राइवेट अस्पताल में 5 लाख रुपये तक का मुफ्त इलाज और ऑपरेशन करवाएं।',
      speechEn: 'Healthcare assistance: Get your Ayushman Card made to receive up to 5 lakh rupees of cashless hospital treatment and surgeries.'
    },
    {
      id: 'housing',
      category: 'housing' as CategoryKey,
      icon: Home,
      color: 'bg-amber-600 text-white',
      badgeHi: '₹1,20,000 पक्का मकान अनुदान',
      badgeEn: '₹1.2 Lakh Housing Grant',
      titleHi: '🏠 मकान व शौचालय (Awas)',
      titleEn: '🏠 Housing & Sanitation',
      descHi: 'प्रधानमंत्री ग्रामीण आवास योजना (कॉलोनी) से पक्के घर का निर्माण और स्वच्छ शौचालय सहायता।',
      descEn: 'PM Awas Yojana rural housing financial grant and household sanitation assistance.',
      speechHi: 'मकान और शौचालय योजना: यदि आपका कच्चा मकान है तो प्रधानमंत्री ग्रामीण आवास योजना में पक्का घर बनाने के लिए एक लाख बीस हजार रुपये की सहायता मिलती है।',
      speechEn: 'Housing grant: If you live in a kutcha house, receive 1.2 lakh rupees financial aid under PM Awas Yojana Gramin to build a pucca home.'
    },
    {
      id: 'pension',
      category: 'senior' as CategoryKey,
      icon: HeartHandshake,
      color: 'bg-purple-600 text-white',
      badgeHi: '₹1,000 / माह + 5kg मुफ्त राशन',
      badgeEn: '₹1,000 / mo + Free Ration',
      titleHi: '👴 पेंशन व राशन (Pension)',
      titleEn: '👴 Pension & Free Ration',
      descHi: '60 वर्ष से अधिक के बुजुर्गों को वृद्धावस्था पेंशन, विधवा पेंशन, दिव्यांग पेंशन एवं मुफ्त राशन।',
      descEn: 'Monthly social security pension for elders, widows, disabled persons and free ration grains.',
      speechHi: 'पेंशन और राशन: 60 साल या उससे अधिक उम्र के बुजुर्गों को 1000 रुपये हर महीने पेंशन और पात्र परिवारों को हर महीने मुफ्त राशन मिलता है।',
      speechEn: 'Pension and monthly ration: Senior citizens over 60 receive 1,000 rupees monthly pension, plus 5 kilograms of free food grain per person.'
    }
  ];

  const essentialDocuments = [
    {
      nameHi: '1. आधार कार्ड (Aadhaar)',
      nameEn: '1. Aadhaar Card',
      tipHi: 'मोबाइल नंबर लिंक होना चाहिए (OTP के लिए जरूरी)',
      tipEn: 'Active mobile number must be linked for OTP',
      docCode: 'aadhaar'
    },
    {
      nameHi: '2. बैंक पासबुक (DBT Seeding)',
      nameEn: '2. Bank Account (DBT Linked)',
      tipHi: 'आधार से NPCI लिंक होना जरूरी ताकि सरकारी पैसा सीधे खाते में पहुंचे',
      tipEn: 'Must be seeded with Aadhaar for Direct Benefit Transfer',
      docCode: 'bank_passbook'
    },
    {
      nameHi: '3. खतौनी / भूलेख (Land Record)',
      nameEn: '3. Land Khatauni Record',
      tipHi: 'किसान योजनाओं और ऋण के लिए प्रमाणित नकल',
      tipEn: 'Certified copy required for farm schemes and loans',
      serviceId: 'srv-khatauni'
    },
    {
      nameHi: '4. आय व निवास प्रमाण पत्र (Certificates)',
      nameEn: '4. Income & Domicile Proof',
      tipHi: 'तहसीलदार या लेखपाल सत्यापन से 7 दिनों में बनता है',
      tipEn: 'Issued via e-District portal after Lekhpal verification',
      serviceId: 'srv-income-cert'
    }
  ];

  return (
    <div className="mt-10 mb-14 bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/40 rounded-3xl border-2 border-amber-200/80 p-5 sm:p-8 shadow-lg shadow-amber-900/5">
      
      {/* Top Banner with Gramin Saathi Motif */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-amber-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-100 text-saffron-900 border border-saffron-300 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-saffron-600 animate-pulse"></span>
            <span>{language === 'hi' ? 'विशेष: ग्रामीण जन सुविधा केंद्र' : 'Special: Rural Citizen Convenience Hub'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{language === 'hi' ? 'सीधे काम की 4 बड़ी योजनाएं' : '4 Major Everyday Welfare Pillars'}</span>
            <span className="text-sm font-normal text-slate-500 hidden sm:inline">
              ({language === 'hi' ? 'आसान भाषा में समझें और सुनें' : 'Understand in plain words & listen aloud'})
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'यदि फॉर्म भरने या पढ़ने में मुश्किल हो, तो किसी भी कार्ड पर 🔊 "सुनें" दबाएं। जनमित्र आपको बोलकर पूरी बात समझाएगा।'
              : 'If reading or navigating government circulars is difficult, click 🔊 "Listen" on any card. JanMitra will speak aloud to guide you.'}
          </p>
        </div>

        {/* Listen Hub Intro Button */}
        <button
          type="button"
          onClick={() => handleListen(
            'hub-intro',
            'नमस्कार! जनमित्र में आपका स्वागत है। यहां आप खेती, मुफ्त इलाज, पक्का मकान, और पेंशन जैसी योजनाओं की जानकारी आसान भाषा में सुन सकते हैं। नीचे दिए गए किसी भी कार्ड पर क्लिक करके पात्रता जांचें।',
            'Welcome to JanMitra. Here you can discover farming grants, free hospital treatments, housing subsidies, and monthly pensions in simple everyday words. Tap any card below to check your eligibility.'
          )}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer shrink-0 ${
            activeSpeechId === 'hub-intro'
              ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
              : 'bg-brand-700 hover:bg-brand-800 text-white shadow-brand-700/20'
          }`}
          title="Listen aloud in your selected language"
        >
          {activeSpeechId === 'hub-intro' ? (
            <>
              <VolumeX className="w-4 h-4 animate-bounce" />
              <span>{language === 'hi' ? 'आवाज़ रोकें ⏹' : 'Stop Audio ⏹'}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'पूरी जानकारी सुनें 🔊' : 'Listen Introduction 🔊'}</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Big High-Contrast Touch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {ruralPillars.map((item) => {
          const Icon = item.icon;
          const isSpeaking = activeSpeechId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border-2 border-slate-200/90 p-5 shadow-xs hover:shadow-xl hover:border-brand-500 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Benefit Pill & Audio Button */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                    {language === 'hi' ? item.badgeHi : item.badgeEn}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleListen(item.id, item.speechHi, item.speechEn);
                    }}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                      isSpeaking
                        ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-200 animate-pulse'
                        : 'bg-slate-50 hover:bg-brand-50 border-slate-200 text-slate-700 hover:text-brand-800'
                    }`}
                    title={language === 'hi' ? 'बोलकर सुनें' : 'Listen aloud'}
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-brand-700" />
                        <span className="text-[10px] hidden sm:inline">{language === 'hi' ? 'सुनें' : 'Listen'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color} shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-brand-800 transition-colors leading-tight">
                      {language === 'hi' ? item.titleHi : item.titleEn}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {language === 'hi' ? item.descHi : item.descEn}
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectCategory(item.category)}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs group-hover:shadow-md cursor-pointer"
              >
                <span>{language === 'hi' ? 'पात्रता व योजना देखें' : 'Check Eligibility & Details'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Village Documents Essential Guide (कागज़ात सहायता) */}
      <div className="mt-8 pt-6 border-t border-amber-200/60 bg-amber-50/40 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-700" />
              <span>{language === 'hi' ? 'सरकारी लाभ पाने के लिए जरूरी 4 मुख्य कागज़ात' : '4 Must-Have Documents for Government Benefits'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi' 
                ? '90% फॉर्म केवल इन कागज़ातों में कमी के कारण रुकते हैं। इन्हें अभी चेक करें:' 
                : 'Most applications stall due to minor document mistakes. Ensure these 4 are in order:'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-brand-600 text-brand-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer shrink-0"
          >
            {language === 'hi' ? 'मेरे सभी दस्तावेज जांचें ➔' : 'Check My Document Vault ➔'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {essentialDocuments.map((doc, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-extrabold text-slate-900 block mb-1">
                  {language === 'hi' ? doc.nameHi : doc.nameEn}
                </span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {language === 'hi' ? doc.tipHi : doc.tipEn}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{language === 'hi' ? 'तैयार रखें' : 'Keep Ready'}</span>
                </span>

                {doc.serviceId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedServiceId(doc.serviceId!);
                      setActiveTab('services');
                    }}
                    className="text-[10px] font-bold text-brand-700 hover:text-brand-900 underline underline-offset-2"
                  >
                    {language === 'hi' ? 'बनवाने का तरीका' : 'How to obtain'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('documents')}
                    className="text-[10px] font-bold text-brand-700 hover:text-brand-900 underline underline-offset-2"
                  >
                    {language === 'hi' ? 'लॉकर में देखें' : 'View in locker'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Super-Simple Steps for Rural Citizen (आसान 3 कदम) */}
      <div className="mt-6 pt-5 border-t border-amber-200/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <span className="font-bold text-slate-800 shrink-0 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{language === 'hi' ? 'जनमित्र का इस्तेमाल 3 आसान चरणों में:' : 'Using JanMitra in 3 Simple Steps:'}</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center font-black text-xs shrink-0">1</span>
            <span className="text-[11px] font-semibold text-slate-800">
              {language === 'hi' ? 'माइक से बोलें या अपनी ज़रूरत बताएं' : 'Speak via mic or tell your need'}
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-xs shrink-0">2</span>
            <span className="text-[11px] font-semibold text-slate-800">
              {language === 'hi' ? 'देखें कौन सी योजना में पैसा मिलेगा' : 'See which schemes match your profile'}
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">3</span>
            <span className="text-[11px] font-semibold text-slate-800">
              {language === 'hi' ? 'कागज़ात तैयार करें और आवेदन करें' : 'Prepare documents & track application'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
