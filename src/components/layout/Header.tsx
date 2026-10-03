import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  X, 
  Radio 
} from 'lucide-react';

import { 
  loginCitizen, 
  registerCitizen, 
  fetchCurrentUser, 
  getAuthToken, 
  setAuthToken 
} from '../../utils/apiClient';

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
    setIsSearchOpen,
    currentUser,
    setCurrentUser,
    logoutUser,
    authModalOpen,
    setAuthModalOpen
  } = useCitizen();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Authentication & RBAC state (Phase 2 Roadmap)
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState('citizen');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Close modal on Escape key and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAuthModalOpen(false);
    };
    if (authModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [authModalOpen]);

  const totalSaved = savedSchemeIds.length + savedServiceIds.length;
  const activeJourneysCount = journeys.length;

  const handleQuickRoleSwitch = async (roleType: 'officer' | 'pradhan' | 'citizen') => {
    setIsSubmittingAuth(true);
    setAuthError(null);
    try {
      let credentials = { email: 'samentha@janmitra.gov.in', password: 'Janmitra@2026' };
      if (roleType === 'pradhan') credentials = { email: 'pradhan@barabanki.in', password: 'Pradhan@123' };
      if (roleType === 'citizen') credentials = { email: 'citizen@janmitra.in', password: 'Citizen@123' };

      const res = await loginCitizen(credentials);
      if (res?.user) {
        setCurrentUser({
          id: res.user.id || 'JM-USR-88421',
          loginId: res.user.email,
          email: res.user.email,
          name: res.user.name || res.user.full_name || (roleType === 'officer' ? 'Samentha Massey' : roleType === 'pradhan' ? 'Ram Prakash Yadav' : 'Rameshwar Sharma'),
          role: res.user.role || roleType,
          district: res.user.district || (roleType === 'pradhan' ? 'Barabanki' : 'Lucknow')
        });
        setAuthModalOpen(false);
      } else {
        // Fallback local role update
        if (roleType === 'officer') {
          setCurrentUser({
            id: 'JM-OFF-014',
            loginId: credentials.email,
            email: credentials.email,
            name: 'Samentha Massey',
            role: 'officer',
            district: 'Lucknow'
          });
        }
        if (roleType === 'pradhan') {
          setCurrentUser({
            id: 'JM-PRD-082',
            loginId: credentials.email,
            email: credentials.email,
            name: 'Ram Prakash Yadav',
            role: 'gram_pradhan',
            district: 'Barabanki'
          });
        }
        if (roleType === 'citizen') {
          setCurrentUser({
            id: 'JM-CTZ-901',
            loginId: credentials.email,
            email: credentials.email,
            name: 'Rameshwar Sharma',
            role: 'citizen',
            district: 'Lucknow'
          });
        }
        setAuthModalOpen(false);
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleCustomAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setAuthError(null);

    try {
      if (authMode === 'login') {
        const res = await loginCitizen({ email: authEmail, password: authPassword });
        if (res?.user) {
          setCurrentUser({
            id: res.user.id || 'JM-USR-992',
            loginId: res.user.email,
            email: res.user.email,
            name: res.user.name || res.user.full_name || authEmail.split('@')[0],
            role: res.user.role || 'citizen',
            district: res.user.district || 'Lucknow'
          });
          setAuthModalOpen(false);
        } else {
          setAuthError(res?.error || 'Invalid credentials');
        }
      } else {
        const res = await registerCitizen({
          email: authEmail,
          password: authPassword,
          name: authName || 'Citizen User',
          role: authRole,
          district: 'Lucknow'
        });
        if (res?.user) {
          setCurrentUser({
            id: res.user.id || 'JM-USR-993',
            loginId: res.user.email,
            email: res.user.email,
            name: authName || 'Citizen User',
            role: authRole,
            district: 'Lucknow'
          });
          setAuthModalOpen(false);
        } else {
          setAuthError(res?.error || 'Registration failed');
        }
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs w-full max-w-full">
      {/* Top Government Disclaimer & Trust Bar */}
      <div className="bg-slate-900 text-slate-200 py-1.5 text-xs border-b border-slate-800 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px] tracking-wide uppercase shrink-0">
              Notice
            </span>
            <span className="text-slate-300 text-[11px] leading-normal">
              {t('disclaimer.text')}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
            <span>Context: <strong className="text-white">India / Uttar Pradesh</strong></span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Verified Sept 2026</span>
          </div>
        </div>
      </div>

      {/* Main Bar (Row 1: Brand Identity & Citizen Command Tools) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 gap-3 min-w-0">
          
          {/* Logo & Identity */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 text-white flex items-center justify-center shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform relative overflow-hidden shrink-0">
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

          {/* Right Action Tools: Search, Voice, Language, Full User Account & Login ID */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Quick Global Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-600 hover:text-slate-900 text-xs transition-all shadow-2xs"
              title="Search benefits, services, documents"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('action.search')}</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
                /
              </kbd>
            </button>

            {/* Voice Search Simulation */}
            <div className="relative">
              <button
                onClick={handleVoiceClick}
                className={`p-2 rounded-xl border transition-all ${
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
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  language === 'en' 
                    ? 'bg-white text-brand-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  language === 'hi' 
                    ? 'bg-white text-brand-800 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Prominent User Account & Login ID Button (Completely Unclipped) */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-brand-200 bg-white hover:bg-brand-50 text-slate-800 transition-all cursor-pointer shadow-2xs shrink-0"
              title={currentUser ? `Logged in: ${currentUser.name} (${currentUser.loginId || currentUser.email})` : 'Sign In / Account'}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                    {currentUser ? currentUser.name : 'Sign In'}
                  </span>
                  {currentUser?.role && (
                    <span className="hidden sm:inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded bg-brand-50 text-brand-700 border border-brand-200 capitalize whitespace-nowrap">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 whitespace-nowrap">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentUser ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span>{currentUser ? (currentUser.loginId || currentUser.email) : 'Guest Account'}</span>
                </span>
              </div>
            </button>

            {/* Profile Tab Shortcut */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
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
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Row 2: Main Navigation Tabs & Quick Showcase Scenario Ribbon */}
      <div className="border-t border-slate-200/80 bg-slate-50/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 py-1.5 min-w-0">
            
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'home' ? 'bg-brand-800 text-white font-bold shadow-xs' : 'hover:bg-white text-slate-700'
                }`}
              >
                <span>{t('nav.home')}</span>
              </button>
              <button
                onClick={() => setActiveTab('discover')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'discover' ? 'bg-brand-800 text-white font-bold shadow-xs' : 'hover:bg-white text-slate-700'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-brand-400" />
                <span>{t('nav.discover')}</span>
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'services' ? 'bg-brand-800 text-white font-bold shadow-xs' : 'hover:bg-white text-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('nav.services')}</span>
              </button>
              <button
                onClick={() => setActiveTab('journey')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 relative shrink-0 ${
                  activeTab === 'journey' ? 'bg-brand-800 text-white font-bold shadow-xs' : 'hover:bg-white text-slate-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('nav.journey')}</span>
                {activeJourneysCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeJourneysCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'documents' ? 'bg-brand-800 text-white font-bold shadow-xs' : 'hover:bg-white text-slate-700'
                }`}
              >
                <FolderCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('nav.documents')}</span>
              </button>
              <button
                onClick={() => setActiveTab('explain')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'explain' ? 'bg-brand-800 text-white font-bold shadow-xs' : 'hover:bg-white text-slate-700'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t('nav.explain')}</span>
              </button>
              <button
                onClick={() => setActiveTab('vakh')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'vakh' ? 'bg-emerald-700 text-white font-bold shadow-xs' : 'hover:bg-emerald-50 text-emerald-800'
                }`}
                title="Vakh Civic Chaupal by @samentha"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>Vakh Chaupal</span>
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-2.5 py-1.5 rounded-lg transition-all relative shrink-0 ${
                  activeTab === 'saved' ? 'bg-brand-800 text-white font-bold shadow-xs' : 'hover:bg-white text-slate-700'
                }`}
                title={t('nav.saved')}
              >
                <Bookmark className="w-3.5 h-3.5" />
                {totalSaved > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-saffron-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {totalSaved}
                  </span>
                )}
              </button>
            </nav>

            {/* Quick Showcase Scenario Ribbon */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs w-full lg:w-auto">
              <div className="flex items-center gap-1 text-slate-500 font-semibold shrink-0 text-[11px]">
                <Sparkles className="w-3 h-3 text-saffron-600" />
                <span>{language === 'hi' ? 'डेमो:' : 'Demos:'}</span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
                {SHOWCASE_SCENARIOS.map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => loadScenario(sc.id)}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all text-[11px] whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                      activeScenarioId === sc.id
                        ? 'bg-brand-800 text-white shadow-2xs font-bold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{language === 'hi' ? sc.nameHi : sc.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          {/* Mobile User Account & Login ID Card */}
          <div 
            onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
            className="p-3 bg-gradient-to-r from-slate-900 to-brand-950 text-white rounded-2xl flex items-center justify-between gap-3 cursor-pointer shadow-md mb-2 border border-brand-800/40"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs border border-brand-400/30">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">{currentUser?.name || 'Sign In / Account'}</span>
                <span className="text-[10px] text-brand-200 font-mono block truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                  {currentUser ? (currentUser.loginId || currentUser.email) : 'Tap to sign in'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 uppercase shrink-0 border border-saffron-500/30">
              {currentUser?.role ? currentUser.role.replace('_', ' ') : 'Guest'}
            </span>
          </div>

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
            onClick={() => { setActiveTab('vakh'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-50 text-emerald-800 flex items-center gap-2"
          >
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Vakh Chaupal (@samentha)</span>
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

      {/* Authentication & Role Switcher Dialog (Phase 2 Roadmap) */}
      {authModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setAuthModalOpen(false); }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
        >
          <div className="relative bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-auto max-h-[88vh] overflow-y-auto z-[10000]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  JanMitra Access & Roles
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active User Account & Login ID Card */}
            {currentUser && (
              <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white p-4 rounded-2xl mb-5 shadow-lg border border-brand-800/60">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-400 bg-saffron-500/20 px-2 py-0.5 rounded-md border border-saffron-500/30">
                    Logged In User Account
                  </span>
                  <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Verified Session
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-md border border-brand-400/30">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate">
                      {currentUser.name || 'Citizen User'}
                    </h4>
                    <p className="text-xs text-brand-200 font-mono truncate select-all">
                      Login ID: <strong className="text-white">{currentUser.loginId || currentUser.email}</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px] font-medium uppercase">Active Role</span>
                    <span className="font-semibold text-white capitalize">{currentUser.role.replace('_', ' ')}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-slate-400 block text-[10px] font-medium uppercase">District</span>
                    <span className="font-semibold text-white">{currentUser.district || 'Lucknow, UP'}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 flex items-center justify-between gap-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('profile');
                      setAuthModalOpen(false);
                    }}
                    className="text-xs text-saffron-300 hover:text-saffron-200 font-medium underline underline-offset-2 cursor-pointer"
                  >
                    View Citizen Profile Details →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logoutUser();
                      setAuthModalOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Quick 1-Click Role Switcher */}
            <div className="mb-5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Role Switch (Demo Mode):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={isSubmittingAuth}
                  onClick={() => handleQuickRoleSwitch('officer')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    currentUser?.role === 'officer'
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
                  }`}
                >
                  <span className="text-sm block mb-0.5">🏛️</span>
                  <span className="text-[11px] font-semibold block leading-tight">Revenue Officer</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmittingAuth}
                  onClick={() => handleQuickRoleSwitch('pradhan')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    currentUser?.role === 'gram_pradhan'
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
                  }`}
                >
                  <span className="text-sm block mb-0.5">🌾</span>
                  <span className="text-[11px] font-semibold block leading-tight">Gram Pradhan</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmittingAuth}
                  onClick={() => handleQuickRoleSwitch('citizen')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    currentUser?.role === 'citizen'
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700 text-xs'
                  }`}
                >
                  <span className="text-sm block mb-0.5">👤</span>
                  <span className="text-[11px] font-semibold block leading-tight">Citizen</span>
                </button>
              </div>
            </div>

            {/* Custom Login Form */}
            <form onSubmit={handleCustomAuthSubmit} className="space-y-3 border-t border-slate-100 pt-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Full Name:</label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="E.g. Samentha Massey"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-slate-600 block mb-1">Email Address:</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@janmitra.in"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Password:</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  required
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-600 font-medium">{authError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                {isSubmittingAuth ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="hover:underline text-brand-700 font-semibold"
                >
                  {authMode === 'login' ? 'New citizen? Register account' : 'Already registered? Sign in'}
                </button>

                <a
                  href="http://localhost:5000/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <span>API Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
