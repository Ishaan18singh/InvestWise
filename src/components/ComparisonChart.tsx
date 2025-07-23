import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { InvestmentResult } from '../types/investment';

interface ComparisonChartProps {
  results: InvestmentResult[];
}

const colors = ['#2563EB', '#16A34A', '#EA580C', '#7C3AED', '#DC2626', '#059669'];

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ results }) => {
  if (results.length === 0) return null;

  // Prepare data for line chart (growth over time)
  const maxYears = Math.max(...results.map(r => r.investment.time));
  const lineChartData = [];
  
  for (let year = 1; year <= maxYears; year++) {
    const yearData: any = { year };
    
    results.forEach(function (result, _index) {
      if (year <= result.investment.time) {
        const yearlyData = result.yearlyBreakdown.find(y => y.year === year);
        yearData[result.investment.name] = yearlyData ? Math.round(yearlyData.amount) : 0;
      } else {
        yearData[result.investment.name] = 0;
      }
    });
    
    lineChartData.push(yearData);
  }

  // Prepare data for bar chart (final comparison)
  const barChartData = results.map(result => ({
    name: result.investment.name,
    invested: result.investment.type === 'SIP' || result.investment.type === 'RD' 
      ? result.investment.principal * result.investment.time * (result.investment.frequency || 12)
      : result.investment.principal * result.investment.time,
    maturity: Math.round(result.maturityAmount),
    interest: Math.round(result.totalInterest)
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Investment Comparison</h2>
      
      <div className="space-y-8">
        {/* Growth Over Time Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Growth Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend />
                {results.map((result, index) => (
                  <Line
                    key={result.investment.id}
                    type="monotone"
                    dataKey={result.investment.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Final Comparison Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Final Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Legend />
                <Bar dataKey="invested" fill="#94A3B8" name="Total Invested" />
                <Bar dataKey="interest" fill="#16A34A" name="Interest Earned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};