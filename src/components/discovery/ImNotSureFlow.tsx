import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { 
  HelpCircle, 
  User, 
  HeartHandshake, 
  GraduationCap, 
  Sprout, 
  Briefcase, 
  Home, 
  Coins, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const ImNotSureFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { language, t } = useLanguage();
  const { updateProfile, setActiveTab, setSelectedSchemeId, setSelectedServiceId } = useCitizen();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [primaryNeed, setPrimaryNeed] = useState<string>('');
  const [incomeLevel, setIncomeLevel] = useState<number>(200000);

  const audienceOptions = [
    { id: 'student', labelEn: 'Student (College / School)', labelHi: 'विद्यार्थी (कॉलेज / स्कूल)', icon: GraduationCap },
    { id: 'senior', labelEn: 'Senior Citizen (Elderly Parent, 60+)', labelHi: 'वरिष्ठ नागरिक (बुजुर्ग माता-पिता, 60+)', icon: HeartHandshake },
    { id: 'farmer', labelEn: 'Farmer / Agricultural Household', labelHi: 'किसान / कृषक परिवार', icon: Sprout },
    { id: 'business', labelEn: 'Small Business / Self-Employed', labelHi: 'छोटा व्यापार / स्वरोजगार', icon: Briefcase },
    { id: 'general', labelEn: 'General Citizen / Low-Income Household', labelHi: 'सामान्य नागरिक / निम्न आय परिवार', icon: User }
  ];

  const needOptions = [
    { id: 'money', labelEn: 'Monthly Financial Support / Pension', labelHi: 'मासिक वित्तीय सहायता / पेंशन', icon: Coins },
    { id: 'education', labelEn: 'Education Fee Reimbursement', labelHi: 'शिक्षा फीस प्रतिपूर्ति', icon: GraduationCap },
    { id: 'health', labelEn: 'Cashless Healthcare & Hospitalization', labelHi: 'मुफ्त इलाज एवं अस्पताल सहायता', icon: Activity },
    { id: 'house', labelEn: 'Housing Grant / Pucca House', labelHi: 'मकान निर्माण अनुदान / पक्का घर', icon: Home },
    { id: 'certificate', labelEn: 'Official Government Certificate', labelHi: 'सरकारी प्रमाण पत्र', icon: Briefcase }
  ];

  const handleFinish = () => {
    if (targetAudience === 'student') {
      updateProfile({
        age: 20,
        education: 'B.Tech (Computer Science)',
        occupation: 'Student',
        incomeValue: incomeLevel
      });
      setSelectedSchemeId('sch-up-post-matric');
      setActiveTab('discover');
    } else if (targetAudience === 'senior') {
      updateProfile({
        age: 65,
        occupation: 'Retired / Senior Citizen',
        incomeValue: Math.min(incomeLevel, 45000),
        ruralUrban: 'Rural'
      });
      setSelectedSchemeId('sch-up-vridhavastha-pension');
      setActiveTab('discover');
    } else if (targetAudience === 'farmer') {
      updateProfile({
        occupation: 'Farmer / Agriculture',
        incomeValue: incomeLevel
      });
      setSelectedSchemeId('sch-pm-kisan');
      setActiveTab('discover');
    } else if (primaryNeed === 'certificate') {
      setSelectedServiceId('srv-income-cert');
      setActiveTab('services');
    } else {
      setActiveTab('discover');
    }

    onComplete();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg max-w-2xl mx-auto my-6">
      
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {t('cat.not_sure')}
            </h3>
            <p className="text-xs text-slate-500">
              Answer 3 brief questions to find your personalized pathway.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-400">
          Step {step} of 3
        </span>
      </div>

      {/* Step 1: Who is this for? */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <h4 className="text-sm font-bold text-slate-900">
            1. Who are you looking for assistance for?
          </h4>
          <div className="grid grid-cols-1 gap-2.5">
            {audienceOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = targetAudience === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTargetAudience(opt.id)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-brand-600 bg-brand-50/50 text-brand-900 ring-2 ring-brand-500/20 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">
                      {language === 'hi' ? opt.labelHi : opt.labelEn}
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={!targetAudience}
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: What is the primary need? */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <h4 className="text-sm font-bold text-slate-900">
            2. What kind of support is most urgent?
          </h4>
          <div className="grid grid-cols-1 gap-2.5">
            {needOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = primaryNeed === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrimaryNeed(opt.id)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-brand-600 bg-brand-50/50 text-brand-900 ring-2 ring-brand-500/20 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">
                      {language === 'hi' ? opt.labelHi : opt.labelEn}
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!primaryNeed}
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Household Income Range */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <h4 className="text-sm font-bold text-slate-900">
            3. What is the approximate annual household income?
          </h4>
          <p className="text-xs text-slate-500">
            (Government programs use this to determine qualification categories)
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-slate-900">
              <span>Annual Income:</span>
              <span className="text-brand-700 text-base">₹{incomeLevel.toLocaleString('en-IN')} / year</span>
            </div>
            <input
              type="range"
              min={25000}
              max={600000}
              step={25000}
              value={incomeLevel}
              onChange={(e) => setIncomeLevel(parseInt(e.target.value, 10))}
              className="w-full accent-brand-700 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>&lt; ₹50,000 (BPL/Destitute)</span>
              <span>₹2.5 Lakh</span>
              <span>₹6.0 Lakh+</span>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-saffron-300" />
              <span>Show My Relevant Programs</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
