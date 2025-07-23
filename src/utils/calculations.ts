import { evaluate } from 'mathjs';
import { Investment, InvestmentResult, YearlyData } from '../types/investment';

export const calculateFD = (investment: Investment): InvestmentResult => {
  const { principal, rate, time } = investment;
  const amount = principal * Math.pow(1 + rate / 100, time);
  
  const yearlyBreakdown: YearlyData[] = [];
  for (let year = 1; year <= time; year++) {
    const yearAmount = principal * Math.pow(1 + rate / 100, year);
    yearlyBreakdown.push({
      year,
      amount: yearAmount,
      interest: yearAmount - principal,
      totalInvested: principal
    });
  }
  
  return {
    investment,
    maturityAmount: amount,
    totalInterest: amount - principal,
    yearlyBreakdown
  };
};

export const calculateSIP = (investment: Investment): InvestmentResult => {
  const { principal, rate, time, frequency = 12 } = investment;
  const monthlyRate = rate / 100 / frequency;
  const totalPayments = time * frequency;
  
  // SIP formula: M = P × {[(1 + r)^n - 1] / r} × (1 + r)
  const amount = principal * (Math.pow(1 + monthlyRate, totalPayments) - 1) / monthlyRate * (1 + monthlyRate);
  
  const yearlyBreakdown: YearlyData[] = [];
  for (let year = 1; year <= time; year++) {
    const paymentsUpToYear = year * frequency;
    const yearAmount = principal * (Math.pow(1 + monthlyRate, paymentsUpToYear) - 1) / monthlyRate * (1 + monthlyRate);
    const totalInvested = principal * paymentsUpToYear;
    
    yearlyBreakdown.push({
      year,
      amount: yearAmount,
      interest: yearAmount - totalInvested,
      totalInvested
    });
  }
  
  return {
    investment,
    maturityAmount: amount,
    totalInterest: amount - (principal * totalPayments),
    yearlyBreakdown
  };
};

export const calculatePPF = (investment: Investment): InvestmentResult => {
  const { principal, rate, time } = investment;
  const actualRate = rate || 7.1; // Default PPF rate
  
  // PPF allows annual contributions with compound interest
  let amount = 0;
  const yearlyBreakdown: YearlyData[] = [];
  
  for (let year = 1; year <= time; year++) {
    amount = (amount + principal) * (1 + actualRate / 100);
    yearlyBreakdown.push({
      year,
      amount,
      interest: amount - (principal * year),
      totalInvested: principal * year
    });
  }
  
  return {
    investment,
    maturityAmount: amount,
    totalInterest: amount - (principal * time),
    yearlyBreakdown
  };
};

export const calculateRD = (investment: Investment): InvestmentResult => {
  const { principal, rate, time } = investment;
  const monthlyRate = rate / 100 / 12;
  const totalMonths = time * 12;
  
  // RD formula: M = P × n × (1 + r)^n / r × [(1 + r)^n - 1]
  const amount = principal * totalMonths * (1 + monthlyRate) + 
    principal * (totalMonths * (totalMonths + 1) / 2) * monthlyRate;
  
  const yearlyBreakdown: YearlyData[] = [];
  for (let year = 1; year <= time; year++) {
    const monthsUpToYear = year * 12;
    const yearAmount = principal * monthsUpToYear * (1 + monthlyRate) + 
      principal * (monthsUpToYear * (monthsUpToYear + 1) / 2) * monthlyRate;
    
    yearlyBreakdown.push({
      year,
      amount: yearAmount,
      interest: yearAmount - (principal * monthsUpToYear),
      totalInvested: principal * monthsUpToYear
    });
  }
  
  return {
    investment,
    maturityAmount: amount,
    totalInterest: amount - (principal * totalMonths),
    yearlyBreakdown
  };
};

export const calculateInvestment = (investment: Investment): InvestmentResult => {
  switch (investment.type) {
    case 'FD':
      return calculateFD(investment);
    case 'SIP':
      return calculateSIP(investment);
    case 'PPF':
      return calculatePPF(investment);
    case 'RD':
      return calculateRD(investment);
    case 'NSC':
      return calculateFD(investment); // NSC follows compound interest like FD
    case 'ELSS':
      return calculateSIP(investment); // ELSS follows SIP pattern
    default:
      return calculateFD(investment);
  }
};