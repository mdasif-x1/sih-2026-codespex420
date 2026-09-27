// PRAGATI - Scholarship & Fellowship Management System Domain Model

export type UserRole = 'APPLICANT' | 'INSTITUTE' | 'OFFICER' | 'MONITORING' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution?: string;
  department?: string;
  avatar?: string;
}

export type SchemeStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'textarea' | 'file';

export interface FormFieldDefinition {
  id: string;
  label: string;
  fieldType: FieldType;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: { label: string; value: string }[];
  section: 'personal' | 'academic' | 'financial' | 'scheme_specific' | 'documents';
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    allowedExtensions?: string[];
  };
}

export interface EligibilityRule {
  id: string;
  field: string;
  fieldLabel: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'LESS_THAN_OR_EQUAL' | 'GREATER_THAN_OR_EQUAL' | 'CONTAINS' | 'IN';
  value: string | number | string[];
  errorMessage: string;
  category: 'ST_CATEGORY' | 'INCOME' | 'ACADEMIC' | 'AGE' | 'INSTITUTION';
}

export interface DocumentRequirement {
  id: string;
  type: string;
  label: string;
  description: string;
  required: boolean;
  maxSizeMb: number;
  allowedFormats: string[];
  extractionFields: string[];
}

export interface SchemeVersion {
  versionId: string;
  schemeId: string;
  versionTag: string; // e.g., '2026.1'
  status: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED';
  publishedAt?: string;
  publishedBy?: string;
  effectiveFrom: string;
  effectiveTo: string;
  formFields: FormFieldDefinition[];
  eligibilityRules: EligibilityRule[];
  documentRequirements: DocumentRequirement[];
  selectionMethod: 'MERIT_COMPOSITE' | 'INCOME_PRIORITY' | 'DIRECT_VERIFICATION';
  workflowStages: string[];
  minMarksPercentage?: number;
  maxFamilyIncome?: number;
}

export interface Scheme {
  id: string;
  code: string; // e.g. NFST, NOS, TOPCLASS
  name: string;
  shortDescription: string;
  fullDescription: string;
  ministry: string;
  targetCategory: string;
  currentVersionId: string;
  versions: SchemeVersion[];
  applicationPeriod: {
    startDate: string;
    endDate: string;
  };
  totalSeats?: number;
  budgetAllocatedCr?: number;
}

export type ApplicationStage =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'DOCUMENT_CHECK'
  | 'DEFICIENCY'
  | 'INSTITUTE_VERIFICATION'
  | 'OFFICER_REVIEW'
  | 'SELECTION'
  | 'HUMAN_APPROVAL'
  | 'SELECTED'
  | 'NOT_SELECTED'
  | 'DISBURSEMENT_PENDING'
  | 'DISBURSED';

export interface DocumentExtraction {
  fieldName: string;
  extractedValue: string;
  expectedValue?: string;
  matchScore: number; // 0 - 100
  isMatched: boolean;
  pageNumber?: number;
}

export interface AIFinding {
  id: string;
  documentId: string;
  documentType: string;
  title: string;
  type: 'NAME_MISMATCH' | 'INCOME_MISMATCH' | 'EXPIRED_DOCUMENT' | 'ACADEMIC_PERCENTAGE_MISMATCH' | 'POOR_LEGIBILITY';
  expected: string;
  observed: string;
  confidence: number; // e.g. 91%
  sourceDocName: string;
  sourcePage?: number;
  whyFlagged: string;
  recommendedAction: 'MANUAL_REVIEW' | 'RAISE_DEFICIENCY' | 'ACCEPT_VARIANCE';
  status: 'PENDING_REVIEW' | 'CONFIRMED' | 'DISMISSED' | 'CLARIFICATION_REQUESTED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface UploadedDocument {
  id: string;
  requirementId: string;
  documentType: string;
  fileName: string;
  fileSizeMb: number;
  fileUrl: string;
  uploadedAt: string;
  status: 'PROCESSING' | 'VERIFIED' | 'DEFICIENT' | 'FLAGGED';
  extractions: DocumentExtraction[];
  findings: AIFinding[];
}

export interface DeficiencyHistoryItem {
  id: string;
  timestamp: string;
  actor: string;
  action: 'RAISED' | 'RESUBMITTED' | 'RESOLVED' | 'REJECTED';
  comment: string;
  documentName?: string;
}

export interface Deficiency {
  id: string;
  applicationId: string;
  documentType: string;
  documentId?: string;
  issueType: string;
  problemDescription: string;
  requiredAction: string;
  deadline: string;
  status: 'ACTION_REQUIRED' | 'RESUBMITTED' | 'RESOLVED';
  history: DeficiencyHistoryItem[];
  createdAt: string;
}

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  category: string;
  expectedCondition: string;
  observedValue: string | number;
  result: 'PASS' | 'FAIL' | 'REVIEW';
  notes?: string;
}

export interface ApplicationTimelineEvent {
  id: string;
  timestamp: string;
  stage: ApplicationStage;
  actor: string;
  actorRole: UserRole;
  title: string;
  description: string;
  notes?: string;
}

export interface Application {
  id: string; // e.g., PRG-2026-00182
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  schemeVersionId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  stCertificateNo: string;
  instituteName: string;
  instituteCode: string;
  courseName: string;
  academicYear: string;
  marksPercentage: number;
  annualFamilyIncome: number;
  submittedAt?: string;
  updatedAt: string;
  stage: ApplicationStage;
  dynamicData: Record<string, any>;
  documents: UploadedDocument[];
  aiFindings: AIFinding[];
  deficiency?: Deficiency;
  ruleEvaluations: RuleEvaluationResult[];
  timeline: ApplicationTimelineEvent[];
  compositeScore?: number;
  rank?: number;
  disbursementStatus?: {
    pfmsBatchNo?: string;
    amountRs?: number;
    accountLast4?: string;
    disbursedAt?: string;
  };
}

export interface MeritListItem {
  rank: number;
  applicationId: string;
  applicantName: string;
  schemeCode: string;
  instituteName: string;
  compositeScore: number;
  marksPercentage: number;
  annualIncome: number;
  stCategoryDetails: string;
  verificationStatus: 'VERIFIED' | 'CONDITIONALLY_VERIFIED';
  approvalStatus: 'ELIGIBLE' | 'APPROVED' | 'ON_HOLD';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  reason?: string;
  ipAddress: string;
  requestId: string;
}

export interface AnalyticsSummary {
  totalApplications: number;
  pendingInstituteVerification: number;
  pendingOfficerReview: number;
  aiFlaggedCount: number;
  deficiencyCount: number;
  selectedCount: number;
  totalDisbursedAmountCr: number;
  averageProcessingTimeDays: number;
  stageFunnel: { stage: string; count: number }[];
  deficiencyCategories: { category: string; count: number }[];
  instituteThroughput: { institute: string; verified: number; pending: number }[];
}
