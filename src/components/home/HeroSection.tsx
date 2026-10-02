import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { analyzeSituationWithBackend } from '../../utils/apiClient';
import { CategoryKey } from '../../types';
import { 
  GraduationCap, 
  Coins, 
  HeartHandshake, 
  Activity, 
  Home, 
  Briefcase, 
  FileCheck2, 
  Sprout, 
  Rocket, 
  HelpCircle, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Mic, 
  X,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const HeroSection: React.FC<{ onSelectCategory: (category: CategoryKey) => void }> = ({ onSelectCategory }) => {
  const { language, t } = useLanguage();
  const { profile, removeChip, addChip, updateProfile, setActiveTab, loadScenario } = useCitizen();
  const [inputText, setInputText] = useState('');
  const [isProcessingNlp, setIsProcessingNlp] = useState(false);

  const sampleSituations = [
    {
      labelEn: "20yr B.Tech student in Lucknow, ₹2.5L income",
      labelHi: "लखनऊ से 20 वर्ष का बी.टेक छात्र, ₹2.5 लाख आय",
      scenarioId: 'student' as const
    },
    {
      labelEn: "66yr retired father in Varanasi needing pension",
      labelHi: "वाराणसी में 66 वर्षीय सेवानिवृत्त पिता को पेंशन चाहिए",
      scenarioId: 'senior' as const
    },
    {
      labelEn: "I need an official Income Certificate (Aay Praman Patra)",
      labelHi: "मुझे आधिकारिक आय प्रमाण पत्र बनवाना है",
      scenarioId: 'certificate' as const
    },
    {
      labelEn: "Translate confusing government scholarship order",
      labelHi: "सरकारी छात्रवृत्ति आदेश का सरल अनुवाद करें",
      scenarioId: 'explain' as const
    }
  ];

  const handleAnalyzeInput = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setIsProcessingNlp(true);

    try {
      const backendResult = await analyzeSituationWithBackend(inputText, language);
      if (backendResult?.profile) {
        const p = backendResult.profile;
        const updates: any = {};
        if (p.age) updates.age = p.age;
        if (p.district) updates.district = p.district;
        if (p.state) updates.state = p.state;
        if (p.education) updates.education = p.education;
        if (p.occupation) updates.occupation = p.occupation;
        if (p.incomeValue) {
          updates.incomeValue = p.incomeValue;
          updates.incomeRange = p.incomeRange || (p.incomeValue <= 100000 ? '< ₹1.0L' : '₹1.0L - ₹2.5L');
        }
        if (p.category) updates.category = p.category;
        updateProfile(updates);

        if (p.goal && p.goal.toLowerCase().includes('certificate')) {
          setActiveTab('services');
        } else {
          setActiveTab('discover');
        }
        setIsProcessingNlp(false);
        return;
      }
    } catch (err) {
      console.log('Using local fallback parser:', err);
    }

    // Deterministic client-side fallback
    setTimeout(() => {
      const lower = inputText.toLowerCase();
      
      // Age extraction
      const ageMatch = lower.match(/(\d{1,2})\s*(?:years?|yr|वर्ष|साल)/);
      if (ageMatch) {
        const ageVal = parseInt(ageMatch[1], 10);
        updateProfile({ age: ageVal });
      }

      // Location extraction
      if (lower.includes('lucknow') || lower.includes('लखनऊ')) {
        updateProfile({ district: 'Lucknow', state: 'Uttar Pradesh' });
      } else if (lower.includes('varanasi') || lower.includes('वाराणसी') || lower.includes('बनारस')) {
        updateProfile({ district: 'Varanasi', state: 'Uttar Pradesh' });
      } else if (lower.includes('kanpur') || lower.includes('कानपुर')) {
        updateProfile({ district: 'Kanpur Nagar', state: 'Uttar Pradesh' });
      }

      // Income extraction
      if (lower.includes('2.5') || lower.includes('ढाई लाख')) {
        updateProfile({ incomeValue: 250000, incomeRange: '₹1.0L - ₹2.5L' });
      } else if (lower.includes('42') || lower.includes('50000') || lower.includes('low income')) {
        updateProfile({ incomeValue: 42000, incomeRange: '< ₹1.0L' });
      }

      // Goal / Course extraction
      if (lower.includes('b.tech') || lower.includes('btech') || lower.includes('student') || lower.includes('scholarship') || lower.includes('छात्रवृत्ति')) {
        updateProfile({ education: 'B.Tech (Computer Science)', occupation: 'Student' });
        setActiveTab('discover');
      } else if (lower.includes('pension') || lower.includes('retired') || lower.includes('पेंशन') || lower.includes('father') || lower.includes('पिता')) {
        updateProfile({ occupation: 'Retired / Senior Citizen' });
        setActiveTab('discover');
      } else if (lower.includes('certificate') || lower.includes('प्रमाण पत्र') || lower.includes('income certificate')) {
        setActiveTab('services');
      } else {
        setActiveTab('discover');
      }

      setIsProcessingNlp(false);
    }, 400);
  };

  const categories = [
    {
      key: 'education' as CategoryKey,
      icon: GraduationCap,
      color: 'bg-blue-50 text-blue-700 border-blue-200 group-hover:border-blue-400',
      iconBg: 'bg-blue-600 text-white',
      title: t('cat.education'),
      subtitle: t('cat.education_sub')
    },
    {
      key: 'finance' as CategoryKey,
      icon: Coins,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 group-hover:border-emerald-400',
      iconBg: 'bg-emerald-600 text-white',
      title: t('cat.finance'),
      subtitle: t('cat.finance_sub')
    },
    {
      key: 'senior' as CategoryKey,
      icon: HeartHandshake,
      color: 'bg-purple-50 text-purple-800 border-purple-200 group-hover:border-purple-400',
      iconBg: 'bg-purple-600 text-white',
      title: t('cat.senior'),
      subtitle: t('cat.senior_sub')
    },
    {
      key: 'health' as CategoryKey,
      icon: Activity,
      color: 'bg-rose-50 text-rose-800 border-rose-200 group-hover:border-rose-400',
      iconBg: 'bg-rose-600 text-white',
      title: t('cat.health'),
      subtitle: t('cat.health_sub')
    },
    {
      key: 'housing' as CategoryKey,
      icon: Home,
      color: 'bg-amber-50 text-amber-800 border-amber-200 group-hover:border-amber-400',
      iconBg: 'bg-amber-600 text-white',
      title: t('cat.housing'),
      subtitle: t('cat.housing_sub')
    },
    {
      key: 'employment' as CategoryKey,
      icon: Briefcase,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200 group-hover:border-indigo-400',
      iconBg: 'bg-indigo-600 text-white',
      title: t('cat.employment'),
      subtitle: t('cat.employment_sub')
    },
    {
      key: 'certificates' as CategoryKey,
      icon: FileCheck2,
      color: 'bg-teal-50 text-teal-800 border-teal-200 group-hover:border-teal-400',
      iconBg: 'bg-teal-600 text-white',
      title: t('cat.certificates'),
      subtitle: t('cat.certificates_sub')
    },
    {
      key: 'agriculture' as CategoryKey,
      icon: Sprout,
      color: 'bg-green-50 text-green-800 border-green-200 group-hover:border-green-400',
      iconBg: 'bg-green-600 text-white',
      title: t('cat.agriculture'),
      subtitle: t('cat.agriculture_sub')
    },
    {
      key: 'business' as CategoryKey,
      icon: Rocket,
      color: 'bg-orange-50 text-orange-800 border-orange-200 group-hover:border-orange-400',
      iconBg: 'bg-orange-600 text-white',
      title: t('cat.business'),
      subtitle: t('cat.business_sub')
    },
    {
      key: 'not_sure' as CategoryKey,
      icon: HelpCircle,
      color: 'bg-slate-100 text-slate-800 border-slate-300 group-hover:border-brand-500 shadow-sm',
      iconBg: 'bg-brand-700 text-white',
      title: t('cat.not_sure'),
      subtitle: t('cat.not_sure_sub')
    }
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-14 bg-gradient-to-b from-white via-brand-50/20 to-slate-50 border-b border-slate-200">
      
      {/* Decorative Subtle Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-brand-200/50 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-saffron-200/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-saffron-500"></span>
            <span>Government benefits and procedures, explained for humans</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('hero.title')}
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Conversational Discovery Box (Section 6) */}
        <div className="mt-8 max-w-3xl mx-auto">
          <form 
            onSubmit={handleAnalyzeInput}
            className="bg-white p-2.5 sm:p-3 rounded-2xl border-2 border-brand-700/20 shadow-xl shadow-brand-900/5 transition-all focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-500/10"
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('hero.input_placeholder')}
                  className="w-full px-4 py-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isProcessingNlp}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-700/20 hover:shadow-lg disabled:opacity-70 cursor-pointer"
                >
                  {isProcessingNlp ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-saffron-400" />
                      <span>{t('hero.analyze_button')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Sample Queries */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
              <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Try asking:</span>
              </span>
              {sampleSituations.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(language === 'hi' ? sample.labelHi : sample.labelEn);
                    loadScenario(sample.scenarioId);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-800 text-slate-600 transition-colors shrink-0 text-[11px]"
                >
                  {language === 'hi' ? sample.labelHi : sample.labelEn}
                </button>
              ))}
            </div>
          </form>

          {/* Extracted Structured Profile Chips (Section 6 requirement) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">
              Extracted situation factors:
            </span>
            {profile.extractedChips.map(chip => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-medium shadow-2xs group hover:border-slate-300"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={() => removeChip(chip.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                  title="Remove factor"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={() => setActiveTab('profile')}
              className="text-xs text-brand-700 hover:text-brand-800 font-semibold underline underline-offset-2 ml-1"
            >
              Edit all details
            </button>
          </div>
        </div>

        {/* 10 Large Visual Category Cards (Section 5) */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Explore by Life Area</span>
              <span className="text-xs font-normal text-slate-500">
                (Click any card to discover programs)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {categories.map(cat => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.key}
                  onClick={() => onSelectCategory(cat.key)}
                  className={`group relative p-4 rounded-xl border bg-white cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${cat.color}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat.iconBg} shadow-2xs group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-brand-800 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
