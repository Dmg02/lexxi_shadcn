export type TrialStatus = 'active' | 'completed' | 'upcoming';

export interface Trial {
  id: string;
  caseNumber: string;
  plaintiff: string;
  defendant: string;
  trialType: string;
  customer: string;
  corporation: string;
  notes: string;
  riskFactor: string;
  status: TrialStatus;
  startDate: string;
  leadTeam: string;
  subscribeNotifications: boolean;
  notificationSearch?: string;
  courthouse: string;
}