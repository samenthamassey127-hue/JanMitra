import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { ALL_SERVICES } from '../../data/services';
import { GovernmentService } from '../../types';
import { 
  Building2, 
  Clock, 
  CreditCard, 
  ArrowRight, 
  Search, 
  FileText, 
  ExternalLink, 
  Bookmark,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ServiceListProps {
  onSelectService: (service: GovernmentService) => void;
}

export const ServiceList: React.FC<ServiceListProps> = ({ onSelectService }) => {
  const { language } = useLanguage();
  const { documents, savedServiceIds, toggleSaveService } = useCitizen();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Certificates & Revenue', 'Civil Supplies & Food Security', 'Agriculture & Land Records', 'Healthcare & Disability Welfare'];

  const filteredServices = ALL_SERVICES.filter(srv => {
    const matchesSearch = srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.nameHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || srv.serviceCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Section Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Government Public Service Navigator
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Step-by-step guidance for certificates, land extracts, and official administrative clearances.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search certificates, revenue..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-brand-600 focus:ring-2 focus:ring-brand-500/10 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
              selectedCategory === cat 
                ? 'bg-brand-700 text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map(srv => {
          const isSaved = savedServiceIds.includes(srv.id);

          // Calculate how many required docs the user currently has available
          const availableDocs = srv.requiredDocumentCodes.filter(c => 
            documents.some(d => d.code === c && d.status === 'available')
          ).length;

          return (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    {srv.serviceCategory}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSaveService(srv.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isSaved 
                        ? 'bg-amber-50 border-amber-300 text-amber-600' 
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                <h3 
                  onClick={() => onSelectService(srv)}
                  className="text-base font-bold text-slate-900 hover:text-brand-700 cursor-pointer transition-colors leading-snug"
                >
                  {language === 'hi' ? srv.nameHi : srv.name}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-4 leading-relaxed">
                  {language === 'hi' ? srv.shortDescriptionHi : srv.shortDescription}
                </p>

                {/* Quick Info Matrix */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Fee: <strong>{srv.fees.split('/')[0]}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Time: <strong>{srv.processingTime.split('(')[0]}</strong></span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 text-slate-600 pt-1 border-t border-slate-200/50">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Locker check: <strong>{availableDocs} of {srv.requiredDocumentCodes.length} documents ready</strong></span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectService(srv)}
                  className="px-3.5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>View Checklist & Procedure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={srv.officialPortal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-brand-700 flex items-center gap-1 font-medium"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
