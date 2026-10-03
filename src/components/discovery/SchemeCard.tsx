import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { SchemeEvaluationResult } from '../../utils/matchingEngine';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Bookmark, 
  ArrowRight, 
  Building2, 
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface SchemeCardProps {
  evaluation: SchemeEvaluationResult;
  onOpenDetails: () => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ evaluation, onOpenDetails }) => {
  const { language, t } = useLanguage();
  const { savedSchemeIds, toggleSaveScheme, addJourney } = useCitizen();

  const { scheme, overallStatus, ruleEvaluations, matchedRulesCount, totalRulesCount, missingBridges } = evaluation;
  const isSaved = savedSchemeIds.includes(scheme.id);

  // Status styles & cautious language
  const statusBadge = {
    likely_eligible: {
      label: language === 'hi' ? 'आप पात्र हो सकते हैं' : 'You May Be Eligible',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500'
    },
    potentially_eligible: {
      label: language === 'hi' ? 'संभावित रूप से पात्र (अतिरिक्त जानकारी चाहिए)' : 'Potentially Eligible (Info Needed)',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500'
    },
    not_eligible: {
      label: language === 'hi' ? 'वर्तमान में पात्रता मानदंड से मेल नहीं खाता' : 'Criteria Not Met (See Details)',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400'
    }
  }[overallStatus];

  const matchedRules = ruleEvaluations.filter(r => r.status === 'match');
  const pendingRules = ruleEvaluations.filter(r => r.status !== 'match');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
      
      {/* Top Meta & Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
              <span>{statusBadge.label}</span>
            </span>

            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium uppercase tracking-wider">
              {scheme.level}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggleSaveScheme(scheme.id); }}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSaved 
                ? 'bg-amber-50 border-amber-300 text-amber-600' 
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700'
            }`}
            title={isSaved ? t('action.saved') : t('action.save')}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Scheme Name & Department */}
        <h3 
          onClick={onOpenDetails}
          className="text-lg font-bold text-slate-900 hover:text-brand-700 cursor-pointer transition-colors leading-snug"
        >
          {language === 'hi' ? scheme.nameHi : scheme.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{language === 'hi' ? scheme.departmentHi : scheme.department}</span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {language === 'hi' ? scheme.shortDescriptionHi : scheme.shortDescription}
        </p>

        {/* Potential Benefit Display */}
        <div className="bg-brand-50/60 border border-brand-100 rounded-xl p-3 mb-3">
          <span className="text-[11px] font-semibold text-brand-900 block mb-0.5">
            {t('results.potential_benefit')} (Estimated):
          </span>
          <p className="text-xs font-bold text-brand-800 leading-snug">
            {scheme.benefitAmountEstimate || (language === 'hi' ? scheme.benefitTextHi : scheme.benefitText)}
          </p>
        </div>

        {/* Scoring & Criteria Breakdown (Statutory vs Document Readiness) */}
        <div className="grid grid-cols-2 gap-2 mb-3.5">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Statutory Match</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-extrabold text-slate-900">{evaluation.statutoryMatchPercent}%</span>
              <span className="text-[10px] text-slate-500 font-medium">({matchedRulesCount}/{totalRulesCount} rules)</span>
            </div>
          </div>
          <div className={`p-2.5 rounded-xl border ${evaluation.documentGapCount === 0 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'}`}>
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Document Readiness</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-sm font-extrabold ${evaluation.documentGapCount === 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                {evaluation.documentReadinessPercent}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {evaluation.documentGapCount === 0 ? 'All ready' : `${evaluation.documentGapCount} gap`}
              </span>
            </div>
          </div>
        </div>

        {/* Why you're seeing this (Section 7 requirement) */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {t('results.why_matched')}:
          </span>
          
          {matchedRules.slice(0, 3).map((rule) => (
            <div key={rule.id} className="flex items-start gap-1.5 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{language === 'hi' ? rule.reasonHi : rule.reason}</span>
            </div>
          ))}

          {/* Pending / Missing Requirements Warning */}
          {pendingRules.slice(0, 1).map((rule) => (
            <div key={rule.id} className="flex items-start gap-1.5 text-xs text-amber-800 bg-amber-50/70 px-2 py-1 rounded-md border border-amber-200/60">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
              <span className="line-clamp-1">
                <strong>{t('results.missing_info')}:</strong> {language === 'hi' ? rule.reasonHi : rule.reason}
              </span>
            </div>
          ))}
        </div>

        {/* Missing Requirements Bridge Alert (Section 9) */}
        {missingBridges.length > 0 && (
          <div className="mb-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between gap-2">
            <span className="truncate">
              ⚠ <strong>{missingBridges.length} requirement(s)</strong> need action
            </span>
            <span className="text-[11px] font-semibold text-brand-700 shrink-0">
              View bridges →
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpenDetails}
          className="px-3.5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <span>{t('results.check_eligibility')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => addJourney(scheme.id)}
          className="px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
        >
          {t('action.start_journey')}
        </button>
      </div>

    </div>
  );
};
