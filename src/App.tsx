import React from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CitizenProvider, useCitizen } from './context/CitizenContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HeroSection } from './components/home/HeroSection';
import { LandingOverview } from './components/home/LandingOverview';
import { DiscoverView } from './components/discovery/DiscoverView';
import { ServiceList } from './components/services/ServiceList';
import { ServiceDetail } from './components/services/ServiceDetail';
import { DocumentLocker } from './components/documents/DocumentLocker';
import { JourneyDashboard } from './components/journey/JourneyDashboard';
import { GovernmentSimplifier } from './components/explain/GovernmentSimplifier';
import { SavedItems } from './components/profile/SavedItems';
import { ProfileEditor } from './components/profile/ProfileEditor';
import { PrivacyCenter } from './components/profile/PrivacyCenter';
import { VakhCommunityBoard } from './components/vakh/VakhCommunityBoard';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { ALL_SERVICES, getServiceById } from './data/services';
import { CategoryKey } from './types';
import { 
  Building2, 
  ShieldCheck, 
  ExternalLink, 
  Heart,
  HelpCircle,
  FileCheck2,
  Lock
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { language, t } = useLanguage();
  const { 
    activeTab, 
    setActiveTab, 
    selectedServiceId, 
    setSelectedServiceId, 
    setSelectedSchemeId 
  } = useCitizen();

  const handleSelectCategory = (category: CategoryKey) => {
    if (category === 'certificates') {
      setActiveTab('services');
    } else {
      setActiveTab('discover');
    }
  };

  const handleNavigateToService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveTab('services');
  };

  const activeService = selectedServiceId ? getServiceById(selectedServiceId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 w-full max-w-full overflow-x-hidden">
      
      {/* Global Header */}
      <Header />

      {/* Global Search Dialog */}
      <GlobalSearchModal />

      {/* Main Screen Router */}
      <main className="flex-1 pb-20 lg:pb-12 w-full max-w-full overflow-x-hidden">
        {activeTab === 'home' && (
          <div className="w-full max-w-full overflow-x-hidden">
            <HeroSection onSelectCategory={handleSelectCategory} />
            <LandingOverview />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
          {activeTab === 'discover' && (
            <DiscoverView onNavigateToService={handleNavigateToService} />
          )}

          {activeTab === 'services' && (
            activeService ? (
              <ServiceDetail 
                service={activeService} 
                onClose={() => setSelectedServiceId(null)} 
              />
            ) : (
              <ServiceList 
                onSelectService={(srv) => setSelectedServiceId(srv.id)} 
              />
            )
          )}

          {activeTab === 'journey' && (
            <JourneyDashboard onNavigateToService={handleNavigateToService} />
          )}

          {activeTab === 'documents' && (
            <DocumentLocker onNavigateToService={handleNavigateToService} />
          )}

          {activeTab === 'explain' && (
            <GovernmentSimplifier />
          )}

          {activeTab === 'vakh' && (
            <VakhCommunityBoard />
          )}

          {activeTab === 'saved' && (
            <SavedItems
              onOpenScheme={(schemeId) => {
                setSelectedSchemeId(schemeId);
                setActiveTab('discover');
              }}
              onOpenService={(serviceId) => {
                setSelectedServiceId(serviceId);
                setActiveTab('services');
              }}
            />
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <ProfileEditor />
              <PrivacyCenter />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sticky Navigation */}
      <BottomNav />

      {/* Comprehensive Government Trust Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs py-10 mt-12 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center font-bold text-sm">
                JM
              </div>
              <div>
                <span className="font-bold text-white text-sm">JanMitra</span>
                <span className="text-slate-400 text-xs ml-2">जनमित्र — Understand. Discover. Apply.</span>
              </div>
            </div>

            <div className="text-slate-400 text-xs flex flex-wrap gap-4">
              <span>Geographic Context: <strong className="text-white">India / Uttar Pradesh</strong></span>
              <span>Architecture: <strong className="text-white">Client-First Privacy Vault</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-400 text-[11px] leading-relaxed">
            <div>
              <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-xs">
                Independent Platform Notice
              </h4>
              <p>
                JanMitra is an independent civic technology platform. It is not owned, operated, or endorsed by the Government of India or the Government of Uttar Pradesh. All scheme names, guidelines, and public service terms are referenced strictly under fair informational principles.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-xs">
                Statutory Authority & Final Decisions
              </h4>
              <p>
                JanMitra provides advisory eligibility matching and procedural navigation. Final decisions concerning eligibility, document validity, and application sanction rest exclusively with the designated state and central departmental authorities.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-xs">
                Official Portals Referenced
              </h4>
              <ul className="space-y-1">
                <li>• UP eDistrict: <a href="https://edistrict.up.gov.in" target="_blank" rel="noopener noreferrer" className="text-saffron-400 hover:underline">edistrict.up.gov.in</a></li>
                <li>• UP Scholarship: <a href="https://scholarship.up.gov.in" target="_blank" rel="noopener noreferrer" className="text-saffron-400 hover:underline">scholarship.up.gov.in</a></li>
                <li>• Ayushman Bharat NHA: <a href="https://beneficiary.nha.gov.in" target="_blank" rel="noopener noreferrer" className="text-saffron-400 hover:underline">beneficiary.nha.gov.in</a></li>
                <li>• PM-Kisan Portal: <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" className="text-saffron-400 hover:underline">pmkisan.gov.in</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[10px]">
            <span>© 2026 JanMitra. Designed for Indian Citizens.</span>
            <span>WCAG 2.1 AA Accessible • Zero Dark Patterns • Evidence-First Provenance</span>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <CitizenProvider>
        <MainAppContent />
      </CitizenProvider>
    </LanguageProvider>
  );
}
