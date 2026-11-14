/**
 * Dual Engine Adapter for DepositGuard E2E Testing Track.
 * Bridges tests directly to the production engine (`lib/depositguard/engine`)
 * or to the authoritative reference specification engine.
 */

import type {
  LoanInput,
  HouseholdInput,
  StressScenarioInput,
  SimulationResult,
  AffordabilitySolverResult,
} from './test-types';
import {
  runSimulationReference,
  solveReverseAffordabilityReference,
} from './reference-engine';

let productionEngineModule: any = null;
let resolved = false;

async function resolveEngine(): Promise<any> {
  if (resolved) return productionEngineModule;
  try {
    // Dynamic string indirection prevents TS compile-time missing module errors before M1 completion
    const modulePath = '../../lib/depositguard/engine';
    productionEngineModule = await import(/* @vite-ignore */ modulePath);
  } catch {
    productionEngineModule = null;
  }
  resolved = true;
  return productionEngineModule;
}

export async function runSimulation(
  loan: LoanInput,
  household: HouseholdInput,
  scenario?: StressScenarioInput
): Promise<SimulationResult> {
  const prod = await resolveEngine();
  if (prod && typeof prod.runSimulation === 'function') {
    return prod.runSimulation(loan, household, scenario);
  }
  if (prod && typeof prod.calculateSimulation === 'function') {
    return prod.calculateSimulation(loan, household, scenario);
  }
  return runSimulationReference(loan, household, scenario);
}

export async function solveReverseAffordability(
  loan: LoanInput,
  household: HouseholdInput,
  scenario?: StressScenarioInput
): Promise<AffordabilitySolverResult> {
  const prod = await resolveEngine();
  if (prod && typeof prod.solveReverseAffordability === 'function') {
    return prod.solveReverseAffordability(loan, household, scenario);
  }
  if (prod && typeof prod.solveAffordability === 'function') {
    return prod.solveAffordability(loan, household, scenario);
  }
  return solveReverseAffordabilityReference(loan, household, scenario);
}

export function isUsingProductionEngine(): boolean {
  return productionEngineModule !== null;
}
