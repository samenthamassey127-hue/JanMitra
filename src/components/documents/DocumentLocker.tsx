import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { DocumentItem } from '../../types';
import { ALL_SCHEMES } from '../../data/schemes';
import { ALL_SERVICES } from '../../data/services';
import { 
  FolderCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Plus, 
  ExternalLink,
  Info,
  Sparkles,
  Calendar,
  Building2,
  X
} from 'lucide-react';

import { scanDocumentWithBackend } from '../../utils/apiClient';

export const DocumentLocker: React.FC<{ onNavigateToService: (serviceId: string) => void }> = ({ onNavigateToService }) => {
  const { language, t } = useLanguage();
  const { documents, uploadDocument, setSelectedServiceId, setActiveTab } = useCitizen();

  const [selectedSchemeForMatch, setSelectedSchemeForMatch] = useState<string>('sch-up-post-matric');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessDoc, setUploadSuccessDoc] = useState<DocumentItem | null>(null);
  const [selectedDocCodeToUpload, setSelectedDocCodeToUpload] = useState<string>('income_cert');
  const [ocrResult, setOcrResult] = useState<{
    engine: string;
    docType: string;
    documentNumber: string;
    holderName: string;
    annualIncome: number | null;
    issueDate: string | null;
    confidence: number;
    status: string;
    warning: string | null;
  } | null>(null);

  // Document to Service Matching logic (Section 14)
  const currentTargetScheme = ALL_SCHEMES.find(s => s.id === selectedSchemeForMatch) || ALL_SCHEMES[0];
  const requiredCodes = currentTargetScheme.requiredDocumentCodes;

  const matchedDocs = requiredCodes.map(code => {
    const doc = documents.find(d => d.code === code);
    return {
      code,
      name: doc?.name || code,
      status: doc ? doc.status : 'missing',
      relatedServiceId: doc?.relatedServiceId || (code === 'domicile_cert' ? 'srv-domicile-cert' : code === 'income_cert' ? 'srv-income-cert' : undefined)
    };
  });

  const availableCount = matchedDocs.filter(d => d.status === 'available').length;
  const missingCount = matchedDocs.filter(d => d.status !== 'available').length;

  const handleSimulateUpload = async (fileObj?: File) => {
    setIsUploading(true);
    setOcrResult(null);

    try {
      let res: any = null;
      const formData = new FormData();
      if (fileObj) {
        formData.append('file', fileObj);
        formData.append('docHint', selectedDocCodeToUpload);
        res = await scanDocumentWithBackend(formData);
      } else {
        formData.append('docHint', selectedDocCodeToUpload);
        res = await scanDocumentWithBackend(formData);
      }

      const ext = res?.extraction;
      const val = res?.validity;

      if (ext) {
        setOcrResult({
          engine: res.engine || 'Statutory OCR',
          docType: ext.docType || 'Government Certificate',
          documentNumber: ext.documentNumber || '24151001004829',
          holderName: ext.holderName || 'Rameshwar Sharma',
          annualIncome: ext.annualIncome || null,
          issueDate: ext.issueDate || '2024-06-15',
          confidence: Math.round((ext.confidence || 0.95) * 100),
          status: val?.status || 'Valid & Active',
          warning: val?.warning || null
        });
      }

      const docName = ext?.docType || (selectedDocCodeToUpload === 'domicile_cert' ? 'Domicile Certificate (UP)' : 'Income Certificate (Renewed)');
      const doc = await uploadDocument({
        name: docName,
        type: 'Revenue Certificate',
        categoryCode: selectedDocCodeToUpload
      });
      setUploadSuccessDoc(doc);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Document Intelligence
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <FolderCheck className="w-6 h-6 text-amber-600" />
            <span>My Documents & Locker</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Organize personal credentials and run preliminary document readiness checks for public services.
          </p>
        </div>

        {/* Upload Action Button */}
        <button
          type="button"
          onClick={() => { setUploadSuccessDoc(null); setIsUploading(false); }}
          className="px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document (Scan)</span>
        </button>
      </div>

      {/* Critical Guardrail Banner (Section 13) */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 text-xs flex items-start gap-3 border border-slate-800">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">
            Preliminary Document Check Notice:
          </p>
          <p className="text-slate-300 leading-relaxed">
            JanMitra performs non-authoritative structural and formatting checks. We never claim legal validation; official verification is completed exclusively by government issuing officers.
          </p>
        </div>
      </div>

      {/* Section 14: Document-to-Service Matching Interactive Tool */}
      <div className="bg-white rounded-3xl border-2 border-brand-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
              Automatic Matcher
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Document-to-Service Readiness
            </h3>
            <p className="text-xs text-slate-500">
              Select any program to automatically audit your document locker against its requirements.
            </p>
          </div>

          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <label className="text-xs font-semibold text-slate-600 shrink-0">Audit for:</label>
            <select
              value={selectedSchemeForMatch}
              onChange={(e) => setSelectedSchemeForMatch(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-brand-600 shadow-2xs w-full sm:w-auto max-w-[260px] sm:max-w-xs md:max-w-sm truncate"
            >
              {ALL_SCHEMES.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Readiness Bar */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              {currentTargetScheme.name}
            </span>
            <span className="text-xs text-slate-500">
              {availableCount} of {requiredCodes.length} mandatory documents ready in your locker.
            </span>
          </div>

          <div className="flex items-center gap-3">
            {missingCount > 0 ? (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>{missingCount} document(s) still required</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>All documents ready for submission</span>
              </span>
            )}
          </div>
        </div>

        {/* Checklist of audited docs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {matchedDocs.map((item, idx) => {
            const isAvail = item.status === 'available';
            const isExpired = item.status === 'expired';

            return (
              <div 
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  isAvail 
                    ? 'bg-emerald-50/40 border-emerald-200' 
                    : isExpired 
                    ? 'bg-amber-50/50 border-amber-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isAvail ? 'bg-emerald-100 text-emerald-800' : isExpired ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isAvail ? '✓ Ready' : isExpired ? '⚠ Expired' : '○ Missing'}
                    </span>
                  </div>
                </div>

                {!isAvail && item.relatedServiceId && (
                  <button
                    type="button"
                    onClick={() => onNavigateToService(item.relatedServiceId!)}
                    className="mt-2 text-left text-[11px] font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>How do I obtain this?</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Simulation Card (Section 13) */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Upload className="w-5 h-5 text-brand-700" />
          <span>Simulated Document Ingestion & Preliminary Check</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Test how JanMitra analyzes uploaded scans, detects expiry dates, and updates your scheme readiness.
        </p>

        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-auto flex-1">
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Select Document Type or Scan Template:
              </label>
              <select
                value={selectedDocCodeToUpload}
                onChange={(e) => setSelectedDocCodeToUpload(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white"
              >
                <option value="income_cert">Income Certificate (Aay Praman Patra - New Renewal)</option>
                <option value="domicile_cert">Domicile Certificate (Niwas Praman Patra)</option>
                <option value="aadhaar_card">Aadhaar Card (UIDAI Smart ID)</option>
                <option value="land_record">UP Bhulekh Khatauni Copy (Land Record)</option>
              </select>
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2 pt-4 sm:pt-5">
              <label className="px-4 py-2 rounded-xl border border-dashed border-slate-300 hover:border-brand-600 hover:bg-brand-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-brand-600" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSimulateUpload(file);
                  }}
                />
              </label>

              <button
                type="button"
                disabled={isUploading}
                onClick={() => handleSimulateUpload()}
                className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Scanning OCR...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-saffron-300" />
                    <span>Scan & Classify</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Supports official documents in Hindi and English: UIDAI Aadhaar, UP e-District Certificates, and Bhulekh Khatauni copies.
          </p>
        </div>

        {/* Scan & OCR Result Card (Phase 3 Roadmap) */}
        {ocrResult && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{ocrResult.docType}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {ocrResult.status}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Engine: {ocrResult.engine} | OCR Confidence: {ocrResult.confidence}%
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                Doc Ref: {ocrResult.documentNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Holder Name</span>
                <span className="font-bold text-white">{ocrResult.holderName}</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Issue Date</span>
                <span className="font-bold text-white">{ocrResult.issueDate || 'Verified'}</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Annual Income</span>
                <span className="font-bold text-emerald-400">
                  {ocrResult.annualIncome ? `₹${ocrResult.annualIncome.toLocaleString('en-IN')}` : 'N/A (Non-income doc)'}
                </span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Statutory Validity</span>
                <span className="font-bold text-white">3-Year Valid (UP Act)</span>
              </div>
            </div>

            {ocrResult.warning && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{ocrResult.warning}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Document Locker Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          All Credential Records in Vault ({documents.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => {
            const isAvail = doc.status === 'available';
            const isExpired = doc.status === 'expired';

            return (
              <div 
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase">
                      {doc.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isAvail 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isExpired 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isAvail ? '✓ Available' : isExpired ? '⚠ Expired' : '○ Missing'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {language === 'hi' ? doc.nameHi : doc.name}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1 mb-3 line-clamp-2 leading-relaxed">
                    {language === 'hi' ? doc.descriptionHi : doc.description}
                  </p>

                  {/* Metadata preview */}
                  <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Issuer:</span>
                      <span className="font-medium truncate max-w-[150px]">{doc.issuingAuthority || 'Government Authority'}</span>
                    </div>
                    {doc.expiryDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Validity:</span>
                        <span className={`font-semibold ${isExpired ? 'text-amber-700' : 'text-slate-700'}`}>
                          {doc.expiryDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {doc.relatedServiceId ? (
                    <button
                      type="button"
                      onClick={() => onNavigateToService(doc.relatedServiceId!)}
                      className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>How to obtain →</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">Statutory Record</span>
                  )}

                  {isAvail && (
                    <span className="text-[11px] text-slate-400">
                      {doc.fileSize || 'PDF Document'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
