import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { Home, Compass, MapPin, FolderCheck, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { activeTab, setActiveTab, journeys } = useCitizen();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1.5 px-1 rounded-lg transition-colors ${
            activeTab === 'home' ? 'text-brand-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-full">{t('nav.home')}</span>
        </button>

        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center py-1.5 px-1 rounded-lg transition-colors ${
            activeTab === 'discover' ? 'text-brand-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-full">{t('nav.discover')}</span>
        </button>

        <button
          onClick={() => setActiveTab('journey')}
          className={`flex flex-col items-center py-1.5 px-1 rounded-lg transition-colors relative ${
            activeTab === 'journey' ? 'text-brand-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5 text-emerald-600" />
          <span className="text-[10px] truncate max-w-full">{t('nav.journey')}</span>
          {journeys.length > 0 && (
            <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
              {journeys.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex flex-col items-center py-1.5 px-1 rounded-lg transition-colors ${
            activeTab === 'documents' ? 'text-brand-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-full">{t('nav.documents')}</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1.5 px-1 rounded-lg transition-colors ${
            activeTab === 'profile' ? 'text-brand-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-full">{t('nav.profile')}</span>
        </button>
      </div>
    </div>
  );
};
