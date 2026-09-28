import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { ALL_SCHEMES } from '../../data/schemes';
import { ALL_SERVICES } from '../../data/services';
import { 
  Bookmark, 
  Compass, 
  FileText, 
  Trash2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface SavedItemsProps {
  onOpenScheme: (schemeId: string) => void;
  onOpenService: (serviceId: string) => void;
}

export const SavedItems: React.FC<SavedItemsProps> = ({ onOpenScheme, onOpenService }) => {
  const { language } = useLanguage();
  const { savedSchemeIds, savedServiceIds, toggleSaveScheme, toggleSaveService } = useCitizen();

  const [activeTab, setActiveTab] = useState<'schemes' | 'services'>('schemes');

  const savedSchemes = ALL_SCHEMES.filter(s => savedSchemeIds.includes(s.id));
  const savedServices = ALL_SERVICES.filter(s => savedServiceIds.includes(s.id));

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Saved Bookmarks</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick access to saved schemes, certificates, and procedural guidelines.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'schemes' ? 'bg-white text-brand-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Schemes ({savedSchemes.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'services' ? 'bg-white text-brand-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Services ({savedServices.length})
          </button>
        </div>
      </div>

      {/* Schemes Tab */}
      {activeTab === 'schemes' && (
        <div className="space-y-3">
          {savedSchemes.length > 0 ? (
            savedSchemes.map(scheme => (
              <div
                key={scheme.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block mb-1">
                    {scheme.level}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {language === 'hi' ? scheme.nameHi : scheme.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {scheme.shortDescription}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenScheme(scheme.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSaveScheme(scheme.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No saved schemes. Click the bookmark icon on any scheme card to save it here.
            </div>
          )}
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-3">
          {savedServices.length > 0 ? (
            savedServices.map(service => (
              <div
                key={service.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    {service.serviceCategory}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {language === 'hi' ? service.nameHi : service.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    Fee: {service.fees} • Time: {service.processingTime}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenService(service.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <span>View Procedure</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSaveService(service.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No saved services. Click the bookmark icon on any service to save it here.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
