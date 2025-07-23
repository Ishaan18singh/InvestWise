export interface Investment {
  id: string;
  name: string;
  type: 'FD' | 'SIP' | 'PPF' | 'RD' | 'NSC' | 'ELSS';
  principal: number;
  rate: number;
  time: number;
  frequency?: number; // For SIP (monthly = 12, quarterly = 4)
  lockIn?: number; // Lock-in period in years
  taxBenefit?: boolean;
}

export interface InvestmentResult {
  investment: Investment;
  maturityAmount: number;
  totalInterest: number;
  yearlyBreakdown: YearlyData[];
}

export interface YearlyData {
  year: number;
  amount: number;
  interest: number;
  totalInvested: number;
}