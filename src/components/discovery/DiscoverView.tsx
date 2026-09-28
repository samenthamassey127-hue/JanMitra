import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { ALL_SCHEMES } from '../../data/schemes';
import { evaluateAllSchemes } from '../../utils/matchingEngine';
import { SchemeCard } from './SchemeCard';
import { SchemeDetailModal } from './SchemeDetailModal';
import { ImNotSureFlow } from './ImNotSureFlow';
import { CategoryKey, Scheme } from '../../types';
import { 
  Compass, 
  Sparkles, 
  HelpCircle, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const DiscoverView: React.FC<{ onNavigateToService: (serviceId: string) => void }> = ({ onNavigateToService }) => {
  const { language, t } = useLanguage();
  const { 
    profile, 
    documents, 
    selectedSchemeId, 
    setSelectedSchemeId, 
    updateProfile 
  } = useCitizen();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showImNotSure, setShowImNotSure] = useState(false);
  const [progressiveQuestionAnswered, setProgressiveQuestionAnswered] = useState(false);

  // Compute live match evaluations
  const evaluations = evaluateAllSchemes(ALL_SCHEMES, profile, documents);

  const filteredEvaluations = evaluations.filter(ev => {
    if (selectedCategory === 'all') return true;
    return ev.scheme.category === selectedCategory;
  });

  const categories: Array<{ id: string; labelEn: string; labelHi: string }> = [
    { id: 'all', labelEn: 'All Benefits', labelHi: 'सभी योजनाएं' },
    { id: 'education', labelEn: 'Education', labelHi: 'शिक्षा' },
    { id: 'senior', labelEn: 'Senior Citizens', labelHi: 'वरिष्ठ नागरिक' },
    { id: 'health', labelEn: 'Healthcare', labelHi: 'स्वास्थ्य' },
    { id: 'finance', labelEn: 'Financial Support', labelHi: 'वित्तीय सहायता' },
    { id: 'housing', labelEn: 'Housing', labelHi: 'आवास' },
    { id: 'agriculture', labelEn: 'Agriculture', labelHi: 'कृषि' },
    { id: 'business', labelEn: 'Business & MSME', labelHi: 'व्यापार व उद्योग' },
    { id: 'employment', labelEn: 'Employment', labelHi: 'रोजगार' }
  ];

  const modalScheme = selectedSchemeId ? ALL_SCHEMES.find(s => s.id === selectedSchemeId) : null;

  return (
    <div className="space-y-8">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
            Eligibility Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Compass className="w-7 h-7 text-brand-700" />
            <span>{t('results.heading')}</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            {t('results.subheading')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowImNotSure(!showImNotSure)}
          className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-brand-500 bg-white text-slate-800 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-brand-700" />
          <span>{showImNotSure ? 'Close Guided Flow' : "I'm Not Sure — Guide Me"}</span>
        </button>
      </div>

      {/* "I'm Not Sure" Interactive Flow Modal/Drawer (Section 20) */}
      {showImNotSure && (
        <ImNotSureFlow onComplete={() => setShowImNotSure(false)} />
      )}

      {/* Section 6 Progressive Questioning (Micro-Questions, NOT 15 at once) */}
      {!progressiveQuestionAnswered && profile.occupation.toLowerCase().includes('student') && (
        <div className="bg-gradient-to-r from-brand-50 to-indigo-50/70 border border-brand-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-700 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-saffron-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 block">
                Progressive Questioning (1 Missing Parameter)
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                What type of college or university are you enrolled in?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                UP Scholarship requires checking if the college master data is active on the portal.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                updateProfile({ institutionType: 'Government' });
                setProgressiveQuestionAnswered(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-brand-300 hover:bg-brand-50 text-brand-900 text-xs font-semibold shadow-2xs"
            >
              Government
            </button>
            <button
              onClick={() => {
                updateProfile({ institutionType: 'Government-Aided' });
                setProgressiveQuestionAnswered(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-brand-300 hover:bg-brand-50 text-brand-900 text-xs font-semibold shadow-2xs"
            >
              Government-Aided
            </button>
            <button
              onClick={() => {
                updateProfile({ institutionType: 'Private Recognized' });
                setProgressiveQuestionAnswered(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-brand-300 hover:bg-brand-50 text-brand-900 text-xs font-semibold shadow-2xs"
            >
              Private Recognized
            </button>
          </div>
        </div>
      )}

      {/* Category Filter Horizontal Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 cursor-pointer ${
              selectedCategory === cat.id 
                ? 'bg-brand-700 text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {language === 'hi' ? cat.labelHi : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Scheme Results Grid (Section 7) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvaluations.map(ev => (
          <SchemeCard
            key={ev.scheme.id}
            evaluation={ev}
            onOpenDetails={() => setSelectedSchemeId(ev.scheme.id)}
          />
        ))}
      </div>

      {/* Detailed Modal (Section 8, 9, 11, 12) */}
      {modalScheme && (
        <SchemeDetailModal
          scheme={modalScheme}
          onClose={() => setSelectedSchemeId(null)}
          onNavigateToService={(serviceId) => {
            setSelectedSchemeId(null);
            onNavigateToService(serviceId);
          }}
        />
      )}

    </div>
  );
};
