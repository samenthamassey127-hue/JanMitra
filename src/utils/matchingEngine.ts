import { Scheme, UserProfile, DocumentItem, RuleEvaluation, MatchStatus } from '../types';

export interface SchemeEvaluationResult {
  scheme: Scheme;
  overallStatus: 'likely_eligible' | 'potentially_eligible' | 'not_eligible';
  matchScore: number; // 0 to 100
  ruleEvaluations: RuleEvaluation[];
  matchedRulesCount: number;
  totalRulesCount: number;
  availableDocsCount: number;
  totalDocsCount: number;
  missingDocumentCodes: string[];
  expiredDocumentCodes: string[];
  missingBridges: Scheme['missingRequirementBridges'];
  statutoryMatchPercent: number;
  documentReadinessPercent: number;
  documentGapCount: number;
}

export function evaluateSchemeForUser(
  scheme: Scheme,
  profile: UserProfile,
  documents: DocumentItem[]
): SchemeEvaluationResult {
  const ruleEvaluations: RuleEvaluation[] = scheme.rules.map(rule => {
    const res = rule.evaluate(profile);
    return {
      id: rule.id,
      label: rule.label,
      labelHi: rule.labelHi,
      status: res.status,
      reason: res.reason,
      reasonHi: res.reasonHi
    };
  });

  const matchedRules = ruleEvaluations.filter(r => r.status === 'match');
  const issueRules = ruleEvaluations.filter(r => r.status === 'issue');
  const uncertainRules = ruleEvaluations.filter(r => r.status === 'uncertain');

  // Check document availability
  const userDocMap = new Map<string, DocumentItem['status']>();
  documents.forEach(d => {
    userDocMap.set(d.code, d.status);
  });

  const missingDocumentCodes: string[] = [];
  const expiredDocumentCodes: string[] = [];
  let availableDocsCount = 0;

  scheme.requiredDocumentCodes.forEach(code => {
    const status = userDocMap.get(code);
    if (status === 'available') {
      availableDocsCount++;
    } else if (status === 'expired') {
      expiredDocumentCodes.push(code);
    } else {
      missingDocumentCodes.push(code);
    }
  });

  let overallStatus: SchemeEvaluationResult['overallStatus'] = 'potentially_eligible';
  if (issueRules.length > 0) {
    overallStatus = 'not_eligible';
  } else if (uncertainRules.length === 0 && matchedRules.length > 0) {
    overallStatus = 'likely_eligible';
  }

  // Score computation
  const ruleScore = scheme.rules.length > 0 ? (matchedRules.length / scheme.rules.length) * 70 : 50;
  const docScore = scheme.requiredDocumentCodes.length > 0 
    ? (availableDocsCount / scheme.requiredDocumentCodes.length) * 30 
    : 30;
  const matchScore = issueRules.length > 0 ? Math.max(10, Math.round(ruleScore * 0.3)) : Math.round(ruleScore + docScore);

  // Missing bridges filter: only return bridges for documents that are missing or expired
  const activeBridges = scheme.missingRequirementBridges.filter(b => 
    missingDocumentCodes.includes(b.documentCode) || expiredDocumentCodes.includes(b.documentCode)
  );

  const statutoryMatchPercent = scheme.rules.length > 0 
    ? Math.round((matchedRules.length / scheme.rules.length) * 100) 
    : 100;
  const documentReadinessPercent = scheme.requiredDocumentCodes.length > 0 
    ? Math.round((availableDocsCount / scheme.requiredDocumentCodes.length) * 100) 
    : 100;
  const documentGapCount = missingDocumentCodes.length + expiredDocumentCodes.length;

  return {
    scheme,
    overallStatus,
    matchScore,
    ruleEvaluations,
    matchedRulesCount: matchedRules.length,
    totalRulesCount: scheme.rules.length,
    availableDocsCount,
    totalDocsCount: scheme.requiredDocumentCodes.length,
    missingDocumentCodes,
    expiredDocumentCodes,
    missingBridges: activeBridges,
    statutoryMatchPercent,
    documentReadinessPercent,
    documentGapCount
  };
}

export function evaluateAllSchemes(
  schemes: Scheme[],
  profile: UserProfile,
  documents: DocumentItem[]
): SchemeEvaluationResult[] {
  return schemes
    .map(scheme => evaluateSchemeForUser(scheme, profile, documents))
    .sort((a, b) => {
      // Sort by eligibility status then score
      const rank = { likely_eligible: 3, potentially_eligible: 2, not_eligible: 1 };
      if (rank[a.overallStatus] !== rank[b.overallStatus]) {
        return rank[b.overallStatus] - rank[a.overallStatus];
      }
      return b.matchScore - a.matchScore;
    });
}
