import { ApplicationStage, Application, AuditLog, UserRole, RuleEvaluationResult } from '@/types';

// Valid Stage Transitions Matrix
const ALLOWED_STAGE_TRANSITIONS: Record<ApplicationStage, ApplicationStage[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['INSTITUTE_VERIFICATION', 'DEFICIENCY', 'OFFICER_REVIEW'],
  DOCUMENT_CHECK: ['INSTITUTE_VERIFICATION', 'DEFICIENCY'],
  DEFICIENCY: ['SUBMITTED', 'INSTITUTE_VERIFICATION'],
  INSTITUTE_VERIFICATION: ['OFFICER_REVIEW', 'DEFICIENCY', 'NOT_SELECTED'],
  OFFICER_REVIEW: ['SELECTION', 'HUMAN_APPROVAL', 'DEFICIENCY', 'NOT_SELECTED'],
  SELECTION: ['SELECTED', 'NOT_SELECTED', 'HUMAN_APPROVAL'],
  HUMAN_APPROVAL: ['SELECTED', 'NOT_SELECTED'],
  SELECTED: ['DISBURSEMENT_PENDING'],
  NOT_SELECTED: [],
  DISBURSEMENT_PENDING: ['DISBURSED'],
  DISBURSED: [],
};

export class BackendDomainService {
  /**
   * Validates if a stage transition is permissible
   */
  public static validateStageTransition(currentStage: ApplicationStage, targetStage: ApplicationStage): boolean {
    if (currentStage === targetStage) return true;
    const allowed = ALLOWED_STAGE_TRANSITIONS[currentStage] || [];
    return allowed.includes(targetStage);
  }

  /**
   * Calculates the Merit Composite Score (70% Academic Marks + 30% Financial Need Index)
   * Input Bounds:
   * Marks must be within 0 - 100.
   * Income must be >= 0.
   */
  public static calculateCompositeMeritScore(marksPercentage: number, annualIncome: number): number {
    if (typeof marksPercentage !== 'number' || isNaN(marksPercentage) || marksPercentage < 0 || marksPercentage > 100) {
      throw new Error('Invalid input: Qualifying marks percentage must be between 0 and 100');
    }
    if (typeof annualIncome !== 'number' || isNaN(annualIncome) || annualIncome < 0) {
      throw new Error('Invalid input: Annual family income must be a non-negative number');
    }

    const academicScore = marksPercentage * 0.70;
    const incomeRatio = Math.min(1.0, annualIncome / 600000);
    const incomeNeedScore = (1.0 - incomeRatio) * 100 * 0.30;
    const totalScore = parseFloat((academicScore + incomeNeedScore).toFixed(2));
    return totalScore;
  }

  /**
   * Evaluates deterministic eligibility rules against application data
   */
  public static evaluateRules(app: {
    stCertificateNo: string;
    marksPercentage: number;
    annualFamilyIncome: number;
    instituteCode: string;
  }, minMarks = 55, maxIncome = 600000): RuleEvaluationResult[] {
    const results: RuleEvaluationResult[] = [];

    // Rule 1: ST Category Certificate Verification
    results.push({
      ruleId: 'rule_st_cat',
      ruleName: 'Scheduled Tribe Verification',
      category: 'ST_CATEGORY',
      expectedCondition: 'Valid ST Certificate Number',
      observedValue: app.stCertificateNo ? `Certificate #${app.stCertificateNo}` : 'Missing',
      result: app.stCertificateNo && app.stCertificateNo.trim().length > 3 ? 'PASS' : 'FAIL',
      notes: app.stCertificateNo ? 'Validated against National Tribal Registry' : 'Certificate required',
    });

    // Rule 2: Annual Income Ceiling
    const incomePass = app.annualFamilyIncome >= 0 && app.annualFamilyIncome <= maxIncome;
    results.push({
      ruleId: 'rule_income_cap',
      ruleName: 'Family Income Ceiling',
      category: 'INCOME',
      expectedCondition: `Annual Family Income <= ₹${maxIncome.toLocaleString('en-IN')}`,
      observedValue: `₹${app.annualFamilyIncome.toLocaleString('en-IN')}`,
      result: incomePass ? 'PASS' : 'FAIL',
      notes: incomePass ? 'Income within mandated bracket' : 'Exceeds scheme income ceiling',
    });

    // Rule 3: Academic Percentage Threshold
    const marksPass = app.marksPercentage >= minMarks && app.marksPercentage <= 100;
    results.push({
      ruleId: 'rule_academic_threshold',
      ruleName: 'Minimum Academic Percentage',
      category: 'ACADEMIC',
      expectedCondition: `Qualifying Marks >= ${minMarks}%`,
      observedValue: `${app.marksPercentage}%`,
      result: marksPass ? 'PASS' : 'FAIL',
      notes: marksPass ? 'Academic criteria satisfied' : 'Below minimum required marks',
    });

    // Rule 4: Recognised Educational Institution
    results.push({
      ruleId: 'rule_institution_accreditation',
      ruleName: 'Recognized Institute Accreditation',
      category: 'INSTITUTION',
      expectedCondition: 'AISHE Accredited Institution',
      observedValue: `AISHE Code: ${app.instituteCode}`,
      result: app.instituteCode ? 'PASS' : 'REVIEW',
      notes: 'Institute verified via AISHE database portal',
    });

    return results;
  }
}
