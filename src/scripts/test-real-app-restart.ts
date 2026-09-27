import { spawn } from 'child_process';
import http from 'http';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ REAL PROCESS RESTART TEST FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ REAL PROCESS RESTART TEST PASSED: ${message}`);
  }
}

function fetchJson(url: string, options: any = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function waitForServer(port: number, timeoutMs = 15000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetchJson(`http://localhost:${port}/api/v1/schemes`);
      if (res.status === 200) return true;
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function runRealRestartTest() {
  console.log('--- STARTING REAL NEXT.JS PROCESS RESTART INTEGRATION TEST ---\n');

  const testPort = 3005;

  // STEP 1: Launch Next.js Server Process #1
  console.log(`1. Spawns Next.js Process #1 on port ${testPort}...`);
  const serverProc1 = spawn('npx.cmd', ['next', 'start', '-p', String(testPort)], {
    cwd: process.cwd(),
    shell: true,
    env: { ...process.env, PORT: String(testPort) },
  });

  const ready1 = await waitForServer(testPort);
  assert(ready1 === true, `Next.js Process #1 is live and responding on http://localhost:${testPort}`);

  // STEP 2: Create application via API on Process #1
  console.log('\n2. Creating application via HTTP API on Process #1...');
  const appId = `PRG-RESTART-${Date.now().toString().slice(-4)}`;
  const createPayload = JSON.stringify({
    id: appId,
    schemeId: 'scheme_nfst',
    schemeCode: 'NFST',
    schemeName: 'National Fellowship for ST Students',
    schemeVersionId: 'ver_nfst_2026_1',
    applicantName: 'Restart Verification User',
    applicantEmail: 'aarav.st.scholar@gmail.com',
    applicantPhone: '+91 98765 43210',
    stCertificateNo: 'ST/JH/2026/RESTART',
    instituteName: 'IIT Kharagpur',
    instituteCode: 'INST-IIT-KGP',
    courseName: 'Ph.D Data Engineering',
    academicYear: '2026-2027',
    marksPercentage: 88,
    annualFamilyIncome: 180000,
  });

  const createRes = await fetchJson(`http://localhost:${testPort}/api/v1/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-pragati-role': 'APPLICANT',
    },
    body: createPayload,
  });

  assert(createRes.status === 201, `Application ${appId} created via HTTP POST (Status 201)`);
  const createdAppId = createRes.data.application.id;

  // STEP 3: KILL Process #1 completely
  console.log('\n3. Terminating Next.js Process #1 completely (Simulating Process Crash/Restart)...');
  serverProc1.kill('SIGKILL');
  await new Promise((r) => setTimeout(r, 2000));

  // STEP 4: Launch Next.js Server Process #2
  console.log(`\n4. Spawns Fresh Next.js Process #2 on port ${testPort}...`);
  const serverProc2 = spawn('npx.cmd', ['next', 'start', '-p', String(testPort)], {
    cwd: process.cwd(),
    shell: true,
    env: { ...process.env, PORT: String(testPort) },
  });

  const ready2 = await waitForServer(testPort);
  assert(ready2 === true, `Next.js Process #2 is live and responding on http://localhost:${testPort}`);

  // STEP 5: Query same application from Process #2
  console.log('\n5. Querying application via HTTP GET on Process #2 after process restart...');
  const getRes = await fetchJson(`http://localhost:${testPort}/api/v1/applications/${createdAppId}`, {
    method: 'GET',
    headers: {
      'x-pragati-role': 'ADMIN',
    },
  });

  if (getRes.status !== 200) {
    console.error('Response Status:', getRes.status, 'Response Data:', getRes.data);
  }

  assert(getRes.status === 200, `Application recovered after process restart (Status 200)`);
  assert(
    getRes.data.application.id === createdAppId,
    `Application ID ${createdAppId} confirmed in PostgreSQL after Process #2 restart`
  );
  assert(
    getRes.data.application.applicantName === 'Restart Verification User',
    'Applicant details persisted in PostgreSQL across process boundaries'
  );

  // Clean up Process #2
  serverProc2.kill('SIGKILL');

  console.log('\n🎉 REAL NEXT.JS PROCESS RESTART PERSISTENCE TEST COMPLETED SUCCESSFULLY WITH 100% PASSING RESULTS!');
}

runRealRestartTest().catch((err) => {
  console.error('❌ Process Restart Test Failure:', err);
  process.exit(1);
});
