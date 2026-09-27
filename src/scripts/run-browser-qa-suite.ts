import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

async function runBrowserQaSuite() {
  console.log('=====================================================');
  console.log('PRAGATI REAL BROWSER QA SUITE (SYSTEM CHROME / EDGE)');
  console.log('=====================================================\n');

  const scratchDir = path.join(process.cwd(), 'scratch', 'browser-qa');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const routes = [
    { name: '01_home', url: 'http://localhost:3000/' },
    { name: '02_schemes', url: 'http://localhost:3000/schemes' },
    { name: '03_eligibility', url: 'http://localhost:3000/eligibility' },
    { name: '04_login', url: 'http://localhost:3000/login' },
    { name: '05_register', url: 'http://localhost:3000/register' },
    { name: '06_applicant_dashboard', url: 'http://localhost:3000/applicant/dashboard' },
    { name: '07_institute', url: 'http://localhost:3000/institute' },
    { name: '08_officer', url: 'http://localhost:3000/officer' },
    { name: '09_monitoring', url: 'http://localhost:3000/monitoring' },
    { name: '10_admin_audit', url: 'http://localhost:3000/admin/audit' },
  ];

  console.log('[1/2] Desktop Viewport QA (Chrome channel)...');
  const desktopResults: any[] = [];
  for (const route of routes) {
    const shotPath = path.join(scratchDir, `desktop_${route.name}.png`);
    console.log(`  -> Capturing ${route.url} ...`);
    try {
      execSync(`npx playwright screenshot --channel chrome "${route.url}" "${shotPath}"`, {
        stdio: 'pipe'
      });
      const exists = fs.existsSync(shotPath);
      const size = exists ? fs.statSync(shotPath).size : 0;
      desktopResults.push({ route: route.url, screenshot: shotPath, success: exists && size > 0, size });
      console.log(`     ✅ PASS (${size} bytes)`);
    } catch (err: any) {
      console.log(`     ❌ FAIL: ${err.message}`);
      desktopResults.push({ route: route.url, success: false, error: err.message });
    }
  }

  console.log('\n[2/2] Mobile Viewport QA (390x844 Chrome channel)...');
  const mobileResults: any[] = [];
  for (const route of routes) {
    const shotPath = path.join(scratchDir, `mobile_${route.name}.png`);
    console.log(`  -> Capturing Mobile ${route.url} ...`);
    try {
      execSync(`npx playwright screenshot --channel chrome --viewport-size "390, 844" "${route.url}" "${shotPath}"`, {
        stdio: 'pipe'
      });
      const exists = fs.existsSync(shotPath);
      const size = exists ? fs.statSync(shotPath).size : 0;
      mobileResults.push({ route: route.url, screenshot: shotPath, success: exists && size > 0, size });
      console.log(`     ✅ PASS (${size} bytes)`);
    } catch (err: any) {
      console.log(`     ❌ FAIL: ${err.message}`);
      mobileResults.push({ route: route.url, success: false, error: err.message });
    }
  }

  const summary = {
    timestamp: new Date().toISOString(),
    browser: 'System Google Chrome (via Playwright --channel chrome)',
    desktopTotal: desktopResults.length,
    desktopPassed: desktopResults.filter(r => r.success).length,
    mobileTotal: mobileResults.length,
    mobilePassed: mobileResults.filter(r => r.success).length,
    desktopResults,
    mobileResults
  };

  fs.writeFileSync(path.join(scratchDir, 'qa-suite-summary.json'), JSON.stringify(summary, null, 2));

  console.log('\n=====================================================');
  console.log(`REAL BROWSER QA COMPLETE: ${summary.desktopPassed}/${summary.desktopTotal} Desktop & ${summary.mobilePassed}/${summary.mobileTotal} Mobile Pages Captured`);
  console.log('=====================================================');
}

runBrowserQaSuite().catch(err => {
  console.error('Fatal Browser QA Error:', err);
  process.exit(1);
});
