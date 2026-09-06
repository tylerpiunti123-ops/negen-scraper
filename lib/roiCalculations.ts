export interface ROIInputs {
  monthlyLeads: number;
  avgCustomerValue: number;
  closeRate: number; // percent, 0-100
  missedCalls: number;
  avgFollowUpMinutes: number; // minutes of manual work per lead
  employeesHandlingLeads: number;
}

export interface ROIResults {
  estimatedMissedOpportunities: number;
  estimatedMissedValue: number;
  estimatedTimeSpentHours: number;
  potentialRecoveredOpportunities: number;
  potentialRecoveredValue: number;
  potentialTimeSavedHours: number;
}

const MISSED_CALL_LOSS_RATE = 0.62;
const RECOVERY_RATE = 0.35;
const TIME_SAVED_RATE = 0.55;

export function calculateROI(inputs: ROIInputs): ROIResults {
  const closeRateFraction = Math.min(Math.max(inputs.closeRate, 0), 100) / 100;

  const estimatedMissedOpportunities = inputs.missedCalls * MISSED_CALL_LOSS_RATE;
  const estimatedMissedValue = estimatedMissedOpportunities * inputs.avgCustomerValue * closeRateFraction;

  const estimatedTimeSpentHours =
    (inputs.monthlyLeads * inputs.avgFollowUpMinutes) / 60;

  const potentialRecoveredOpportunities = estimatedMissedOpportunities * RECOVERY_RATE;
  const potentialRecoveredValue =
    potentialRecoveredOpportunities * inputs.avgCustomerValue * closeRateFraction;

  const potentialTimeSavedHours = estimatedTimeSpentHours * TIME_SAVED_RATE;

  return {
    estimatedMissedOpportunities,
    estimatedMissedValue,
    estimatedTimeSpentHours,
    potentialRecoveredOpportunities,
    potentialRecoveredValue,
    potentialTimeSavedHours,
  };
}

export const defaultROIInputs: ROIInputs = {
  monthlyLeads: 120,
  avgCustomerValue: 1800,
  closeRate: 35,
  missedCalls: 25,
  avgFollowUpMinutes: 20,
  employeesHandlingLeads: 2,
};
