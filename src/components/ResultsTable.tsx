import React from 'react';
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';
import { InvestmentResult } from '../types/investment';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6">Investment Results</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              {['Investment', 'Type', 'Principal/Monthly', 'Rate', 'Duration', 'Maturity Amount', 'Interest Earned', 'Total Return'].map(header => (
                <th key={header} className="text-left py-3 px-4 font-semibold text-gray-700">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {results.map((result, index) => {
                const totalInvested = ['SIP', 'RD'].includes(result.investment.type)
                  ? result.investment.principal * result.investment.time * (result.investment.frequency || 12)
                  : result.investment.principal * result.investment.time;
                const totalReturn = (result.totalInterest / totalInvested) * 100;

                return (
                  <motion.tr
                    key={result.investment.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="py-4 px-4 font-medium text-gray-800">{result.investment.name}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(result.investment.type)}`}>
                        {result.investment.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{formatCurrency(result.investment.principal)}</td>
                    <td className="py-4 px-4 text-gray-600 flex items-center gap-1">
                      <Percent size={14} />{result.investment.rate}%
                    </td>
                    <td className="py-4 px-4 text-gray-600 flex items-center gap-1">
                      <Calendar size={14} />{result.investment.time} years
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-800">{formatCurrency(result.maturityAmount)}</td>
                    <td className="py-4 px-4 text-green-600 font-medium">{formatCurrency(result.totalInterest)}</td>
                    <td className="py-4 px-4 text-blue-600 font-medium flex items-center gap-1">
                      <TrendingUp size={14} />{totalReturn.toFixed(1)}%
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Highest Returns',
            icon: <DollarSign className="text-blue-600" size={20} />,
            bg: 'bg-blue-50',
            color: 'text-blue-800',
            label: results.reduce((max, r) => r.maturityAmount > max.maturityAmount ? r : max).investment.name,
            value: formatCurrency(Math.max(...results.map(r => r.maturityAmount)))
          },
          {
            title: 'Best Interest Rate',
            icon: <TrendingUp className="text-green-600" size={20} />,
            bg: 'bg-green-50',
            color: 'text-green-800',
            label: results.reduce((max, r) => r.investment.rate > max.investment.rate ? r : max).investment.name,
            value: `${Math.max(...results.map(r => r.investment.rate)).toFixed(1)}%`
          },
          {
            title: 'Total Interest',
            icon: <Calendar className="text-purple-600" size={20} />,
            bg: 'bg-purple-50',
            color: 'text-purple-800',
            label: 'Across all investments',
            value: formatCurrency(results.reduce((sum, r) => sum + r.totalInterest, 0))
          }
        ].map((card, i) => (
          <motion.div
            key={card.title}
            className={`${card.bg} rounded-lg p-4`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              {card.icon}
              <h3 className={`font-semibold ${card.color}`}>{card.title}</h3>
            </div>
            <p className={`text-sm ${card.color.replace('800', '600')} mb-1`}>{card.label}</p>
            <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
