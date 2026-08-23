/** Public Patient Leak Calculator math for branded GLP-1 retention framing. */

export type LeakInputs = {
  activePatients: number;
  monthlyPrice: number;
  newPatientsPerMonth: number;
  retentionAt12: number; // 0–1
  patientAcquisitionCost: number;
  avgMonthsRetained: number;
};

export type LeakOutputs = {
  patientsLostPerYear: number;
  annualRevenueNeverEarned: number;
  annualReplacementCost: number;
  tenPointLiftWorth: number;
  retainedAt12: number;
  liftPatientsKept: number;
};

export const LEAK_DEFAULTS: LeakInputs = {
  activePatients: 100,
  monthlyPrice: 500,
  newPatientsPerMonth: 12,
  retentionAt12: 0.32,
  patientAcquisitionCost: 400,
  avgMonthsRetained: 6,
};

export function clampRetention(rate: number): number {
  if (Number.isNaN(rate)) return LEAK_DEFAULTS.retentionAt12;
  return Math.min(1, Math.max(0, rate));
}

export function computeLeak(raw: Partial<LeakInputs>): LeakOutputs {
  const activePatients = Math.max(0, Number(raw.activePatients) || 0);
  const monthlyPrice = Math.max(0, Number(raw.monthlyPrice) || 0);
  const newPatientsPerMonth = Math.max(0, Number(raw.newPatientsPerMonth) || 0);
  const retentionAt12 = clampRetention(Number(raw.retentionAt12));
  const patientAcquisitionCost = Math.max(0, Number(raw.patientAcquisitionCost) || 0);
  const avgMonthsRetained = Math.max(0, Number(raw.avgMonthsRetained) || 0);

  const annualNewPatients = Math.round(newPatientsPerMonth * 12);
  const addressableBook = activePatients + annualNewPatients;

  // Churn from the current book plus patients acquired during the year who don't reach month 12.
  const patientsLostPerYear = Math.round(
    activePatients * (1 - retentionAt12) + annualNewPatients * (1 - retentionAt12),
  );
  const retainedAt12 = Math.round(addressableBook * retentionAt12);
  const annualRevenueNeverEarned = Math.round(patientsLostPerYear * monthlyPrice * avgMonthsRetained);
  const annualReplacementCost = Math.round(patientsLostPerYear * patientAcquisitionCost);
  // 10-point retention lift across the book you are actively managing this year.
  const liftPatientsKept = Math.round(addressableBook * 0.1);
  const tenPointLiftWorth = Math.round(liftPatientsKept * monthlyPrice * avgMonthsRetained);

  return {
    patientsLostPerYear,
    annualRevenueNeverEarned,
    annualReplacementCost,
    tenPointLiftWorth,
    retainedAt12,
    liftPatientsKept,
  };
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format(n);
}
