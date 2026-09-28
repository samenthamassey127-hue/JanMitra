import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { GovernmentService } from '../../types';
import { 
  Building2, 
  Clock, 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  Bookmark, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  X,
  FileText
} from 'lucide-react';

interface ServiceDetailProps {
  service: GovernmentService;
  onClose?: () => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onClose }) => {
  const { language, t } = useLanguage();
  const { documents, savedServiceIds, toggleSaveService, addJourney } = useCitizen();
  const [evidenceExpanded, setEvidenceExpanded] = useState(true);

  const isSaved = savedServiceIds.includes(service.id);

  // Map service requirements against user's uploaded locker
  const docStatusMap = new Map(documents.map(d => [d.code, d]));

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg animate-in fade-in">
      
      {/* Top Banner & Department Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 border-b border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider">
                {service.state} Public Service
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 text-xs font-medium">
                {service.serviceCategory}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === 'hi' ? service.nameHi : service.name}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{language === 'hi' ? service.departmentHi : service.department}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleSaveService(service.id)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={isSaved ? t('action.saved') : t('action.save')}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Essential Quick Facts Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Official Portal Fee:</span>
            <span className="text-white font-bold">{language === 'hi' ? service.feesHi : service.fees}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Processing SLA:</span>
            <span className="text-white font-bold">{language === 'hi' ? service.processingTimeHi : service.processingTime}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Assisted Offline Option:</span>
            <span className="text-white font-bold">{language === 'hi' ? service.offlineOptionHi : service.offlineOption}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5 font-medium">Official Portal:</span>
            <a 
              href={service.officialPortal.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-saffron-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>{service.officialPortal.name}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        
        {/* Section 10: "What is this?" */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
            What is this?
          </h2>
          <p className="text-slate-800 text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {language === 'hi' ? service.shortDescriptionHi : service.shortDescription}
          </p>
        </div>

        {/* Section 10: "What you need" Checklist with user status */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              What you need (Document Requirements)
            </h2>
            <span className="text-xs text-slate-500">
              Matched against your Document Locker
            </span>
          </div>

          <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
            {service.requiredDocumentCodes.map(code => {
              const userDoc = docStatusMap.get(code);
              const isAvailable = userDoc?.status === 'available';
              const isExpired = userDoc?.status === 'expired';

              return (
                <div 
                  key={code} 
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isAvailable ? 'bg-emerald-50/20' : isExpired ? 'bg-amber-50/30' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isAvailable ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    ) : isExpired ? (
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-slate-400">
                        ?
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {userDoc?.name || code}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold uppercase">
                          Mandatory
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {userDoc?.description || 'Mandatory administrative proof required for verification.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isAvailable 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isExpired 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {isAvailable ? '✓ Available' : isExpired ? '⚠ Expired' : '○ Missing'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 11: Step-by-Step Procedure Timeline */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Step-by-Step Official Procedure
          </h2>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {service.steps.map((st) => (
              <div key={st.stepNumber} className="relative flex items-start gap-4 pl-1">
                <div className="w-7 h-7 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center shrink-0 z-10 shadow-xs">
                  {st.stepNumber}
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {language === 'hi' ? st.titleHi : st.title}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Where: {language === 'hi' ? st.whereToGoHi : st.whereToGo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {language === 'hi' ? st.actionHi : st.action}
                  </p>

                  <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60">
                    ➡️ <strong>What happens afterward:</strong> {language === 'hi' ? st.nextConsequenceHi : st.nextConsequence}
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
            className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  {t('action.why_saying_this')}
                </span>
                <span className="text-xs text-slate-500">
                  Direct Statutory Authority & Service Guarantee Act References
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
                    Responsible Authority
                  </span>
                  <span className="font-medium text-slate-900">{service.officialSource.department}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 uppercase text-[10px] block">
                    Citizen Charter / Act Order
                  </span>
                  <span className="font-medium text-slate-900">{service.officialSource.title}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 uppercase text-[10px] block">
                    Gazette / Verification Dates
                  </span>
                  <span>Notification: {service.officialSource.notificationDate} • Verified: {service.officialSource.lastVerified}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 uppercase text-[10px] block">
                    Direct Official Portal
                  </span>
                  <a
                    href={service.officialSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>{service.officialSource.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
                <span className="font-bold text-slate-900 block mb-1 font-sans">
                  Official Public Service Rules Excerpt:
                </span>
                “{service.officialSource.excerpt}”
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <a
            href={service.officialPortal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-700 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Open {service.officialPortal.name}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => addJourney(undefined, service.id)}
            className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-saffron-300" />
            <span>Track This Service in My Journey</span>
          </button>
        </div>

      </div>

    </div>
  );
};
