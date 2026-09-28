import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { 
  GitBranch, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface DependencyTreeProps {
  schemeTitle?: string;
  dependencies: Array<{
    name: string;
    nameHi?: string;
    status: 'satisfied' | 'pending' | 'blocked';
    serviceId?: string;
    documentCode?: string;
  }>;
  onResolveService?: (serviceId: string) => void;
}

export const DependencyTree: React.FC<DependencyTreeProps> = ({
  schemeTitle = 'UP Post-Matric Scholarship',
  dependencies,
  onResolveService
}) => {
  const { language } = useLanguage();

  // Find the first pending dependency to offer as "Next Recommended Step"
  const pendingDep = dependencies.find(d => d.status !== 'satisfied');

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
            Differentiator • Dependency Engine
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-brand-700" />
            <span>Government Service Dependency Graph</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Understand how administrative documents link together before official application submission.
          </p>
        </div>

        {pendingDep && onResolveService && pendingDep.serviceId && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                Next Recommended Step:
              </span>
              <span className="text-xs font-bold text-slate-900">
                Obtain {pendingDep.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onResolveService(pendingDep.serviceId!)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span>Resolve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Visual Tree Node Graph */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 font-mono text-xs text-slate-800 overflow-x-auto">
        
        {/* Root Scheme Node */}
        <div className="flex items-center gap-2 font-sans font-bold text-sm text-brand-900 bg-brand-100/70 border border-brand-200 px-4 py-2 rounded-xl w-fit mb-4 shadow-2xs">
          <FileText className="w-4 h-4 text-brand-700" />
          <span>{schemeTitle}</span>
        </div>

        {/* Tree Connectors & Children */}
        <div className="pl-4 space-y-3 font-sans">
          {dependencies.map((dep, idx) => {
            const isLast = idx === dependencies.length - 1;
            const isSatisfied = dep.status === 'satisfied';

            return (
              <div key={idx} className="flex items-center gap-3 relative pl-6 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-5 before:h-px before:bg-slate-300">
                {/* Vertical branch line */}
                <div className={`absolute left-0 w-px bg-slate-300 ${isLast ? 'top-0 h-1/2' : 'top-0 h-full'}`}></div>

                {/* Node Box */}
                <div className={`p-3 rounded-xl border flex-1 max-w-lg flex items-center justify-between gap-3 shadow-2xs ${
                  isSatisfied 
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' 
                    : 'bg-white border-amber-200 text-slate-900 ring-1 ring-amber-100'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {isSatisfied ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-xs block">
                        {language === 'hi' && dep.nameHi ? dep.nameHi : dep.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {isSatisfied ? 'Available in locker' : 'Action required before scheme lock'}
                      </span>
                    </div>
                  </div>

                  {!isSatisfied && dep.serviceId && onResolveService && (
                    <button
                      type="button"
                      onClick={() => onResolveService(dep.serviceId!)}
                      className="px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs border border-brand-200 flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>Open Service</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>✓ = Satisfied from your Document Locker</span>
        <span>⚠ = Prerequisite that blocks final approval</span>
      </div>

    </div>
  );
};
