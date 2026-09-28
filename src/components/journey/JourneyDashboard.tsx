import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { JourneyItem, ApplicationStage } from '../../types';
import { DependencyTree } from '../services/DependencyTree';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  Edit3, 
  Plus, 
  Trash2,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JourneyDashboard: React.FC<{ onNavigateToService: (serviceId: string) => void }> = ({ onNavigateToService }) => {
  const { language, t } = useLanguage();
  const { journeys, updateJourneyStage, updateJourneyNotes, setActiveTab } = useCitizen();

  const [activeJourneyId, setActiveJourneyId] = useState<string>(journeys[0]?.id || '');
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [tempAppNumber, setTempAppNumber] = useState('');

  const currentJourney = journeys.find(j => j.id === activeJourneyId) || journeys[0];

  const handleStageChange = (stage: ApplicationStage) => {
    if (!currentJourney) return;
    updateJourneyStage(currentJourney.id, stage);

    if (stage === 'approved' || stage === 'completed') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSaveNotes = () => {
    if (!currentJourney) return;
    updateJourneyNotes(currentJourney.id, tempNotes, tempAppNumber);
    setEditingNotes(false);
  };

  const stages: Array<{ key: ApplicationStage; label: string }> = [
    { key: 'preparation', label: 'Preparation' },
    { key: 'ready_to_apply', label: 'Ready to Apply' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'under_verification', label: 'Under Verification' },
    { key: 'action_required', label: 'Action Required' },
    { key: 'approved', label: 'Approved' },
    { key: 'completed', label: 'Completed' }
  ];

  if (!currentJourney) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-12">
        <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">No Active Journeys Yet</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Explore government schemes or services and click "Start Application Journey" to begin tracking.
        </p>
        <button
          onClick={() => setActiveTab('discover')}
          className="px-5 py-2.5 rounded-xl bg-brand-700 text-white font-semibold text-xs shadow-md cursor-pointer"
        >
          Discover Benefits Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Lifecycle Navigation
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            <span>My Application Journeys</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Real-time milestone tracking, document prerequisite chains, and official status logs.
          </p>
        </div>

        {/* Journey Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {journeys.map(j => (
            <button
              key={j.id}
              onClick={() => {
                setActiveJourneyId(j.id);
                setEditingNotes(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeJourneyId === j.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {language === 'hi' ? j.titleHi : j.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Journey Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md">
        
        {/* Journey Meta & Title */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                Active Application
              </span>
              <span className="text-xs text-slate-400">
                Updated: {currentJourney.lastUpdated}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {language === 'hi' ? currentJourney.titleHi : currentJourney.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Goal: {currentJourney.goal}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-700 min-w-[200px]">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-slate-400 font-medium">Application Ref:</span>
              <span className="font-mono font-bold text-slate-900">
                {currentJourney.applicationNumber || 'Not submitted yet'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 font-medium">Current Status:</span>
              <span className="font-bold text-brand-700 uppercase text-[11px]">
                {currentJourney.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Section 16: Immediate Next Action Banner */}
        <div className="my-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block">
                Next Recommended Citizen Action:
              </span>
              <span className="font-semibold text-slate-900 text-sm">
                {language === 'hi' ? currentJourney.nextActionHi : currentJourney.nextAction}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToService('srv-income-cert')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          >
            <span>Proceed to Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section 17: Interactive Application Stage Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Interactive Application Lifecycle State:
            </span>
            <span className="text-xs text-slate-500 font-medium">
              (Click to test lifecycle transitions)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {stages.map(st => {
              const isActive = currentJourney.status === st.key;
              return (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => handleStageChange(st.key)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-brand-700 text-white border-brand-800 font-bold shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium'
                  }`}
                >
                  <span className="text-[11px] block truncate">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 16: Milestone Stepper Timeline */}
        <div className="mb-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Milestone Progress
          </h4>

          <div className="space-y-3">
            {currentJourney.steps.map((st, idx) => {
              const isDone = st.completed;
              const isCurrent = st.current;

              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-colors ${
                    isDone 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : isCurrent 
                      ? 'bg-brand-50/50 border-brand-300 ring-2 ring-brand-500/10' 
                      : 'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isDone 
                      ? 'bg-emerald-600 text-white' 
                      : isCurrent 
                      ? 'bg-brand-700 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-sm font-bold text-slate-900">
                        {language === 'hi' ? st.titleHi : st.title}
                      </h5>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {isDone ? 'Completed' : isCurrent ? 'Active Stage' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {language === 'hi' ? st.detailHi : st.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 15: Government Service Dependency Graph */}
        <div className="mb-8">
          <DependencyTree
            schemeTitle={currentJourney.title}
            dependencies={currentJourney.dependencies}
            onResolveService={onNavigateToService}
          />
        </div>

        {/* Notes & Tracking Information */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span>Personal Notes & Official Reference ID</span>
            </h4>

            {!editingNotes ? (
              <button
                type="button"
                onClick={() => {
                  setTempNotes(currentJourney.notes || '');
                  setTempAppNumber(currentJourney.applicationNumber || '');
                  setEditingNotes(true);
                }}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                Edit Notes
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNotes}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Save Changes
              </button>
            )}
          </div>

          {editingNotes ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Official Application Reference No:</label>
                <input
                  type="text"
                  value={tempAppNumber}
                  onChange={(e) => setTempAppNumber(e.target.value)}
                  placeholder="E.g. UP-SCH-2026-98124"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Your Personal Notes / Lekhpal Contact:</label>
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-600 space-y-1">
              <p><strong>Notes:</strong> {currentJourney.notes || 'No notes added yet.'}</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
