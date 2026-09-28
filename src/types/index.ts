export type Language = 'en' | 'hi';

export type CategoryKey = 
  | 'education' 
  | 'finance' 
  | 'senior' 
  | 'health' 
  | 'housing' 
  | 'employment' 
  | 'certificates' 
  | 'agriculture' 
  | 'business'
  | 'not_sure';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  state: string;
  district: string;
  education: string;
  occupation: string;
  incomeRange: string;
  incomeValue: number;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus: 'Unmarried' | 'Married' | 'Widowed';
  disabilityStatus: boolean;
  ruralUrban: 'Rural' | 'Urban';
  institutionType?: 'Government' | 'Government-Aided' | 'Private Recognized' | 'Unknown';
  bplCardHolder?: boolean;
  extractedChips: Array<{
    id: string;
    label: string;
    field: keyof UserProfile | 'goal';
    value: any;
  }>;
}

export interface DocumentItem {
  id: string;
  code: string;
  name: string;
  nameHi: string;
  type: string;
  status: 'available' | 'expired' | 'missing';
  uploadedDate?: string;
  expiryDate?: string;
  fileSize?: string;
  issuingAuthority?: string;
  detectedFields?: Record<string, string>;
  relatedServiceId?: string; // Service ID to obtain this document if missing
  description: string;
  descriptionHi: string;
}

export type MatchStatus = 'match' | 'uncertain' | 'issue';

export interface RuleEvaluation {
  id: string;
  label: string;
  labelHi: string;
  status: MatchStatus;
  reason: string;
  reasonHi: string;
}

export interface SchemeRule {
  id: string;
  label: string;
  labelHi: string;
  evaluate: (profile: UserProfile) => {
    status: MatchStatus;
    reason: string;
    reasonHi: string;
  };
}

export interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  shortDescription: string;
  shortDescriptionHi: string;
  category: CategoryKey;
  department: string;
  departmentHi: string;
  level: 'State (Uttar Pradesh)' | 'Central (Govt of India)' | 'Centrally Sponsored';
  benefitText: string;
  benefitTextHi: string;
  benefitAmountEstimate?: string;
  rules: SchemeRule[];
  requiredDocumentCodes: string[];
  missingRequirementBridges: Array<{
    title: string;
    titleHi: string;
    documentCode: string;
    serviceId: string;
    explanation: string;
    explanationHi: string;
  }>;
  officialSource: {
    department: string;
    title: string;
    url: string;
    gazetteNo?: string;
    notificationDate: string;
    lastVerified: string;
    officialQuote: string;
  };
  applicationSteps: Array<{
    stepNumber: number;
    title: string;
    titleHi: string;
    action: string;
    actionHi: string;
    guidance: string;
    guidanceHi: string;
  }>;
  tags: string[];
}

export interface GovernmentService {
  id: string;
  name: string;
  nameHi: string;
  shortDescription: string;
  shortDescriptionHi: string;
  department: string;
  departmentHi: string;
  state: string;
  serviceCategory: string;
  fees: string;
  feesHi: string;
  officialPortal: {
    name: string;
    url: string;
  };
  offlineOption: string;
  offlineOptionHi: string;
  processingTime: string;
  processingTimeHi: string;
  requiredDocumentCodes: string[];
  prerequisiteServiceIds?: string[];
  steps: Array<{
    stepNumber: number;
    title: string;
    titleHi: string;
    action: string;
    actionHi: string;
    requiredDocCode?: string;
    whereToGo: string;
    whereToGoHi: string;
    nextConsequence: string;
    nextConsequenceHi: string;
  }>;
  officialSource: {
    department: string;
    title: string;
    url: string;
    notificationDate: string;
    lastVerified: string;
    excerpt: string;
  };
}

export type ApplicationStage =
  | 'not_started'
  | 'preparation'
  | 'ready_to_apply'
  | 'submitted'
  | 'under_verification'
  | 'action_required'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface JourneyItem {
  id: string;
  title: string;
  titleHi: string;
  goal: string;
  schemeId?: string;
  serviceId?: string;
  status: ApplicationStage;
  currentStepIndex: number;
  totalSteps: number;
  applicationNumber?: string;
  notes?: string;
  lastUpdated: string;
  nextAction: string;
  nextActionHi: string;
  steps: Array<{
    title: string;
    titleHi: string;
    completed: boolean;
    current?: boolean;
    detail: string;
    detailHi: string;
  }>;
  dependencies: Array<{
    name: string;
    nameHi: string;
    status: 'satisfied' | 'pending' | 'blocked';
    serviceId?: string;
    documentCode?: string;
  }>;
}

export interface LegalSnippet {
  id: string;
  title: string;
  titleHi: string;
  officialDepartment: string;
  sourceDocument: string;
  originalText: string;
  simpleExplanation: string;
  simpleExplanationHi: string;
  actionSteps: string[];
  actionStepsHi: string[];
  pitfalls: string[];
  pitfallsHi: string[];
  lastVerified: string;
}

export interface ShowcaseScenario {
  id: 'student' | 'senior' | 'certificate' | 'explain';
  name: string;
  nameHi: string;
  badge: string;
  userQuery: string;
  userQueryHi: string;
  initialProfile: Partial<UserProfile>;
  initialDocuments: DocumentItem[];
  targetSchemeId?: string;
  targetServiceId?: string;
  targetLegalSnippetId?: string;
}
