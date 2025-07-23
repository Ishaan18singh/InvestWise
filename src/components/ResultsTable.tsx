import React from 'react';
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';
import { InvestmentResult } from '../types/investment';

interface ResultsTableProps {
  results: InvestmentResult[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  if (results.length === 0) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      FD: 'bg-blue-100 text-blue-800',
      SIP: 'bg-green-100 text-green-800',
      PPF: 'bg-purple-100 text-purple-800',
      RD: 'bg-orange-100 text-orange-800',
      NSC: 'bg-indigo-100 text-indigo-800',
      ELSS: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Investment Results</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Investment</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Principal/Monthly</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Rate</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Maturity Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Interest Earned</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Return</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, _index) => {
              const totalInvested = result.investment.type === 'SIP' || result.investment.type === 'RD' 
                ? result.investment.principal * result.investment.time * (result.investment.frequency || 12)
                : result.investment.principal * result.investment.time;
              
              const totalReturn = ((result.totalInterest / totalInvested) * 100);
              
              return (
                <tr key={result.investment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-800">
                      {result.investment.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(result.investment.type)}`}>
                      {result.investment.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {formatCurrency(result.investment.principal)}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Percent size={14} />
                      {result.investment.rate}%
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {result.investment.time} years
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-800">
                    {formatCurrency(result.maturityAmount)}
                  </td>
                  <td className="py-4 px-4 text-green-600 font-medium">
                    {formatCurrency(result.totalInterest)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-blue-600 font-medium">
                      <TrendingUp size={14} />
                      {totalReturn.toFixed(1)}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-blue-600" size={20} />
            <h3 className="font-semibold text-blue-800">Highest Returns</h3>
          </div>
          {results.length > 0 && (
            <div>
              <p className="text-sm text-blue-600 mb-1">
                {results.reduce((max, result) => 
                  result.maturityAmount > max.maturityAmount ? result : max
                ).investment.name}
              </p>
              <p className="text-lg font-bold text-blue-800">
                {formatCurrency(Math.max(...results.map(r => r.maturityAmount)))}
              </p>
            </div>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600" size={20} />
            <h3 className="font-semibold text-green-800">Best Interest Rate</h3>
          </div>
          {results.length > 0 && (
            <div>
              <p className="text-sm text-green-600 mb-1">
                {results.reduce((max, result) => 
                  result.investment.rate > max.investment.rate ? result : max
                ).investment.name}
              </p>
              <p className="text-lg font-bold text-green-800">
                {Math.max(...results.map(r => r.investment.rate)).toFixed(1)}%
              </p>
            </div>
          )}
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-purple-600" size={20} />
            <h3 className="font-semibold text-purple-800">Total Interest</h3>
          </div>
          <div>
            <p className="text-sm text-purple-600 mb-1">Across all investments</p>
            <p className="text-lg font-bold text-purple-800">
              {formatCurrency(results.reduce((sum, result) => sum + result.totalInterest, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};