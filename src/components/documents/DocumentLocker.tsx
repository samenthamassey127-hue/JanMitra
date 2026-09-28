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

export const DocumentLocker: React.FC<{ onNavigateToService: (serviceId: string) => void }> = ({ onNavigateToService }) => {
  const { language, t } = useLanguage();
  const { documents, uploadDocument, setSelectedServiceId, setActiveTab } = useCitizen();

  const [selectedSchemeForMatch, setSelectedSchemeForMatch] = useState<string>('sch-up-post-matric');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessDoc, setUploadSuccessDoc] = useState<DocumentItem | null>(null);
  const [selectedDocCodeToUpload, setSelectedDocCodeToUpload] = useState<string>('domicile_cert');

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

  const handleSimulateUpload = async () => {
    setIsUploading(true);
    try {
      const doc = await uploadDocument({
        name: selectedDocCodeToUpload === 'domicile_cert' ? 'Domicile Certificate (UP)' : 'Income Certificate (Renewed)',
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

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Audit for:</label>
            <select
              value={selectedSchemeForMatch}
              onChange={(e) => setSelectedSchemeForMatch(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-brand-600 shadow-2xs"
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

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-full sm:w-auto flex-1">
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Select Document to Upload:
            </label>
            <select
              value={selectedDocCodeToUpload}
              onChange={(e) => setSelectedDocCodeToUpload(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white"
            >
              <option value="domicile_cert">Domicile Certificate (Niwas Praman Patra)</option>
              <option value="income_cert">Income Certificate (Aay Praman Patra - New Renewal)</option>
              <option value="disability_cert">UDID Disability Certificate</option>
              <option value="land_record">UP Bhulekh Khatauni Copy</option>
            </select>
          </div>

          <button
            type="button"
            disabled={isUploading}
            onClick={handleSimulateUpload}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {isUploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Scanning Document...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-saffron-300" />
                <span>Run Preliminary Document Check</span>
              </>
            )}
          </button>
        </div>

        {/* Scan Result Card */}
        {uploadSuccessDoc && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Preliminary Document Check Passed</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700 bg-white p-3 rounded-xl border border-emerald-100">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Document</span>
                <span className="font-bold text-slate-900">{uploadSuccessDoc.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Status</span>
                <span className="text-emerald-700 font-bold">✓ Available in Locker</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Quality Scan</span>
                <span className="text-slate-800">Unaltered / High Res</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Matched Schemes</span>
                <span className="text-brand-700 font-bold">+1 Requirement Met</span>
              </div>
            </div>
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
