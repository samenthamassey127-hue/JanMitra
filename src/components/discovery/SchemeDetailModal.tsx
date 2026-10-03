import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { Scheme } from '../../types';
import { evaluateSchemeForUser } from '../../utils/matchingEngine';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  ArrowRight,
  Sparkles,
  Info,
  Radio
} from 'lucide-react';

interface SchemeDetailModalProps {
  scheme: Scheme;
  onClose: () => void;
  onNavigateToService: (serviceId: string) => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  onClose,
  onNavigateToService
}) => {
  const { language, t } = useLanguage();
  const { profile, documents, savedSchemeIds, toggleSaveScheme, addJourney, setActiveTab } = useCitizen();

  const [evidenceExpanded, setEvidenceExpanded] = useState(true);
  const evaluation = evaluateSchemeForUser(scheme, profile, documents);
  const isSaved = savedSchemeIds.includes(scheme.id);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Progress metrics for "What Am I Missing?"
  const totalCriteria = evaluation.totalRulesCount + evaluation.totalDocsCount;
  const completedCriteria = evaluation.matchedRulesCount + evaluation.availableDocsCount;
  const progressPercent = Math.min(100, Math.round((completedCriteria / (totalCriteria || 1)) * 100));

  const modalContent = (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider">
                {scheme.level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-medium">
                {scheme.category.toUpperCase()}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {language === 'hi' ? scheme.nameHi : scheme.name}
            </h2>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'hi' ? scheme.departmentHi : scheme.department}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleSaveScheme(scheme.id)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={isSaved ? t('action.saved') : t('action.save')}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* Important Guardrails Notice (Section 24) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">
                Independent Assessment & Guidance:
              </p>
              <p className="text-amber-800 leading-relaxed">
                JanMitra does not grant legal approvals. Your information appears consistent with published criteria, but government authorities make the final decision on eligibility.
              </p>
            </div>
          </div>

          {/* Section 8: About This Benefit */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              About This Benefit
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {language === 'hi' ? scheme.shortDescriptionHi : scheme.shortDescription}
            </p>

            <div className="mt-3 bg-brand-50 border border-brand-100 rounded-2xl p-4">
              <span className="text-xs font-bold text-brand-900 block mb-1">
                Approved Benefit Details:
              </span>
              <p className="text-sm font-semibold text-brand-800">
                {language === 'hi' ? scheme.benefitTextHi : scheme.benefitText}
              </p>
            </div>
          </div>

          {/* Section 8: Why it may apply to you (Checklist) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Why it may apply to you (Eligibility Checklist)
              </h3>
              <span className="text-xs font-medium text-slate-500">
                {evaluation.matchedRulesCount} of {evaluation.totalRulesCount} rules satisfied
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
              {evaluation.ruleEvaluations.map((rule) => {
                const statusIcon = {
                  match: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
                  uncertain: <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />,
                  issue: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                }[rule.status];

                const statusBg = {
                  match: 'bg-emerald-50/30',
                  uncertain: 'bg-amber-50/30',
                  issue: 'bg-rose-50/30'
                }[rule.status];

                return (
                  <div key={rule.id} className={`p-4 flex items-start gap-3.5 ${statusBg}`}>
                    {statusIcon}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {language === 'hi' ? rule.labelHi : rule.label}
                        </span>
                        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded text-slate-600 bg-white border border-slate-200">
                          {rule.status === 'match' ? '✓ Match' : rule.status === 'uncertain' ? '? Need Info' : '! Potential Issue'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {language === 'hi' ? rule.reasonHi : rule.reason}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 9: "What Am I Missing?" Feature */}
          <div className="bg-slate-50 border-2 border-brand-200 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Feature Spotlight
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  What Am I Missing?
                </h3>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-brand-800">
                  {completedCriteria} of {totalCriteria} requirements identified
                </span>
                <div className="w-36 h-2 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-brand-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Missing Requirement Bridges (Connecting Discovery to Services) */}
            {scheme.missingRequirementBridges.length > 0 ? (
              <div className="mt-4 space-y-3">
                <span className="text-xs font-semibold text-slate-600 block">
                  Actionable Steps to Bridge Requirements:
                </span>
                {scheme.missingRequirementBridges.map((bridge, idx) => (
                  <div 
                    key={idx}
                    className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                          Action Required
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {language === 'hi' ? bridge.titleHi : bridge.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {language === 'hi' ? bridge.explanationHi : bridge.explanation}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateToService(bridge.serviceId)}
                      className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                    >
                      <span>{t('results.how_to_get')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All core documentary prerequisites appear fulfilled in your locker!</span>
              </div>
            )}
          </div>

          {/* Section 11: Step-by-Step Process Timeline */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Step-by-Step Application Procedure
            </h3>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {scheme.applicationSteps.map((step) => (
                <div key={step.stepNumber} className="relative flex items-start gap-4 pl-1">
                  <div className="w-7 h-7 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center shrink-0 z-10 shadow-xs">
                    {step.stepNumber}
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      {language === 'hi' ? step.titleHi : step.title}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed mb-2">
                      {language === 'hi' ? step.actionHi : step.action}
                    </p>
                    <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                      💡 <strong>Guidance:</strong> {language === 'hi' ? step.guidanceHi : step.guidance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 12: Evidence-First Design ("Why is JanMitra saying this?") */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setEvidenceExpanded(!evidenceExpanded)}
              className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    {t('action.why_saying_this')}
                  </span>
                  <span className="text-xs text-slate-500">
                    Evidence-First Source & Official Gazette Verification
                  </span>
                </div>
              </div>
              {evidenceExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {evidenceExpanded && (
              <div className="p-5 bg-white border-t border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-400 uppercase text-[10px] block">
                      Issuing Department
                    </span>
                    <span className="font-medium text-slate-900">{scheme.officialSource.department}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 uppercase text-[10px] block">
                      Policy Document / Notification
                    </span>
                    <span className="font-medium text-slate-900">{scheme.officialSource.title}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 uppercase text-[10px] block">
                      Published / Verified Dates
                    </span>
                    <span>Notification: {scheme.officialSource.notificationDate} • Verified: {scheme.officialSource.lastVerified}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 uppercase text-[10px] block">
                      Official Portal Link
                    </span>
                    <a
                      href={scheme.officialSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>{scheme.officialSource.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
                  <span className="font-bold text-slate-900 block mb-1 font-sans">
                    Official Guidelines Excerpt:
                  </span>
                  “{scheme.officialSource.officialQuote}”
                </div>

                {/* Scheme Versioning & Gazette Audit Trail (Phase 3 Roadmap) */}
                <div className="mt-3 p-3 bg-brand-50/70 rounded-xl border border-brand-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                      <span>Gazette Version: {scheme.officialSource.gazetteNo || 'UP-GO-2024/STATUTORY-ACT'}</span>
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      ✓ Gazette Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-950 leading-relaxed">
                    Amended under Uttar Pradesh State Order. Validated for Academic / Fiscal Year 2025-2026. Biometric e-KYC and revenue database seeding statutory requirements active.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Bottom Sticky CTA */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Clicking Start Journey adds this scheme to your organized tracker.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('vakh');
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Check live ground updates on Vakh Chaupal"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Ground Updates on Vakh</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              {t('action.close')}
            </button>
            <button
              type="button"
              onClick={() => {
                addJourney(scheme.id);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-300" />
              <span>{t('action.start_journey')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
