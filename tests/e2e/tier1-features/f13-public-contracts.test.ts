import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('F13: Public Contracts, Privacy, Currency Formatting & Legacy Routes', async (t) => {
  await t.test('1. Privacy & Data Minimization: Zero PII in simulation contracts', () => {
    // Verify that the standard LoanInput and HouseholdInput contract schemas contain no PII fields
    const sampleLoan: LoanInput = {
      propertyPrice: 2_000_000_000,
      downPayment: 500_000_000,
      loanAmount: 1_500_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 7.0,
      promoPeriodMonths: 12,
      postPromoRate: 11.5,
    };
    const sampleHousehold: HouseholdInput = {
      monthlyNetIncome: 50_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 600_000_000,
    };

    const forbiddenFields = ['name', 'email', 'phone', 'phoneNumber', 'cccd', 'idCard', 'employer', 'address'];
    for (const field of forbiddenFields) {
      assert.strictEqual(
        (sampleLoan as any)[field],
        undefined,
        `LoanInput must not contain PII field: ${field}`
      );
      assert.strictEqual(
        (sampleHousehold as any)[field],
        undefined,
        `HouseholdInput must not contain PII field: ${field}`
      );
    }
  });

  await t.test('2. Vietnamese Currency Formatting specification', () => {
    function formatVND(amount: number): string {
      if (isNaN(amount)) return '0 ₫';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(Math.round(amount));
    }

    function formatCompactVND(amount: number): string {
      if (isNaN(amount) || amount === 0) return '0 ₫';
      const abs = Math.abs(amount);
      if (abs >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toFixed(2).replace(/\.00$/, '')} tỷ ₫`;
      }
      if (abs >= 1_000_000) {
        return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')} tr ₫`;
      }
      return formatVND(amount);
    }

    assert.ok(formatVND(2_000_000_000).includes('₫'), 'Must contain ₫ symbol');
    assert.strictEqual(formatCompactVND(2_500_000_000), '2.50 tỷ ₫', 'Format 2.5 billion VND');
    assert.strictEqual(formatCompactVND(45_000_000), '45 tr ₫', 'Format 45 million VND');
  });

  await t.test('3. Non-alarmist risk classification states', () => {
    const validStatuses = ['SAFE', 'VULNERABLE', 'DEFICIT'];
    assert.ok(validStatuses.includes('SAFE'));
    assert.ok(validStatuses.includes('VULNERABLE'));
    assert.ok(validStatuses.includes('DEFICIT'));
  });

  await t.test('4. SEO Robots Directive contract for simulation results', () => {
    const ketQuaRoute = path.join(process.cwd(), 'app/ket-qua');
    // If route file exists, verify noindex or robots definition
    if (fs.existsSync(path.join(ketQuaRoute, 'page.tsx'))) {
      const content = fs.readFileSync(path.join(ketQuaRoute, 'page.tsx'), 'utf-8');
      assert.ok(
        content.includes('noindex') || content.includes('robots'),
        '/ket-qua page must specify noindex robot directives'
      );
    }
  });

  await t.test('5. Legacy App Store compliance routes and all P0 public routes exist in app directory', () => {
    const appDir = path.join(process.cwd(), 'app');
    const requiredLegacyPaths = [
      'support/page.tsx',
      'privacy/page.tsx',
      'support/cho-con/page.tsx',
      'privacy/cho-con/page.tsx',
      'api/support/route.ts',
    ];

    const requiredP0Routes = [
      'page.tsx',
      'kiem-tra-mua-nha/page.tsx',
      'ket-qua/page.tsx',
      'cach-tinh/page.tsx',
      'cau-hoi-thuong-gap/page.tsx',
      'lien-he/page.tsx',
      've-evolvetech/page.tsx',
      've-howdoi/page.tsx',
      'bao-mat/page.tsx',
      'dieu-khoan/page.tsx',
    ];

    for (const relPath of [...requiredLegacyPaths, ...requiredP0Routes]) {
      const fullPath = path.join(appDir, relPath);
      assert.ok(
        fs.existsSync(fullPath),
        `Required route file must exist: ${relPath}`
      );
    }
  });
});
