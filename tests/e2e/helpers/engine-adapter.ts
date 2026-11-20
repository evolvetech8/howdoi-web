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
} from "./test-types";
import {
  runSimulationReference,
  solveReverseAffordabilityReference,
} from "./reference-engine";

import * as productionEngineModule from "../../../lib/depositguard/engine";
async function resolveEngine(): Promise<any> {
  return productionEngineModule;
}

export async function runSimulation(
  loan: LoanInput,
  household: HouseholdInput,
  scenario?: StressScenarioInput,
): Promise<SimulationResult> {
  const prod = await resolveEngine();
  if (prod && typeof prod.runSimulation === "function") {
    return prod.runSimulation(loan, household, scenario);
  }
  if (prod && typeof prod.calculateSimulation === "function") {
    return prod.calculateSimulation(loan, household, scenario);
  }
  throw new Error("Production simulation export missing");
}

export async function solveReverseAffordability(
  loan: LoanInput,
  household: HouseholdInput,
  scenario?: StressScenarioInput,
): Promise<AffordabilitySolverResult> {
  const prod = await resolveEngine();
  if (prod && typeof prod.solveReverseAffordability === "function") {
    return prod.solveReverseAffordability(loan, household, scenario);
  }
  if (prod && typeof prod.solveAffordability === "function") {
    return prod.solveAffordability(loan, household, scenario);
  }
  throw new Error("Production solver export missing");
}

export function isUsingProductionEngine(): boolean {
  return productionEngineModule !== null;
}
