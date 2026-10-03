import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { ALL_SCHEMES } from '../../data/schemes';
import { ALL_SERVICES } from '../../data/services';
import { ALL_DOCUMENTS } from '../../data/documents';
import { 
  Search, 
  X, 
  Compass, 
  FileText, 
  FolderCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { language, t } = useLanguage();
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    setSelectedSchemeId, 
    setSelectedServiceId, 
    setActiveTab 
  } = useCitizen();

  const [query, setQuery] = useState('');
  const [activeSegment, setActiveSegment] = useState<'all' | 'schemes' | 'services' | 'documents'>('all');

  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredSchemes = ALL_SCHEMES.filter(s => 
    !q || s.name.toLowerCase().includes(q) || s.nameHi.toLowerCase().includes(q) || s.tags.some(tag => tag.includes(q))
  );

  const filteredServices = ALL_SERVICES.filter(s => 
    !q || s.name.toLowerCase().includes(q) || s.nameHi.toLowerCase().includes(q) || s.serviceCategory.toLowerCase().includes(q)
  );

  const filteredDocs = ALL_DOCUMENTS.filter(d => 
    !q || d.name.toLowerCase().includes(q) || d.nameHi.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)
  );

  const modalContent = (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setIsSearchOpen(false); }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search benefits, services, certificates (e.g. scholarship, income certificate, pension)..."
            className="flex-1 text-sm bg-transparent border-none text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-600"
          >
            ESC
          </button>
        </div>

        {/* Filter Segment Tabs (Section 21) */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveSegment('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              activeSegment === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveSegment('schemes')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              activeSegment === 'schemes' ? 'bg-white text-brand-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Benefits ({filteredSchemes.length})</span>
          </button>
          <button
            onClick={() => setActiveSegment('services')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              activeSegment === 'services' ? 'bg-white text-brand-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Services ({filteredServices.length})</span>
          </button>
          <button
            onClick={() => setActiveSegment('documents')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              activeSegment === 'documents' ? 'bg-white text-brand-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderCheck className="w-3.5 h-3.5" />
            <span>Documents ({filteredDocs.length})</span>
          </button>
        </div>

        {/* Scrollable Results Area */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Schemes & Benefits Section */}
          {(activeSegment === 'all' || activeSegment === 'schemes') && filteredSchemes.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5 mb-2.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Government Schemes & Benefits</span>
              </span>
              <div className="space-y-2">
                {filteredSchemes.map(scheme => (
                  <div
                    key={scheme.id}
                    onClick={() => {
                      setSelectedSchemeId(scheme.id);
                      setActiveTab('discover');
                      setIsSearchOpen(false);
                    }}
                    className="p-3 bg-white hover:bg-brand-50/50 border border-slate-200 hover:border-brand-200 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        {language === 'hi' ? scheme.nameHi : scheme.name}
                      </h4>
                      <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">
                        {scheme.shortDescription}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Government Services Section */}
          {(activeSegment === 'all' || activeSegment === 'services') && filteredServices.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>Government Administrative Services</span>
              </span>
              <div className="space-y-2">
                {filteredServices.map(service => (
                  <div
                    key={service.id}
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setActiveTab('services');
                      setIsSearchOpen(false);
                    }}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-xs">
                          {language === 'hi' ? service.nameHi : service.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                          {service.serviceCategory}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">
                        {service.shortDescription}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Section */}
          {(activeSegment === 'all' || activeSegment === 'documents') && filteredDocs.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5 mb-2.5">
                <FolderCheck className="w-3.5 h-3.5" />
                <span>Document Catalog & Criteria</span>
              </span>
              <div className="space-y-2">
                {filteredDocs.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setActiveTab('documents');
                      setIsSearchOpen(false);
                    }}
                    className="p-3 bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-amber-200 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        {doc.name}
                      </h4>
                      <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">
                        {doc.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                      {doc.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
