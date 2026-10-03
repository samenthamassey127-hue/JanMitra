import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { simplifyLegalWithBackend } from '../../utils/apiClient';
import { ALL_LEGAL_SNIPPETS } from '../../data/legalSnippets';
import { LegalSnippet } from '../../types';
import { 
  HelpCircle, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check,
  Send,
  Building2,
  RefreshCw
} from 'lucide-react';

export const GovernmentSimplifier: React.FC = () => {
  const { language } = useLanguage();
  const { selectedLegalSnippetId, setSelectedLegalSnippetId } = useCitizen();

  const [activeSnippetId, setActiveSnippetId] = useState<string>(
    selectedLegalSnippetId || ALL_LEGAL_SNIPPETS[0].id
  );
  const [customText, setCustomText] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customResult, setCustomResult] = useState<{
    engine: string;
    title: string;
    whatItMeans: string;
    whoGetsIt: string;
    actionStep: string;
    caution: string;
  } | null>(null);

  const activeSnippet = ALL_LEGAL_SNIPPETS.find(s => s.id === activeSnippetId) || ALL_LEGAL_SNIPPETS[0];

  const handleCustomSimplify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    setIsSimplifying(true);
    try {
      const res = await simplifyLegalWithBackend(customText, language);
      if (res?.simplified) {
        setCustomResult({
          engine: res.engine || 'JanMitra Intelligence Engine',
          ...res.simplified
        });
      }
    } catch (err) {
      console.log('Simplification fallback:', err);
    } finally {
      setIsSimplifying(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(language === 'hi' ? activeSnippet.simpleExplanationHi : activeSnippet.simpleExplanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Feature Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          AI Government Language Simplifier
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
          Explain This: Government Language → Human Action
        </h2>
        <p className="text-slate-600 text-sm mt-1 leading-relaxed">
          Paste dense bureaucratic gazettes, court orders, or notifications to extract clear, plain-language directions and avoid common filing traps.
        </p>
      </div>

      {/* Preset Official Government Snippets */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Choose a Real Government Order to Simplify:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ALL_LEGAL_SNIPPETS.map(snippet => (
            <button
              key={snippet.id}
              type="button"
              onClick={() => {
                setActiveSnippetId(snippet.id);
                setSelectedLegalSnippetId(snippet.id);
                setCustomText('');
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                activeSnippetId === snippet.id
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-bold block mb-1">
                {language === 'hi' ? snippet.titleHi : snippet.title}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {snippet.officialDepartment}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Textarea Input Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleCustomSimplify} className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Or Paste Custom Gazette Clause / Circular Text:
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={3}
            placeholder='Paste complicated clause here, e.g. "The applicant shall submit a self-attested declaration affirming that..."'
            className="w-full p-3.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              JanMitra matches statutory terms against official legal glossaries.
            </span>
            <button
              type="submit"
              disabled={isSimplifying || !customText.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {isSimplifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Simplifying...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-saffron-300" />
                  <span>Translate to Human Language</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Custom AI Simplification Result Card */}
      {customResult && (
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 rounded-3xl border-2 border-indigo-200 p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100/70 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {customResult.engine}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1.5">{customResult.title}</h3>
            </div>
            <button
              onClick={() => setCustomResult(null)}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>

          {/* What it means */}
          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs space-y-1">
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              What this clause means in plain words:
            </span>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {customResult.whatItMeans}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Who gets it */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider block text-[10px]">
                Who Qualifies / Applicable To:
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {customResult.whoGetsIt}
              </p>
            </div>

            {/* Action Step */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-800 uppercase tracking-wider block text-[10px]">
                Immediate Action Required:
              </span>
              <p className="text-emerald-950 leading-relaxed font-medium">
                {customResult.actionStep}
              </p>
            </div>
          </div>

          {/* Caution */}
          {customResult.caution && (
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Common Rejection Trap to Avoid:</span>
                <span className="leading-relaxed">{customResult.caution}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Snippet Simplification Showcase (Section 18) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
        
        {/* Original Source Quote Box */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Original Gazette / Circular Wording</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {activeSnippet.sourceDocument}
            </span>
          </div>

          <p className="font-serif italic text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
            {activeSnippet.originalText}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
            <Building2 className="w-3 h-3 text-slate-400" />
            <span>{activeSnippet.officialDepartment}</span>
          </div>
        </div>

        {/* Translation 1: In Simple Language */}
        <div className="bg-brand-50/70 border border-brand-200 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-saffron-500" />
              <span>In Simple Language:</span>
            </h3>

            <button
              onClick={copyToClipboard}
              className="px-2.5 py-1 rounded-md bg-white border border-brand-200 text-brand-800 text-[11px] font-medium flex items-center gap-1 hover:bg-brand-50"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-sm font-semibold text-brand-950 leading-relaxed">
            {language === 'hi' ? activeSnippet.simpleExplanationHi : activeSnippet.simpleExplanation}
          </p>
        </div>

        {/* Translation 2: What You Need To Do */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            What You Need To Do (Action Checklist):
          </h3>
          <div className="space-y-2.5">
            {(language === 'hi' ? activeSnippet.actionStepsHi : activeSnippet.actionSteps).map((step, idx) => (
              <div 
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-800"
              >
                <div className="w-5 h-5 rounded-full bg-brand-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Translation 3: Watch Out For / Common Pitfalls */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Common Traps to Avoid (Rejection Warnings):</span>
          </h3>
          <div className="space-y-2">
            {(language === 'hi' ? activeSnippet.pitfallsHi : activeSnippet.pitfalls).map((pitfall, idx) => (
              <div 
                key={idx}
                className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5"
              >
                <span className="text-amber-600 font-bold shrink-0">⚠</span>
                <span className="leading-relaxed">{pitfall}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Translation 4: Official Source Attribution (Section 12) */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Source: {activeSnippet.sourceDocument}</span>
          </div>
          <span>Last audit: {activeSnippet.lastVerified}</span>
        </div>

      </div>

    </div>
  );
};
