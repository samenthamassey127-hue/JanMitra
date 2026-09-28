import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCitizen } from '../../context/CitizenContext';
import { UserProfile } from '../../types';
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Coins, 
  ShieldCheck, 
  Save,
  CheckCircle2
} from 'lucide-react';

export const ProfileEditor: React.FC = () => {
  const { language } = useLanguage();
  const { profile, updateProfile, addChip } = useCitizen();

  const [formData, setFormData] = useState<UserProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const districtsOfUP = [
    'Lucknow', 'Varanasi', 'Kanpur Nagar', 'Prayagraj', 'Agra', 
    'Meerut', 'Gorakhpur', 'Bareilly', 'Aligarh', 'Ayodhya', 'Jhansi', 'Noida / Gautam Buddha Nagar'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);

    // Refresh chips to reflect new profile
    updateProfile({
      extractedChips: [
        { id: 'c1', label: `${formData.age} years`, field: 'age', value: formData.age },
        { id: 'c2', label: `${formData.district}, ${formData.state}`, field: 'district', value: formData.district },
        { id: 'c3', label: formData.education, field: 'education', value: formData.education },
        { id: 'c4', label: formData.occupation, field: 'occupation', value: formData.occupation },
        { id: 'c5', label: `₹${(formData.incomeValue / 100000).toFixed(1)}L income`, field: 'incomeValue', value: formData.incomeValue },
        { id: 'c6', label: `${formData.category} Category`, field: 'category', value: formData.category }
      ]
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-brand-700" />
            <span>Citizen Profile Attributes</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your attributes are stored strictly on this device and used to evaluate scheme eligibility rules.
          </p>
        </div>

        {saveSuccess && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Profile Updated</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Row 1: Name & Age & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Age (Years)</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Row 2: State, District, Rural/Urban */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">State</label>
            <input
              type="text"
              disabled
              value={formData.state}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-500 bg-slate-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">District</label>
            <select
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            >
              {districtsOfUP.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Area Type</label>
            <select
              value={formData.ruralUrban}
              onChange={(e) => setFormData({ ...formData, ruralUrban: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            >
              <option value="Urban">Urban (City / Municipality)</option>
              <option value="Rural">Rural (Gram Panchayat)</option>
            </select>
          </div>
        </div>

        {/* Row 3: Education, Occupation, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Education Level</label>
            <select
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            >
              <option value="B.Tech (Computer Science)">B.Tech / Professional Degree</option>
              <option value="Undergraduate (BA/B.Sc/B.Com)">Undergraduate (BA/B.Sc/B.Com)</option>
              <option value="12th Pass">12th Standard Pass</option>
              <option value="10th Pass">10th Standard Pass</option>
              <option value="Primary">Primary School</option>
              <option value="None">No Formal Schooling</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Occupation</label>
            <select
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            >
              <option value="Student">Student</option>
              <option value="Farmer / Agriculture">Farmer / Agriculture</option>
              <option value="Retired / Senior Citizen">Retired / Senior Citizen</option>
              <option value="Self-Employed / Vendor">Self-Employed / Vendor</option>
              <option value="Unemployed / Job Seeker">Unemployed / Job Seeker</option>
              <option value="Daily Wage Worker">Daily Wage Worker</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Social Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            >
              <option value="General">General</option>
              <option value="OBC">OBC (Other Backward Class)</option>
              <option value="SC">SC (Scheduled Caste)</option>
              <option value="ST">ST (Scheduled Tribe)</option>
              <option value="EWS">EWS (Economically Weaker Section)</option>
            </select>
          </div>
        </div>

        {/* Row 4: Annual Income & Institution & Disability */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Annual Household Income (₹)
            </label>
            <input
              type="number"
              step={5000}
              value={formData.incomeValue}
              onChange={(e) => setFormData({ ...formData, incomeValue: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              ₹{(formData.incomeValue).toLocaleString('en-IN')} / year
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Institution Type (Students)</label>
            <select
              value={formData.institutionType || 'Government-Aided'}
              onChange={(e) => setFormData({ ...formData, institutionType: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            >
              <option value="Government">Government Institution</option>
              <option value="Government-Aided">Government-Aided College</option>
              <option value="Private Recognized">Private Recognized Institute</option>
              <option value="Unknown">Not Applicable / Unknown</option>
            </select>
          </div>

          <div className="flex flex-col justify-end pb-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.disabilityStatus}
                onChange={(e) => setFormData({ ...formData, disabilityStatus: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span className="font-medium text-slate-700">Person with Benchmark Disability (≥ 40%)</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Recalculate Matches</span>
          </button>
        </div>

      </form>

    </div>
  );
};
