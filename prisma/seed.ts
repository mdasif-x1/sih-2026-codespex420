import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

async function main() {
  console.log('--- STARTING PRAGATI POSTGRESQL SEEDING ---');

  // Seed Users
  const users = [
    {
      id: 'usr_app_aarav',
      email: 'aarav.st.scholar@gmail.com',
      passwordHash: DEFAULT_PASSWORD_HASH,
      name: 'Aarav Kumar',
      role: 'APPLICANT',
      avatar: 'AK',
    },
    {
      id: 'usr_inst_iitkgp',
      email: 'nodal.scholarship@iitkgp.ac.in',
      passwordHash: DEFAULT_PASSWORD_HASH,
      name: 'Dr. S. P. Hansda',
      role: 'INSTITUTE',
      institution: 'IIT Kharagpur',
      avatar: 'SH',
    },
    {
      id: 'usr_off_rajesh',
      email: 'officer.review@tribal.gov.in',
      passwordHash: DEFAULT_PASSWORD_HASH,
      name: 'Dr. Rajesh Sharma',
      role: 'OFFICER',
      department: 'Ministry of Tribal Affairs - Scholarship Division',
      avatar: 'RS',
    },
    {
      id: 'usr_mon_dir',
      email: 'monitoring.dir@tribal.gov.in',
      passwordHash: DEFAULT_PASSWORD_HASH,
      name: 'Sunil M. Oraon',
      role: 'MONITORING',
      department: 'Directorate of Tribal Welfare Analytics',
      avatar: 'SO',
    },
    {
      id: 'usr_admin_js',
      email: 'js.scholarship@tribal.gov.in',
      passwordHash: DEFAULT_PASSWORD_HASH,
      name: 'Dr. V. K. Meena',
      role: 'ADMIN',
      department: 'Joint Secretary (Scholarship & Schemes)',
      avatar: 'VM',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }
  console.log('✅ Users Seeded Successfully');

  // Seed Schemes
  const schemeNFST = await prisma.scheme.upsert({
    where: { code: 'NFST' },
    update: {},
    create: {
      id: 'scheme_nfst',
      code: 'NFST',
      name: 'National Fellowship for ST Students',
      shortDescription: 'Financial assistance to Scheduled Tribe students for pursuing M.Phil and Ph.D.',
      fullDescription: 'The National Fellowship for ST Students scheme provides financial support to ST students pursuing higher studies.',
      ministry: 'Ministry of Tribal Affairs',
      targetCategory: 'Scheduled Tribes (Higher Education)',
      currentVersionId: 'ver_nfst_2026_1',
      startDate: '2026-08-01',
      endDate: '2026-10-31',
      totalSeats: 750,
      budgetAllocatedCr: 45.0,
    },
  });

  console.log('✅ Schemes Seeded Successfully');

  // Seed Initial Application
  await prisma.application.upsert({
    where: { id: 'PRG-2026-00182' },
    update: {},
    create: {
      id: 'PRG-2026-00182',
      schemeId: schemeNFST.id,
      schemeCode: 'NFST',
      schemeName: 'National Fellowship for ST Students',
      schemeVersionId: 'ver_nfst_2026_1',
      applicantId: 'usr_app_aarav',
      applicantName: 'Aarav Kumar',
      applicantEmail: 'aarav.st.scholar@gmail.com',
      applicantPhone: '+91 98765 43210',
      stCertificateNo: 'ST/JH/2024/90821',
      instituteName: 'Indian Institute of Technology, Kharagpur',
      instituteCode: 'INST-IIT-KGP',
      courseName: 'Ph.D in Environmental Geosciences',
      academicYear: '2026-2027',
      marksPercentage: 74.5,
      annualFamilyIncome: 240000,
      stage: 'OFFICER_REVIEW',
      dynamicData: JSON.stringify({ researchTopic: 'Water Resource Management in Chota Nagpur Plateau' }),
      compositeScore: 91.4,
      rank: 1,
      submittedAt: new Date().toISOString(),
    },
  });
  console.log('✅ Applications Seeded Successfully');

  console.log('🎉 POSTGRESQL SEEDING COMPLETE!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
