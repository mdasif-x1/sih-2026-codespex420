import { db, prisma } from '../lib/server/db';
import { BackendDomainService } from '../lib/server/domainService';
import bcrypt from 'bcryptjs';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ POSTGRES PERSISTENCE TEST FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ POSTGRES PERSISTENCE TEST PASSED: ${message}`);
  }
}

async function runPostgresPersistenceTest() {
  console.log('--- STARTING REAL POSTGRESQL 18 PERSISTENCE & RESTART TEST ---\n');

  // STEP 1: VERIFY POSTGRES DB CONNECTION
  console.log('1. Verifying PostgreSQL 18 Database Connection...');
  const pgUser = await prisma.user.findUnique({ where: { email: 'aarav.st.scholar@gmail.com' } });
  assert(pgUser !== null, 'Found seeded applicant user in PostgreSQL User table');
  assert(pgUser?.role === 'APPLICANT', 'User role correctly persisted in PostgreSQL as APPLICANT');

  const passwordValid = await bcrypt.compare('password123', pgUser!.passwordHash);
  assert(passwordValid === true, 'Bcrypt password hash verified against PostgreSQL record');

  // STEP 2: CREATE APPLICATION IN POSTGRESQL 18
  console.log('\n2. Writing New Application to PostgreSQL 18...');
  const appId = `PRG-PG18-${Date.now().toString().slice(-4)}`;
  const marks = 85;
  const income = 200000;
  const compositeScore = BackendDomainService.calculateCompositeMeritScore(marks, income);

  const newApp = await db.applications.create({
    data: {
      id: appId,
      schemeId: 'scheme_nfst',
      schemeCode: 'NFST',
      schemeName: 'National Fellowship for ST Students',
      schemeVersionId: 'ver_nfst_2026_1',
      applicantId: pgUser!.id,
      applicantName: pgUser!.name,
      applicantEmail: pgUser!.email,
      applicantPhone: '+91 98765 43210',
      stCertificateNo: 'ST/JH/2026/7788',
      instituteName: 'IIT Kharagpur',
      instituteCode: 'INST-IIT-KGP',
      courseName: 'Ph.D. Computer Science',
      academicYear: '2026-2027',
      marksPercentage: marks,
      annualFamilyIncome: income,
      stage: 'SUBMITTED',
      dynamicData: { thesisTitle: 'Distributed Database Systems' },
      documents: [],
      aiFindings: [],
      deficiency: undefined,
      ruleEvaluations: [],
      compositeScore,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: `tl_pg_${Date.now()}`,
          timestamp: new Date().toISOString(),
          stage: 'SUBMITTED',
          actor: pgUser!.name,
          actorRole: 'APPLICANT',
          title: 'Application Created',
          description: 'Persisted into PostgreSQL 18',
        },
      ],
    },
  });
  assert(newApp.id === appId, `Application ${appId} successfully created in PostgreSQL`);

  // Verify direct Prisma PostgreSQL record lookup
  const pgAppRecord = await prisma.application.findUnique({ where: { id: appId } });
  assert(pgAppRecord !== null, 'Application row confirmed in PostgreSQL "Application" table via direct Prisma SQL query');

  // STEP 3: UPDATE WORKFLOW STATE IN POSTGRESQL 18
  console.log('\n3. Updating Stage to OFFICER_REVIEW in PostgreSQL 18...');
  const updatedApp = await db.applications.update({
    where: { id: appId },
    data: {
      stage: 'OFFICER_REVIEW',
      timeline: [
        {
          id: `tl_pg_update_${Date.now()}`,
          timestamp: new Date().toISOString(),
          stage: 'OFFICER_REVIEW',
          actor: 'Dr. S. P. Hansda',
          actorRole: 'INSTITUTE',
          title: 'Institute Verified',
          description: 'Moved stage to OFFICER_REVIEW',
        },
      ],
    },
  });
  assert(updatedApp.stage === 'OFFICER_REVIEW', 'Application stage updated in PostgreSQL to OFFICER_REVIEW');

  // STEP 4: SIMULATE SERVER RESTART (Disconnect & Reconnect)
  console.log('\n4. Simulating Server Restart (Disconnecting & Re-instantiating PrismaClient)...');
  await prisma.$disconnect();

  const newPrismaInstance = new (require('@prisma/client').PrismaClient)();
  const recoveredApp = await newPrismaInstance.application.findUnique({
    where: { id: appId },
    include: { timeline: true },
  });

  assert(recoveredApp !== null, 'Record successfully recovered from PostgreSQL after server restart');
  assert(recoveredApp?.stage === 'OFFICER_REVIEW', `Recovered record stage is ${recoveredApp?.stage} (OFFICER_REVIEW)`);
  assert(recoveredApp?.timeline.length === 2, 'Timeline events correctly persisted and recovered from PostgreSQL');

  await newPrismaInstance.$disconnect();

  console.log('\n🎉 REAL POSTGRESQL 18 PERSISTENCE & SERVER RESTART TEST PASSED 100%!');
}

runPostgresPersistenceTest().catch((err) => {
  console.error('❌ PostgreSQL Persistence Test Failed:', err);
  process.exit(1);
});
