import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { SHOWCASE_SCENARIOS } from '../../data/scenarios';
import { 
  Compass, 
  FileText, 
  MapPin, 
  FolderCheck, 
  Bookmark, 
  User, 
  HelpCircle, 
  Search, 
  Mic, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { 
    activeTab, 
    setActiveTab, 
    savedSchemeIds, 
    savedServiceIds, 
    journeys, 
    loadScenario, 
    activeScenarioId,
    setIsSearchOpen
  } = useCitizen();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const totalSaved = savedSchemeIds.length + savedServiceIds.length;
  const activeJourneysCount = journeys.length;

  const handleVoiceClick = () => {
    setIsListening(true);
    setVoiceNotice(language === 'hi' ? 'बोलिए, जनमित्र सुन रहा है...' : 'Listening... Say your situation');
    setTimeout(() => {
      setIsListening(false);
      setVoiceNotice(null);
      loadScenario('student');
    }, 2400);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Government Disclaimer & Trust Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2 max-w-4xl">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px] tracking-wide uppercase">
            Notice
          </span>
          <span className="truncate text-slate-300">
            {t('disclaimer.text')}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
          <span className="hidden sm:inline">Context: <strong className="text-white">India / Uttar Pradesh</strong></span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Verified Sept 2026</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Identity */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 text-white flex items-center justify-center shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform relative overflow-hidden">
              {/* Ashoka/Chakra Motif */}
              <div className="w-6 h-6 rounded-full border border-saffron-400/80 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-saffron-400"></div>
              </div>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-saffron-500"></div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                  JanMitra
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.2 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  जनमित्र
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                {t('brand.tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'home' ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'discover' ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-brand-600" />
              <span>{t('nav.discover')}</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'services' ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>{t('nav.services')}</span>
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'journey' ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{t('nav.journey')}</span>
              {activeJourneysCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeJourneysCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'documents' ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FolderCheck className="w-4 h-4 text-amber-600" />
              <span>{t('nav.documents')}</span>
            </button>
            <button
              onClick={() => setActiveTab('explain')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'explain' ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>{t('nav.explain')}</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-2.5 py-2 rounded-lg transition-colors relative ${
                activeTab === 'saved' ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={t('nav.saved')}
            >
              <Bookmark className="w-4 h-4" />
              {totalSaved > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-saffron-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {totalSaved}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Tools: Search, Voice, Language, Scenario Switcher, Profile */}
          <div className="flex items-center gap-2">
            
            {/* Quick Global Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-500 hover:text-slate-800 text-xs transition-all shadow-xs"
              title="Search benefits, services, documents"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[120px]">{t('action.search')}</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
                /
              </kbd>
            </button>

            {/* Voice Search Simulation */}
            <div className="relative">
              <button
                onClick={handleVoiceClick}
                className={`p-2 rounded-lg border transition-all ${
                  isListening 
                    ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-md ring-2 ring-rose-200 animate-pulse' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-brand-700'
                }`}
                title={t('hero.voice_button')}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Listening Overlay Balloon */}
              {isListening && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      Voice Assistant
                    </span>
                    <span className="text-[10px] text-slate-400">Audio Input</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 py-2">
                    <div className="w-1 bg-saffron-400 rounded animate-soundwave-1"></div>
                    <div className="w-1 bg-saffron-400 rounded animate-soundwave-2"></div>
                    <div className="w-1 bg-saffron-400 rounded animate-soundwave-3"></div>
                    <div className="w-1 bg-saffron-400 rounded animate-soundwave-4"></div>
                    <div className="w-1 bg-saffron-400 rounded animate-soundwave-2"></div>
                  </div>
                  <p className="text-center text-slate-300 text-[11px]">
                    {voiceNotice}
                  </p>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'en' 
                    ? 'bg-white text-brand-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === 'hi' 
                    ? 'bg-white text-brand-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Profile Avatar Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-lg border transition-all ${
                activeTab === 'profile'
                  ? 'bg-brand-50 border-brand-300 text-brand-700'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
              title={t('nav.profile')}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Quick Showcase Scenario Ribbon (Section 30 Demo Feature) */}
        <div className="py-2 border-t border-slate-100 flex items-center justify-between gap-3 overflow-x-auto text-xs no-scrollbar">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
            <span>Interactive Demo Scenarios:</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {SHOWCASE_SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => loadScenario(sc.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all text-[11px] flex items-center gap-1 ${
                  activeScenarioId === sc.id
                    ? 'bg-brand-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{language === 'hi' ? sc.nameHi : sc.name}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center justify-between"
          >
            <span>{t('nav.home')}</span>
          </button>
          <button
            onClick={() => { setActiveTab('discover'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-brand-600" />
            <span>{t('nav.discover')}</span>
          </button>
          <button
            onClick={() => { setActiveTab('services'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>{t('nav.services')}</span>
          </button>
          <button
            onClick={() => { setActiveTab('journey'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{t('nav.journey')}</span>
            </div>
            {activeJourneysCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                {activeJourneysCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('documents'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
          >
            <FolderCheck className="w-4 h-4 text-amber-600" />
            <span>{t('nav.documents')}</span>
          </button>
          <button
            onClick={() => { setActiveTab('explain'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>{t('nav.explain')}</span>
          </button>
          <button
            onClick={() => { setActiveTab('saved'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-saffron-600" />
              <span>{t('nav.saved')}</span>
            </div>
            {totalSaved > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-800 text-xs font-semibold">
                {totalSaved}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 flex items-center gap-2"
          >
            <User className="w-4 h-4 text-slate-700" />
            <span>{t('nav.profile')} & Privacy</span>
          </button>
        </div>
      )}
    </header>
  );
};
