const { PrismaClient } = require('@prisma/client');

const passwords = ['postgres', 'admin', 'root', '123456', 'password', 'Postgres', 'Postgres123', 'pragati', 'pragati123', ''];

async function testPassword(pwd) {
  const url = `postgresql://postgres:${encodeURIComponent(pwd)}@localhost:5432/postgres`;
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    console.log('✅ VALID POSTGRES PASSWORD FOUND:', pwd === '' ? '(empty)' : pwd);
    await prisma.$disconnect();
    return pwd;
  } catch (e) {
    const firstLine = e.message.split('\n')[0];
    console.log(`Testing password '${pwd}': ${firstLine}`);
    await prisma.$disconnect();
    return null;
  }
}

async function run() {
  for (const pwd of passwords) {
    const found = await testPassword(pwd);
    if (found !== null) {
      process.exit(0);
    }
  }
  console.log('❌ Could not authenticate with tested passwords');
  process.exit(1);
}

run();
