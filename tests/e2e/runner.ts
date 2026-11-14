/**
 * Master Test Runner & Coverage Aggregator for DepositGuard E2E Testing Track.
 * Automatically discovers, executes, and tabulates results across Tiers 1-4.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';

interface TierResult {
  tier: string;
  name: string;
  files: number;
  tests: number;
  passed: number;
  failed: number;
  thresholdMet: boolean;
  notes: string;
}

async function runCommand(cmd: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ['inherit', 'pipe', 'pipe'], cwd: process.cwd() });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    child.on('close', (code) => {
      resolve({ code: code ?? 0, stdout, stderr });
    });
  });
}

function parseTestCount(output: string): { total: number; pass: number; fail: number } {
  const passMatch = output.match(/ℹ pass (\d+)/);
  const failMatch = output.match(/ℹ fail (\d+)/);
  const totalMatch = output.match(/ℹ tests (\d+)/);

  const pass = passMatch ? parseInt(passMatch[1], 10) : 0;
  const fail = failMatch ? parseInt(failMatch[1], 10) : 0;
  const total = totalMatch ? parseInt(totalMatch[1], 10) : pass + fail;

  return { total, pass, fail };
}

async function main() {
  console.log('======================================================================');
  console.log('DepositGuard Independent E2E Test Suite Execution');
  console.log('Platform: HowDoI 2.0 (Phase P0) | Node.js ' + process.version);
  console.log('======================================================================\n');

  const startTime = Date.now();
  const tiers: TierResult[] = [];

  // Tier 1: Feature Coverage
  console.log('Running Tier 1: Isolated Feature Coverage (>=5 tests per feature)...');
  const t1Res = await runCommand('npx', ['tsx', '--test', 'tests/e2e/tier1-features/*.test.ts']);
  const t1Counts = parseTestCount(t1Res.stdout);
  tiers.push({
    tier: 'Tier 1',
    name: 'Feature Coverage',
    files: 13,
    tests: t1Counts.total,
    passed: t1Counts.pass,
    failed: t1Counts.fail,
    thresholdMet: t1Counts.total >= 65 && t1Counts.fail === 0,
    notes: '13 feature suites (>=5 tests each)',
  });

  // Tier 2: Boundary & Corner Cases
  console.log('Running Tier 2: Boundary & Corner Cases (>=5 tests per feature)...');
  const t2Res = await runCommand('npx', ['tsx', '--test', 'tests/e2e/tier2-boundaries/*.test.ts']);
  const t2Counts = parseTestCount(t2Res.stdout);
  tiers.push({
    tier: 'Tier 2',
    name: 'Boundary & Corner Cases',
    files: 5,
    tests: t2Counts.total,
    passed: t2Counts.pass,
    failed: t2Counts.fail,
    thresholdMet: t2Counts.total >= 35 && t2Counts.fail === 0,
    notes: 'Zero/extreme rates, 1m-420m, 100B VND',
  });

  // Tier 3: Cross-Feature Combinations
  console.log('Running Tier 3: Cross-Feature Combinations (Pairwise matrix)...');
  const t3Res = await runCommand('npx', ['tsx', '--test', 'tests/e2e/tier3-combinations/*.test.ts']);
  const t3Counts = parseTestCount(t3Res.stdout);
  tiers.push({
    tier: 'Tier 3',
    name: 'Cross-Feature Combinations',
    files: 1,
    tests: t3Counts.total,
    passed: t3Counts.pass,
    failed: t3Counts.fail,
    thresholdMet: t3Counts.total >= 12 && t3Counts.fail === 0,
    notes: '12+ pairwise interaction scenarios',
  });

  // Tier 4: Real-World Vietnamese Application Scenarios
  console.log('Running Tier 4: Real-World Vietnamese Home Buyer Scenarios...');
  const t4Res = await runCommand('npx', ['tsx', '--test', 'tests/e2e/tier4-scenarios/*.test.ts']);
  const t4Counts = parseTestCount(t4Res.stdout);
  tiers.push({
    tier: 'Tier 4',
    name: 'Real-World Scenarios',
    files: 5,
    tests: t4Counts.total,
    passed: t4Counts.pass,
    failed: t4Counts.fail,
    thresholdMet: t4Counts.total >= 5 && t4Counts.fail === 0,
    notes: 'HCM, Hanoi, Da Nang, Binh Duong, Can Tho',
  });

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  // Tabulate Summary
  console.log('\n======================================================================');
  console.log('E2E TEST SUITE COVERAGE & EXECUTION SUMMARY');
  console.log('======================================================================');
  console.log(
    'Tier   | Category                  | Files | Tests | Pass  | Fail | Threshold | Notes'
  );
  console.log(
    '-------+---------------------------+-------+-------+-------+------+-----------+-------------------------------------'
  );

  let grandTotal = 0;
  let grandPassed = 0;
  let grandFailed = 0;
  let allThresholdsMet = true;

  for (const t of tiers) {
    grandTotal += t.tests;
    grandPassed += t.passed;
    grandFailed += t.failed;
    if (!t.thresholdMet) allThresholdsMet = false;

    const tierStr = t.tier.padEnd(6);
    const catStr = t.name.padEnd(25);
    const filesStr = String(t.files).padStart(5);
    const testsStr = String(t.tests).padStart(5);
    const passStr = String(t.passed).padStart(5);
    const failStr = String(t.failed).padStart(4);
    const statusStr = (t.thresholdMet ? 'PASSED' : 'FAILED').padEnd(9);

    console.log(
      `${tierStr} | ${catStr} | ${filesStr} | ${testsStr} | ${passStr} | ${failStr} | ${statusStr} | ${t.notes}`
    );
  }

  console.log(
    '-------+---------------------------+-------+-------+-------+------+-----------+-------------------------------------'
  );
  console.log(
    `TOTAL  | All Tiers                 |    24 | ${String(grandTotal).padStart(5)} | ${String(grandPassed).padStart(5)} | ${String(grandFailed).padStart(4)} | ${allThresholdsMet ? 'PASSED' : 'FAILED'}   | Total Execution Time: ${durationSec}s`
  );
  console.log('======================================================================\n');

  if (grandFailed > 0 || !allThresholdsMet) {
    console.error('❌ Test execution finished with failures or unmet thresholds.');
    process.exit(1);
  } else {
    console.log('✅ ALL TEST SUITES PASSED (100% PASS RATE). TEST_READY requirements satisfied.');
    process.exit(0);
  }
}

main();
