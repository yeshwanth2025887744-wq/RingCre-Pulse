export type SubmissionStatus = 
  | 'IN_REVIEW' 
  | 'APPETITE_MATCHED' 
  | 'QUOTED' 
  | 'FLAGGED_HIGH_RISK' 
  | 'BOUND' 
  | 'DECLINED';

export type LineOfBusiness = 
  | 'Commercial Property'
  | 'Commercial Package'
  | 'General Liability'
  | 'Commercial Auto & Fleet'
  | 'Cyber & Tech E&O'
  | 'Inland Marine / Cargo'
  | 'Renewable Energy & Power';

export type RiskTier = 
  | 'Tier 1 - Preferred'
  | 'Tier 2 - Standard'
  | 'Tier 3 - Substandard / High Risk'
  | 'Tier 4 - Declined / Ineligible';

export type FindingType = 'positive' | 'warning' | 'critical';

export interface KeyFinding {
  type: FindingType;
  category: string;
  title: string;
  description: string;
  underwritingImpact: string;
}

export interface CatScenario {
  event: string;
  probability: 'Low' | 'Medium' | 'High';
  pmlExposure: string;
  mitigationNotes: string;
}

export interface PricingBreakdown {
  indicatedAnnualPremium: number;
  suggestedDebitCreditPercent: number;
  pricingRationale: string;
  recommendedDeductible: number;
  targetLossRatioExpected: number;
}

export interface CategoryScores {
  propertyRisk: number;
  operationalSafety: number;
  financialSolvency: number;
  cyberPosture: number;
  catPerils: number;
  claimsHistory: number;
}

export interface RiskAnalysis {
  pulseScore: number;
  riskTier: RiskTier;
  appetiteFit: 'Full Appetite Match' | 'Conditional Match (Subjectivities Required)' | 'Out of Appetite';
  categoryScores: CategoryScores;
  executiveSummary: string;
  keyFindings: KeyFinding[];
  recommendedPricing: PricingBreakdown;
  mandatorySubjectivities: string[];
  warrantiesAndEndorsements: string[];
  catastropheScenarios: CatScenario[];
  underwritingAction: 'RECOMMEND_QUOTE' | 'REFERRAL_REQUIRED' | 'DECLINE_RISK';
}

export interface Submission {
  id: string;
  submissionNumber: string;
  companyName: string;
  industry: string;
  naicsCode: string;
  lineOfBusiness: LineOfBusiness;
  brokerName: string;
  brokerAgency: string;
  tiv: number; // Total Insured Value
  revenue: number;
  employees: number;
  yearsInBusiness: number;
  locationsCount: number;
  locations: string;
  locationZone: string;
  lossHistoryText: string;
  claimsPast5YearsCount: number;
  totalLossIncurred: number;
  protections: string;
  cyberPosture: string;
  requestedLimits: string;
  requestedDeductible: string;
  status: SubmissionStatus;
  dateSubmitted: string;
  assignedUnderwriter: string;
  analysis: RiskAnalysis;
  quoteDetails?: {
    boundPremium: number;
    quotedDeductible: number;
    quoteExpiration: string;
    termsNotes: string;
  };
  binderNumber?: string;
  declineReason?: string;
  vendors?: VendorDependency[];
}

export interface AppetiteRule {
  id: string;
  name: string;
  category: string;
  condition: string;
  action: 'AUTO_QUOTE' | 'REFER_SENIOR' | 'DECLINE';
  active: boolean;
}

export interface CarrierAppetiteConfig {
  carrierName: string;
  maxTIVPerLocation: number;
  maxBlanketTIV: number;
  targetLossRatio: number;
  autoQuoteMinPulseScore: number;
  seniorReferralMinPulseScore: number;
  excludedIndustries: string[];
  restrictedPerilZones: string[];
  autoApplyProtectionsCredit: boolean;
}

// ----------------- VENDOR SUPPLY CHAIN RISK TYPES -----------------

export type VendorCategory = 
  | 'Cloud Infrastructure'
  | 'Payment Gateway & Processing'
  | 'HR & Payroll SaaS'
  | 'API & Data Partner'
  | 'Identity Provider (IdP)'
  | 'Logistics & Fleet Telematics'
  | 'Core ERP / CRM System';

export type VendorSecurityRating = 'A (Low Risk)' | 'B (Moderate Risk)' | 'C (Elevated Risk)' | 'D (Critical Exposure)';

export interface ComplianceStandard {
  iso27001Status: 'VERIFIED' | 'EXPIRED' | 'MISSING' | 'IN_PROGRESS';
  soc2Type2Status: 'VERIFIED' | 'EXPIRED' | 'MISSING' | 'IN_PROGRESS';
  pciDssStatus: 'VERIFIED' | 'EXPIRED' | 'MISSING' | 'N/A';
  hipaaCompliant?: boolean;
  lastAuditDate: string;
  certificateExpiry: string;
  auditorFirm: string;
}

export interface VendorDependency {
  id: string;
  name: string;
  category: VendorCategory;
  serviceProvided: string;
  criticality: 'Mission Critical' | 'High' | 'Medium' | 'Low';
  dataAccessLevel: 'Full Production PII / PCI' | 'Restricted Encrypted' | 'Operational Metadata' | 'Internal Ops';
  securityRating: VendorSecurityRating;
  riskScore: number; // 0 to 100
  blastRadiusTier: 'Tier 1 - Master Policy Breach' | 'Tier 2 - Departmental Outage' | 'Tier 3 - Isolated Incident';
  fourthPartyDependencies: string[]; // Sub-processors like AWS, Akamai, Twilio, Snowflake
  compliance: ComplianceStandard;
  recentAuditFindings: string[];
  underwriterApproval: 'APPROVED' | 'CONDITIONAL_WARRANTY' | 'ACTION_REQUIRED' | 'FLAGGED';
  isAuditing?: boolean;
}

export interface CascadeStep {
  step: number;
  entity: string;
  event: string;
  impactDuration: string;
  lossMagnitude: string;
}

export interface CascadeBreachScenario {
  id: string;
  title: string;
  targetVendor: string;
  attackVector: string;
  compromiseType: 'Ransomware Supply-Chain Injection' | 'Cloud Infrastructure Outage' | 'Stolen API Master Credentials' | 'Zero-Day Flaw in 4th-Party Dependency';
  directFinancialLoss: number;
  businessInterruptionHours: number;
  contingentLossOfAttraction: number;
  regulatoryFinesEstimated: number;
  totalCascadeExposure: number;
  propagationSteps: CascadeStep[];
  carrierPolicyImpact: string;
  recommendedSublimit: number;
  recommendedRetention: number;
}

// ----------------- DPDP 2025 & SEBI CSCRF REGULATORY TYPES -----------------

export interface ITVulnerability {
  id: string;
  name: string;
  description: string;
  dpdpClause: string;
  dpdpSection: string;
  sebiCscrfClause: string;
  sebiCscrfDomain: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  statutoryFineInrCrores: number;
  statutoryFineFormatted: string;
  mandatoryCorrectiveControls: string[];
  remediationSLA: string;
  status: 'OPEN' | 'REMEDIATED' | 'AUDIT_VERIFIED';
}

// ----------------- DYNAMIC ACTUARIAL PRICING MODEL TYPES -----------------

export interface ActuarialPricingInput {
  baselinePremiumInr: number;
  activeCriticalCves: number;
  activeHighCves: number;
  activeMediumCves: number;
  closedTicketsCount: number;
  totalTicketsCount: number;
  mfaEnforcementPct: number;
  patchTurnaroundDays: number;
}

export interface ActuarialPricingResult {
  baselinePremiumInr: number;
  cveThreatMultiplier: number;
  cveSurchargeInr: number;
  closedTicketDiscountPct: number;
  closedTicketDiscountInr: number;
  mfaCreditPct: number;
  mfaCreditInr: number;
  slaPatchModifierPct: number;
  finalAdjustedPremiumInr: number;
  netDebitCreditPct: number;
  underwritingVerdict: 'PREFERRED_CREDIT' | 'STANDARD_TERMS' | 'DEBIT_SURCHARGE_REQUIRED' | 'HIGH_EXPOSURE_REFERRAL';
  underwritingNotes: string;
}

// ----------------- REAL-TIME THREAT INTEL STREAM TYPES -----------------

export interface ThreatIntelligenceEvent {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  source: string;
  description: string;
  priorScore: number;
  adjustedScore: number;
  underwriterAlert: string;
  policyBreachFlag: boolean;
  breachedWarranty: string;
  recommendedAction: string;
  status: 'ACTIVE_BREACH' | 'REMEDIATED';
}
