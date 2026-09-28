import React, { useState } from 'react';
import { useCitizen } from '../../context/CitizenContext';
import { 
  ShieldCheck, 
  Download, 
  Trash2, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  FileText
} from 'lucide-react';

export const PrivacyCenter: React.FC = () => {
  const { exportDataJson, resetAllData } = useCitizen();
  const [resetConfirm, setResetConfirm] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JanMitra_CitizenVault_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleReset = () => {
    resetAllData();
    setResetConfirm(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Privacy Center & Citizen Data Sovereignty
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            JanMitra does not track, monetize, or transmit your sensitive documents to remote advertising servers.
          </p>
        </div>
      </div>

      {/* Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <Lock className="w-4 h-4 text-brand-700" />
            <span>What data JanMitra stores:</span>
          </span>
          <p className="text-slate-600 leading-relaxed">
            Only the demographic attributes (age, district, income range) and document records you explicitly provide. All records are stored locally in your browser's private vault (LocalStorage).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Why it is used:</span>
          </span>
          <p className="text-slate-600 leading-relaxed">
            Strictly to execute deterministic eligibility rules, calculate document deficits, and populate your personalized step-by-step government service roadmap.
          </p>
        </div>
      </div>

      {/* Export & Reset Actions */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-900 block">Export or Purge Data</span>
          <span className="text-[11px] text-slate-500">Download a full JSON backup of your records or wipe this device.</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{downloaded ? 'Vault Exported!' : 'Export Vault (JSON)'}</span>
          </button>

          {!resetConfirm ? (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset All Data</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="px-2.5 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
