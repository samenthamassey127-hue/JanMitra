import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Calendar,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Share2,
  BadgeCheck,
  UserCheck,
  Building2,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { useCitizen } from '../../context/CitizenContext';
import { useLanguage } from '../../context/LanguageContext';
import { fetchVakhNotices, broadcastVakhNotice } from '../../utils/apiClient';

export interface VakhNotice {
  id: string;
  author: string;
  handle: string;
  role: 'Lead Desk' | 'CSC Operator' | 'Panchayat Desk' | 'Citizen' | 'Lekhpal Desk';
  location: string;
  district: string;
  content: string;
  timestamp: string;
  verified: boolean;
  category: 'Camp' | 'Server Status' | 'Guidance' | 'Urgent';
  likes?: number;
}

const INITIAL_VAKH_NOTICES: VakhNotice[] = [
  {
    id: 'vn-lead',
    author: 'Samentha Massey',
    handle: '@samentha',
    role: 'Lead Desk',
    location: 'State Civic Coordination Desk',
    district: 'Lucknow',
    content: 'Welcome to the JanMitra Civic Chaupal on Vakh! Follow @samentha on vakh.com for verified district camp dates, Aadhaar/e-KYC drives, and ground verification guidance across UP.',
    timestamp: 'Just now',
    verified: true,
    category: 'Urgent',
    likes: 42
  },
  {
    id: 'vn-1',
    author: 'Jan Seva Kendra #14',
    handle: '@csc_aliganj',
    role: 'CSC Operator',
    location: 'Sector B, Aliganj',
    district: 'Lucknow',
    content: 'Special Income Certificate (Aay Praman Patra) verification drive active today until 4:30 PM. Please carry original Rashan card and 2 passport photos.',
    timestamp: '18 mins ago',
    verified: true,
    category: 'Camp',
    likes: 12
  },
  {
    id: 'vn-2',
    author: 'Samentha Massey',
    handle: '@samentha',
    role: 'Lead Desk',
    location: 'Hazratganj Information Hub',
    district: 'Lucknow',
    content: 'UP Post-Matric Scholarship portal server maintenance completed. Biometric student e-KYC is now processing within 3 minutes at all registered tehsil kiosks.',
    timestamp: '45 mins ago',
    verified: true,
    category: 'Server Status',
    likes: 29
  },
  {
    id: 'vn-3',
    author: 'Masauli Panchayat Sahayak',
    handle: '@panchayat_masauli',
    role: 'Panchayat Desk',
    location: 'Gram Panchayat Bhawan',
    district: 'Barabanki',
    content: 'PM-KISAN 16th installment land-seeding & e-KYC camp organised tomorrow morning 10 AM. Free biometric assistance available for senior citizen farmers.',
    timestamp: '1 hour ago',
    verified: true,
    category: 'Camp',
    likes: 15
  },
  {
    id: 'vn-4',
    author: 'Aman Verma',
    handle: '@aman_v',
    role: 'Citizen',
    location: 'Sadar Tehsil Counter 3',
    district: 'Lucknow',
    content: 'Lekhpal inquiry for Domicile certificates was cleared quickly today. Submitted application number at counter 2.',
    timestamp: '2 hours ago',
    verified: false,
    category: 'Guidance',
    likes: 8
  },
  {
    id: 'vn-5',
    author: 'Tehsil Revenue Section',
    handle: '@varanasi_revenue',
    role: 'Lekhpal Desk',
    location: 'Collectorate Compound',
    district: 'Varanasi',
    content: 'All pending caste & income certificate applications submitted before 20th have been forwarded for digital signature approval.',
    timestamp: '3 hours ago',
    verified: true,
    category: 'Guidance',
    likes: 21
  }
];

export const VakhCommunityBoard: React.FC = () => {
  const { profile } = useCitizen();
  const { language } = useLanguage();
  const [notices, setNotices] = useState<VakhNotice[]>(INITIAL_VAKH_NOTICES);
  const [newText, setNewText] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(profile.district || 'Lucknow');

  const districtsList = ['All Districts', 'Lucknow', 'Varanasi', 'Kanpur Nagar', 'Barabanki', 'Gorakhpur', 'Prayagraj'];

  // Sync with backend API
  useEffect(() => {
    let isMounted = true;
    fetchVakhNotices(selectedDistrict === 'All Districts' ? undefined : selectedDistrict).then(serverNotices => {
      if (isMounted && serverNotices && serverNotices.length > 0) {
        setNotices(serverNotices);
      }
    });
    return () => { isMounted = false; };
  }, [selectedDistrict]);

  // Filter notices
  const filteredNotices = notices.filter(n => {
    const matchesDistrict = selectedDistrict === 'All Districts' || n.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesCat = activeCategory === 'all' || n.category === activeCategory;
    return matchesDistrict && matchesCat;
  });

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const noticePayload = {
      author: profile.name || 'Citizen',
      handle: `@${(profile.name || 'citizen').toLowerCase().replace(/\s+/g, '')}`,
      role: 'Citizen',
      location: `${profile.district || 'Local'} Ward`,
      district: profile.district || 'Lucknow',
      content: newText,
      category: 'Guidance' as const
    };

    // Optimistic UI update
    const newNotice: VakhNotice = {
      id: 'vn-' + Date.now(),
      ...noticePayload,
      role: 'Citizen',
      timestamp: 'Just now',
      verified: false,
      likes: 1
    };

    setNotices([newNotice, ...notices]);
    setNewText('');

    // Broadcast to backend if online
    await broadcastVakhNotice(noticePayload);
  };

  const handleLike = (id: string) => {
    setNotices(prev => prev.map(item => item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Vakh + @samentha Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white p-6 sm:p-8 shadow-2xl border border-emerald-600/40">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-emerald-400/30">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                Live Civic Feed • Vakh.com
              </span>
              <span className="text-xs text-emerald-200/80 font-medium">
                Algorithm-Free Ground Noticeboard
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'hi' ? 'वख जन-चौपाल (स्थानीय नागरिक सूचना पट्ट)' : 'Vakh Civic Chaupal'}
            </h1>

            <p className="text-emerald-100/90 text-sm max-w-xl leading-relaxed">
              {language === 'hi' 
                ? 'जमीनी सरकारी शिविर, सीएससी काउंटर उपलब्धता और तहसील सत्यापन की वास्तविक समय की जानकारी।'
                : 'Real-time ground notices on local CSC desks, Aadhaar camps, and Lekhpal verification schedules across Uttar Pradesh.'}
            </p>

            {/* Moderator Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-xs">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Curated & Moderated by:</span>
              <strong className="text-white font-semibold">Samentha Massey</strong>
              <span className="text-emerald-400 font-mono">@samentha</span>
            </div>
          </div>

          {/* Deep link action button */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
            <a
              href="https://vakh.com/@samentha"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
            >
              <span>Follow @samentha on Vakh</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://vakh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
            >
              <span>Explore Vakh.com</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
            </a>
          </div>
        </div>
      </div>

      {/* District & Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* District Selector */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-slate-500">District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-600 outline-hidden cursor-pointer"
          >
            {districtsList.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'Camp', 'Server Status', 'Guidance', 'Urgent'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Updates' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Broadcast Form */}
      <form onSubmit={handlePostNotice} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
            {profile.name ? profile.name[0] : 'U'}
          </div>
          <div className="flex-1">
            <textarea
              rows={2}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={`Share a ground update, CSC status, or camp alert for ${selectedDistrict === 'All Districts' ? profile.district || 'Uttar Pradesh' : selectedDistrict}...`}
              className="w-full text-sm border-0 focus:ring-0 p-1 resize-none text-slate-800 placeholder-slate-400"
            />
            <div className="flex flex-wrap items-center justify-between pt-2.5 border-t border-slate-100 mt-2 gap-2">
              <span className="text-[11px] text-slate-500">
                Broadcasts chronologically to the local Vakh noticeboard
              </span>
              <button
                type="submit"
                disabled={!newText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <span>Broadcast Notice</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Feed List */}
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Radio className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 font-semibold text-sm">No notices found for {selectedDistrict}</p>
            <p className="text-slate-400 text-xs mt-1">Be the first citizen or CSC operator to post a local update!</p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl border p-5 transition ${
                notice.handle === '@samentha' 
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {notice.author[0]}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">{notice.author}</span>
                      <a 
                        href={`https://vakh.com/${notice.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-700 font-mono hover:underline"
                      >
                        {notice.handle}
                      </a>
                      {notice.verified && (
                        <span title="Verified by JanMitra & Vakh" className="inline-flex">
                          <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    notice.role === 'Lead Desk' ? 'bg-emerald-600 text-white' :
                    notice.role === 'CSC Operator' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    notice.role === 'Panchayat Desk' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                    notice.role === 'Lekhpal Desk' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {notice.role}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400 text-xs shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{notice.timestamp}</span>
                </div>
              </div>

              {/* Notice Content */}
              <p className="text-slate-800 text-sm leading-relaxed mb-3.5 pl-10">
                {notice.content}
              </p>

              {/* Footer row */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 pl-10">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {notice.location}, <strong className="text-slate-700">{notice.district}</strong>
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold ${
                    notice.category === 'Camp' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    notice.category === 'Urgent' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                    notice.category === 'Server Status' ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    #{notice.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(notice.id)}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-slate-200 transition"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-xs">{notice.likes || 0}</span>
                  </button>
                  <a
                    href="https://vakh.com/@samentha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold text-xs ml-1"
                  >
                    <span>Vakh</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
