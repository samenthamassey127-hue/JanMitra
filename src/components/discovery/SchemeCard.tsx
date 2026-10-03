import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { SchemeEvaluationResult } from '../../utils/matchingEngine';
import { speakText, stopSpeaking, subscribeSpeakingStatus } from '../../utils/speech';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Bookmark, 
  ArrowRight, 
  Building2, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Volume2,
  VolumeX,
  FileCheck2,
  Coins
} from 'lucide-react';

interface SchemeCardProps {
  evaluation: SchemeEvaluationResult;
  onOpenDetails: () => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ evaluation, onOpenDetails }) => {
  const { language, t } = useLanguage();
  const { savedSchemeIds, toggleSaveScheme, addJourney } = useCitizen();
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const { scheme, overallStatus, ruleEvaluations, matchedRulesCount, totalRulesCount, missingBridges } = evaluation;
  const isSaved = savedSchemeIds.includes(scheme.id);

  useEffect(() => {
    const unsub = subscribeSpeakingStatus((id) => setActiveSpeechId(id));
    return () => unsub();
  }, []);

  // Status styles & clear everyday language for rural users
  const statusBadge = {
    likely_eligible: {
      label: language === 'hi' ? '✓ आपको यह योजना मिल सकती है' : '✓ You May Be Eligible',
      bg: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
      dot: 'bg-emerald-600'
    },
    potentially_eligible: {
      label: language === 'hi' ? '⚠ कागज़ या विवरण बाकी है' : '⚠ Action / Info Needed',
      bg: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      dot: 'bg-amber-600'
    },
    not_eligible: {
      label: language === 'hi' ? '✕ अभी शर्तें पूरी नहीं हैं' : '✕ Criteria Not Met',
      bg: 'bg-slate-100 text-slate-800 border-slate-300 font-semibold',
      dot: 'bg-slate-500'
    }
  }[overallStatus];

  const matchedRules = ruleEvaluations.filter(r => r.status === 'match');
  const pendingRules = ruleEvaluations.filter(r => r.status !== 'match');
  const isSpeaking = activeSpeechId === `scheme-${scheme.id}`;

  const handleListenCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    const schemeName = language === 'hi' ? scheme.nameHi : scheme.name;
    const benefit = scheme.benefitAmountEstimate || (language === 'hi' ? scheme.benefitTextHi : scheme.benefitText);
    const why = matchedRules.length > 0 ? (language === 'hi' ? matchedRules[0].reasonHi : matchedRules[0].reason) : '';
    
    const speech = language === 'hi'
      ? `${schemeName}। इसका अनुमानित लाभ है: ${benefit}। पात्रता: ${why}`
      : `${schemeName}. Estimated benefit is: ${benefit}. Eligibility: ${why}`;

    speakText(`scheme-${scheme.id}`, speech, language);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 sm:p-6 hover:border-brand-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
      
      {/* Top Meta & Badges */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${statusBadge.bg}`}>
              <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`}></span>
              <span>{statusBadge.label}</span>
            </span>

            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
              {scheme.level}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Listen Aloud Button */}
            <button
              type="button"
              onClick={handleListenCard}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                isSpeaking 
                  ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-200 animate-pulse' 
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
              }`}
              title={language === 'hi' ? 'बोलकर सुनें' : 'Listen aloud'}
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <span className="flex items-center gap-1 text-[11px]">
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span className="hidden sm:inline">{language === 'hi' ? 'सुनें' : 'Listen'}</span>
                </span>
              )}
            </button>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleSaveScheme(scheme.id); }}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved 
                  ? 'bg-amber-50 border-amber-300 text-amber-600' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
              title={isSaved ? t('action.saved') : t('action.save')}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scheme Name & Department */}
        <h3 
          onClick={onOpenDetails}
          className="text-lg sm:text-xl font-black text-slate-900 hover:text-brand-700 cursor-pointer transition-colors leading-snug"
        >
          {language === 'hi' ? scheme.nameHi : scheme.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{language === 'hi' ? scheme.departmentHi : scheme.department}</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {language === 'hi' ? scheme.shortDescriptionHi : scheme.shortDescription}
        </p>

        {/* High-Impact Benefit Callout Box for Rural Clarity */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200/80 rounded-2xl p-3.5 mb-3.5 flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase text-emerald-900 tracking-wide block">
              {language === 'hi' ? 'कुल सरकारी लाभ (Benefit):' : 'Government Benefit:'}
            </span>
            <p className="text-sm font-black text-emerald-950 leading-snug mt-0.5">
              {scheme.benefitAmountEstimate || (language === 'hi' ? scheme.benefitTextHi : scheme.benefitText)}
            </p>
          </div>
        </div>

        {/* Scoring & Criteria Breakdown (Statutory vs Document Readiness) */}
        <div className="grid grid-cols-2 gap-2 mb-3.5 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold block uppercase">
              {language === 'hi' ? 'पात्रता मिलान' : 'Statutory Match'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-black text-slate-900">{evaluation.statutoryMatchPercent}%</span>
              <span className="text-[10px] text-slate-500 font-medium">({matchedRulesCount}/{totalRulesCount})</span>
            </div>
          </div>
          <div className={`p-2.5 rounded-xl border ${evaluation.documentGapCount === 0 ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'}`}>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">
              {language === 'hi' ? 'कागज़ात तैयारी' : 'Documents'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-sm font-black ${evaluation.documentGapCount === 0 ? 'text-emerald-800' : 'text-amber-900'}`}>
                {evaluation.documentReadinessPercent}%
              </span>
              <span className="text-[10px] font-semibold text-slate-600">
                {evaluation.documentGapCount === 0 
                  ? (language === 'hi' ? 'सब तैयार ✓' : 'All ready') 
                  : (language === 'hi' ? `${evaluation.documentGapCount} कागज़ बाकी` : `${evaluation.documentGapCount} gap`)}
              </span>
            </div>
          </div>
        </div>

        {/* Why you're seeing this */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            {language === 'hi' ? 'आपको यह योजना क्यों मिल सकती है:' : 'Why you qualify:'}
          </span>
          
          {matchedRules.slice(0, 2).map((rule) => (
            <div key={rule.id} className="flex items-start gap-1.5 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{language === 'hi' ? rule.reasonHi : rule.reason}</span>
            </div>
          ))}

          {/* Pending / Missing Requirements Warning */}
          {pendingRules.slice(0, 1).map((rule) => (
            <div key={rule.id} className="flex items-start gap-1.5 text-xs text-amber-900 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
              <span className="line-clamp-1">
                <strong>{language === 'hi' ? 'कागज़ बाकी:' : 'Missing:'}</strong> {language === 'hi' ? rule.reasonHi : rule.reason}
              </span>
            </div>
          ))}
        </div>

        {/* Missing Requirements Bridge Alert */}
        {missingBridges.length > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 flex items-center justify-between gap-2">
            <span className="truncate">
              ⚠ <strong>{missingBridges.length}</strong> {language === 'hi' ? 'ज़रूरी कागज़ बनवाना होगा' : 'document(s) need action'}
            </span>
            <span className="text-[11px] font-bold text-brand-800 shrink-0 underline">
              {language === 'hi' ? 'तरीका देखें ➔' : 'View steps ➔'}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpenDetails}
          className="flex-1 py-2.5 px-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span>{language === 'hi' ? 'पूरी जानकारी व नियम देखें' : t('results.check_eligibility')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => addJourney(scheme.id)}
          className="py-2.5 px-3 rounded-xl border border-slate-300 hover:border-brand-600 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
        >
          {t('action.start_journey')}
        </button>
      </div>

    </div>
  );
};
