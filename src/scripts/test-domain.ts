import { BackendDomainService } from '../lib/server/domainService';
import { verifyToken, signToken } from '../lib/server/auth';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ TEST PASSED: ${message}`);
  }
}

console.log('--- RUNNING HARD SECURITY & DOMAIN AUDIT TESTS ---\n');

// 1. Merit Composite Score Formula & Bounds Tests
const scoreA = BackendDomainService.calculateCompositeMeritScore(100, 0);
assert(scoreA === 100.0, `Score A expected 100.0, got ${scoreA}`);

const scoreB = BackendDomainService.calculateCompositeMeritScore(75, 300000);
assert(scoreB === 67.5, `Score B expected 67.5, got ${scoreB}`);

const scoreC = BackendDomainService.calculateCompositeMeritScore(50, 600000);
assert(scoreC === 35.0, `Score C expected 35.0, got ${scoreC}`);

// Out-of-bounds inputs tests
let throwsOnNegativeIncome = false;
try {
  BackendDomainService.calculateCompositeMeritScore(80, -50000);
} catch {
  throwsOnNegativeIncome = true;
}
assert(throwsOnNegativeIncome, 'Negative income must throw input validation error');

let throwsOnInvalidMarks = false;
try {
  BackendDomainService.calculateCompositeMeritScore(105, 200000);
} catch {
  throwsOnInvalidMarks = true;
}
assert(throwsOnInvalidMarks, 'Marks > 100% must throw input validation error');

// 2. Workflow State Machine Tests
assert(
  BackendDomainService.validateStageTransition('SUBMITTED', 'INSTITUTE_VERIFICATION') === true,
  'SUBMITTED -> INSTITUTE_VERIFICATION valid'
);
assert(
  BackendDomainService.validateStageTransition('DRAFT', 'SELECTED') === false,
  'DRAFT -> SELECTED invalid transition blocked'
);
assert(
  BackendDomainService.validateStageTransition('DEFICIENCY', 'DISBURSED') === false,
  'DEFICIENCY -> DISBURSED invalid transition blocked'
);

// 3. JWT & Security Verification
const token = signToken({
  userId: 'usr_test_01',
  email: 'applicant@tribal.gov.in',
  name: 'Test Applicant',
  role: 'APPLICANT',
});

const session = verifyToken(token);
assert(session?.role === 'APPLICANT', 'JWT session correctly verifies APPLICANT role');
assert(session?.email === 'applicant@tribal.gov.in', 'JWT payload email verified');

const invalidSession = verifyToken('forged.invalid.token');
assert(invalidSession === null, 'Forged JWT token correctly rejected');

console.log('\n✨ ALL HARD SECURITY & DOMAIN TESTS COMPLETED SUCCESSFULLY!');
