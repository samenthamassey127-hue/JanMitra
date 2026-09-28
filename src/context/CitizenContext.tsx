import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, DocumentItem, JourneyItem, ApplicationStage, ShowcaseScenario } from '../types';
import { ALL_DOCUMENTS } from '../data/documents';
import { SHOWCASE_SCENARIOS } from '../data/scenarios';
import { ALL_SCHEMES } from '../data/schemes';
import { ALL_SERVICES } from '../data/services';

interface CitizenContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  removeChip: (chipId: string) => void;
  addChip: (label: string, field: keyof UserProfile | 'goal', value: any) => void;
  documents: DocumentItem[];
  updateDocumentStatus: (id: string, status: DocumentItem['status']) => void;
  uploadDocument: (fileDetails: { name: string; type: string; categoryCode: string }) => Promise<DocumentItem>;
  savedSchemeIds: string[];
  savedServiceIds: string[];
  toggleSaveScheme: (id: string) => void;
  toggleSaveService: (id: string) => void;
  journeys: JourneyItem[];
  addJourney: (schemeId?: string, serviceId?: string) => JourneyItem;
  updateJourneyStage: (id: string, stage: ApplicationStage) => void;
  updateJourneyNotes: (id: string, notes: string, appNumber?: string) => void;
  loadScenario: (scenarioId: ShowcaseScenario['id']) => void;
  activeScenarioId: ShowcaseScenario['id'] | null;
  resetAllData: () => void;
  exportDataJson: () => string;
  activeTab: 'home' | 'discover' | 'services' | 'journey' | 'documents' | 'saved' | 'profile' | 'explain';
  setActiveTab: (tab: any) => void;
  selectedSchemeId: string | null;
  setSelectedSchemeId: (id: string | null) => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  selectedLegalSnippetId: string | null;
  setSelectedLegalSnippetId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-001',
  name: 'Aman Verma',
  age: 20,
  state: 'Uttar Pradesh',
  district: 'Lucknow',
  education: 'B.Tech (Computer Science)',
  occupation: 'Student',
  incomeRange: '₹1.0L - ₹2.5L',
  incomeValue: 250000,
  category: 'OBC',
  gender: 'Male',
  maritalStatus: 'Unmarried',
  disabilityStatus: false,
  ruralUrban: 'Urban',
  institutionType: 'Government-Aided',
  bplCardHolder: false,
  extractedChips: [
    { id: 'c1', label: '20 years', field: 'age', value: 20 },
    { id: 'c2', label: 'Lucknow, UP', field: 'district', value: 'Lucknow' },
    { id: 'c3', label: 'B.Tech', field: 'education', value: 'B.Tech (Computer Science)' },
    { id: 'c4', label: 'Student', field: 'occupation', value: 'Student' },
    { id: 'c5', label: '₹2.5L income', field: 'incomeValue', value: 250000 },
    { id: 'c6', label: 'OBC Category', field: 'category', value: 'OBC' }
  ]
};

const DEFAULT_JOURNEYS: JourneyItem[] = [
  {
    id: 'j-01',
    title: 'UP Post-Matric Scholarship Application',
    titleHi: 'उत्तर प्रदेश दशमोत्तर छात्रवृत्ति आवेदन',
    goal: 'Fee reimbursement and academic maintenance stipend',
    schemeId: 'sch-up-post-matric',
    status: 'preparation',
    currentStepIndex: 1,
    totalSteps: 4,
    applicationNumber: 'UP-SCH-2026-98124',
    notes: 'Income certificate renewal pending at Tehsil. Need to link NPCI Aadhaar bank mapper.',
    lastUpdated: 'Today at 10:45 AM',
    nextAction: 'Renew expired Income Certificate via UP eDistrict service',
    nextActionHi: 'यूपी ई-डिस्ट्रिक्ट द्वारा आय प्रमाण पत्र का नवीनीकरण कराएं',
    steps: [
      {
        title: 'Eligibility & Profile Match',
        titleHi: 'पात्रता एवं प्रोफाइल मिलान',
        completed: true,
        detail: 'Age, state, course, and income criteria evaluated.',
        detailHi: 'आयु, राज्य, पाठ्यक्रम और आय मानदंडों का मिलान हुआ।'
      },
      {
        title: 'Document Preparation & Income Renewal',
        titleHi: 'दस्तावेज तैयारी एवं आय प्रमाण पत्र',
        completed: false,
        current: true,
        detail: '12th marksheet & bonafide ready. Income Certificate expired; renewal in progress.',
        detailHi: 'अंकतालिका और बोनाफाइड तैयार है। आय प्रमाण पत्र नवीनीकरण लंबित है।'
      },
      {
        title: 'Portal Registration & Institute Verification',
        titleHi: 'पोर्टल पंजीकरण एवं संस्थान सत्यापन',
        completed: false,
        detail: 'Complete biometric student lock and college forward.',
        detailHi: 'बायोमेट्रिक लॉक और कॉलेज द्वारा अग्रेषित किया जाना।'
      },
      {
        title: 'District Treasury Approval & DBT Credit',
        titleHi: 'जिला कोषागार अनुमोदन एवं छात्रवृत्ति भुगतान',
        completed: false,
        detail: 'Final fee disbursement to Aadhaar seeded bank account.',
        detailHi: 'आधार से जुड़े खाते में शुल्क प्रतिपूर्ति का भुगतान।'
      }
    ],
    dependencies: [
      {
        name: 'Aadhaar Card',
        nameHi: 'आधार कार्ड',
        status: 'satisfied',
        documentCode: 'aadhaar'
      },
      {
        name: 'Valid Income Certificate (≤ ₹2.5L)',
        nameHi: 'वैध आय प्रमाण पत्र (≤ ₹2.5 लाख)',
        status: 'pending',
        serviceId: 'srv-income-cert',
        documentCode: 'income_cert'
      },
      {
        name: 'UP Domicile Certificate',
        nameHi: 'उत्तर प्रदेश निवास प्रमाण पत्र',
        status: 'pending',
        serviceId: 'srv-domicile-cert',
        documentCode: 'domicile_cert'
      },
      {
        name: 'College Bonafide Fee Receipt',
        nameHi: 'कॉलेज बोनाफाइड फीस रसीद',
        status: 'satisfied',
        documentCode: 'college_bonafide'
      }
    ]
  }
];

const CitizenContext = createContext<CitizenContextType | undefined>(undefined);

export const CitizenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('janmitra_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('janmitra_documents');
    return saved ? JSON.parse(saved) : ALL_DOCUMENTS;
  });

  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('janmitra_saved_schemes');
    return saved ? JSON.parse(saved) : ['sch-up-post-matric'];
  });

  const [savedServiceIds, setSavedServiceIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('janmitra_saved_services');
    return saved ? JSON.parse(saved) : ['srv-income-cert'];
  });

  const [journeys, setJourneys] = useState<JourneyItem[]>(() => {
    const saved = localStorage.getItem('janmitra_journeys');
    return saved ? JSON.parse(saved) : DEFAULT_JOURNEYS;
  });

  const [activeScenarioId, setActiveScenarioId] = useState<ShowcaseScenario['id'] | null>('student');
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'services' | 'journey' | 'documents' | 'saved' | 'profile' | 'explain'>('home');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedLegalSnippetId, setSelectedLegalSnippetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('janmitra_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('janmitra_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('janmitra_saved_schemes', JSON.stringify(savedSchemeIds));
  }, [savedSchemeIds]);

  useEffect(() => {
    localStorage.setItem('janmitra_saved_services', JSON.stringify(savedServiceIds));
  }, [savedServiceIds]);

  useEffect(() => {
    localStorage.setItem('janmitra_journeys', JSON.stringify(journeys));
  }, [journeys]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const removeChip = (chipId: string) => {
    setProfile(prev => {
      const chip = prev.extractedChips.find(c => c.id === chipId);
      const remainingChips = prev.extractedChips.filter(c => c.id !== chipId);
      if (!chip) return { ...prev, extractedChips: remainingChips };

      const updated = { ...prev, extractedChips: remainingChips };
      if (chip.field === 'age') updated.age = 0;
      if (chip.field === 'district') updated.district = '';
      if (chip.field === 'education') updated.education = 'None';
      if (chip.field === 'occupation') updated.occupation = 'Unspecified';
      if (chip.field === 'incomeValue') updated.incomeValue = 0;
      if (chip.field === 'category') updated.category = 'General';
      return updated;
    });
  };

  const addChip = (label: string, field: keyof UserProfile | 'goal', value: any) => {
    setProfile(prev => {
      const newChip = {
        id: 'c_' + Date.now(),
        label,
        field,
        value
      };
      const updated = { ...prev, extractedChips: [...prev.extractedChips, newChip] };
      if (field in prev) {
        (updated as any)[field] = value;
      }
      return updated;
    });
  };

  const updateDocumentStatus = (id: string, status: DocumentItem['status']) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const uploadDocument = async (fileDetails: { name: string; type: string; categoryCode: string }): Promise<DocumentItem> => {
    // Simulate preliminary OCR check
    await new Promise(r => setTimeout(r, 900));

    const existingDoc = documents.find(d => d.code === fileDetails.categoryCode);
    if (existingDoc) {
      const updatedDoc: DocumentItem = {
        ...existingDoc,
        status: 'available',
        uploadedDate: new Date().toISOString().split('T')[0],
        fileSize: '480 KB',
        detectedFields: {
          'Preliminary Check': 'Satisfies scheme criteria',
          'Scan Status': 'Legible & Unaltered',
          'Timestamp': new Date().toLocaleTimeString()
        }
      };
      setDocuments(prev => prev.map(d => d.id === existingDoc.id ? updatedDoc : d));
      return updatedDoc;
    }

    const newDoc: DocumentItem = {
      id: 'doc_' + Date.now(),
      code: fileDetails.categoryCode,
      name: fileDetails.name,
      nameHi: fileDetails.name,
      type: fileDetails.type,
      status: 'available',
      uploadedDate: new Date().toISOString().split('T')[0],
      fileSize: '512 KB',
      issuingAuthority: 'Self Uploaded / Digitally Scanned',
      description: 'Uploaded citizen document evaluated via preliminary check.',
      descriptionHi: 'नागरिक द्वारा अपलोड किया गया दस्तावेज, प्रारंभिक जांच पूर्ण।',
      detectedFields: {
        'File Name': fileDetails.name,
        'Preliminary Check': 'Valid format detected'
      }
    };

    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  };

  const toggleSaveScheme = (id: string) => {
    setSavedSchemeIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSaveService = (id: string) => {
    setSavedServiceIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addJourney = (schemeId?: string, serviceId?: string): JourneyItem => {
    const scheme = schemeId ? ALL_SCHEMES.find(s => s.id === schemeId) : undefined;
    const service = serviceId ? ALL_SERVICES.find(s => s.id === serviceId) : undefined;

    const title = scheme ? `${scheme.name} Application` : service ? `${service.name} Process` : 'New Government Journey';
    const titleHi = scheme ? `${scheme.nameHi} आवेदन` : service ? `${service.nameHi} प्रक्रिया` : 'नई आवेदन यात्रा';

    const newJourney: JourneyItem = {
      id: 'j_' + Date.now(),
      title,
      titleHi,
      goal: scheme?.shortDescription || service?.shortDescription || 'Application guidance',
      schemeId,
      serviceId,
      status: 'preparation',
      currentStepIndex: 0,
      totalSteps: scheme?.applicationSteps.length || service?.steps.length || 3,
      lastUpdated: 'Just now',
      nextAction: 'Gather required documents and check eligibility parameters',
      nextActionHi: 'आवश्यक दस्तावेज एकत्र करें और पात्रता की जांच करें',
      steps: (scheme?.applicationSteps || service?.steps || []).map((step, idx) => ({
        title: step.title,
        titleHi: step.titleHi,
        completed: false,
        current: idx === 0,
        detail: (step as any).guidance || (step as any).action || '',
        detailHi: (step as any).guidanceHi || (step as any).actionHi || ''
      })),
      dependencies: (scheme?.requiredDocumentCodes || service?.requiredDocumentCodes || []).map(code => {
        const doc = documents.find(d => d.code === code);
        return {
          name: doc?.name || code,
          nameHi: doc?.nameHi || code,
          status: doc?.status === 'available' ? 'satisfied' : 'pending',
          documentCode: code,
          serviceId: doc?.relatedServiceId
        };
      })
    };

    setJourneys(prev => [newJourney, ...prev]);
    setActiveTab('journey');
    return newJourney;
  };

  const updateJourneyStage = (id: string, stage: ApplicationStage) => {
    setJourneys(prev => prev.map(j => {
      if (j.id !== id) return j;
      const stageMap: Record<ApplicationStage, number> = {
        not_started: 0,
        preparation: 1,
        ready_to_apply: 2,
        submitted: 3,
        under_verification: 4,
        action_required: 4,
        approved: 5,
        completed: 6,
        rejected: 6
      };
      const newIndex = Math.min(stageMap[stage] || 0, j.steps.length - 1);
      const updatedSteps = j.steps.map((st, i) => ({
        ...st,
        completed: i < newIndex,
        current: i === newIndex
      }));
      return {
        ...j,
        status: stage,
        currentStepIndex: newIndex,
        steps: updatedSteps,
        lastUpdated: 'Just now'
      };
    }));
  };

  const updateJourneyNotes = (id: string, notes: string, appNumber?: string) => {
    setJourneys(prev => prev.map(j => {
      if (j.id !== id) return j;
      return {
        ...j,
        notes,
        applicationNumber: appNumber !== undefined ? appNumber : j.applicationNumber,
        lastUpdated: 'Just now'
      };
    }));
  };

  const loadScenario = (scenarioId: ShowcaseScenario['id']) => {
    const sc = SHOWCASE_SCENARIOS.find(s => s.id === scenarioId);
    if (!sc) return;

    setActiveScenarioId(scenarioId);
    if (sc.initialProfile) {
      setProfile(prev => ({
        ...prev,
        ...sc.initialProfile
      } as UserProfile));
    }
    if (sc.initialDocuments) {
      setDocuments(sc.initialDocuments);
    }

    if (sc.id === 'student') {
      setActiveTab('discover');
      if (sc.targetSchemeId) setSelectedSchemeId(sc.targetSchemeId);
    } else if (sc.id === 'senior') {
      setActiveTab('discover');
      if (sc.targetSchemeId) setSelectedSchemeId(sc.targetSchemeId);
    } else if (sc.id === 'certificate') {
      setActiveTab('services');
      if (sc.targetServiceId) setSelectedServiceId(sc.targetServiceId);
    } else if (sc.id === 'explain') {
      setActiveTab('explain');
      if (sc.targetLegalSnippetId) setSelectedLegalSnippetId(sc.targetLegalSnippetId);
    }
  };

  const resetAllData = () => {
    localStorage.removeItem('janmitra_profile');
    localStorage.removeItem('janmitra_documents');
    localStorage.removeItem('janmitra_saved_schemes');
    localStorage.removeItem('janmitra_saved_services');
    localStorage.removeItem('janmitra_journeys');
    setProfile(DEFAULT_PROFILE);
    setDocuments(ALL_DOCUMENTS);
    setSavedSchemeIds(['sch-up-post-matric']);
    setSavedServiceIds(['srv-income-cert']);
    setJourneys(DEFAULT_JOURNEYS);
    setActiveScenarioId('student');
    setSelectedSchemeId(null);
    setSelectedServiceId(null);
    setSelectedLegalSnippetId(null);
    setActiveTab('home');
  };

  const exportDataJson = (): string => {
    const exportData = {
      platform: 'JanMitra Citizen Vault',
      exportDate: new Date().toISOString(),
      disclaimer: 'Personal citizen data exported for local backup. JanMitra stores no cloud copies.',
      profile,
      documents: documents.map(d => ({
        name: d.name,
        code: d.code,
        status: d.status,
        type: d.type,
        uploadedDate: d.uploadedDate,
        expiryDate: d.expiryDate,
        issuingAuthority: d.issuingAuthority
      })),
      journeys,
      saved: {
        schemes: savedSchemeIds,
        services: savedServiceIds
      }
    };
    return JSON.stringify(exportData, null, 2);
  };

  return (
    <CitizenContext.Provider
      value={{
        profile,
        updateProfile,
        removeChip,
        addChip,
        documents,
        updateDocumentStatus,
        uploadDocument,
        savedSchemeIds,
        savedServiceIds,
        toggleSaveScheme,
        toggleSaveService,
        journeys,
        addJourney,
        updateJourneyStage,
        updateJourneyNotes,
        loadScenario,
        activeScenarioId,
        resetAllData,
        exportDataJson,
        activeTab,
        setActiveTab,
        selectedSchemeId,
        setSelectedSchemeId,
        selectedServiceId,
        setSelectedServiceId,
        selectedLegalSnippetId,
        setSelectedLegalSnippetId,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen
      }}
    >
      {children}
    </CitizenContext.Provider>
  );
};

export const useCitizen = () => {
  const context = useContext(CitizenContext);
  if (!context) throw new Error('useCitizen must be used within CitizenProvider');
  return context;
};
