import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Investment } from '../types/investment';

interface InvestmentFormProps {
  onAddInvestment: (investment: Investment) => void;
  onRemoveInvestment: (id: string) => void;
  investments: Investment[];
}

const investmentTypes = [
  { value: 'FD', label: 'Fixed Deposit (FD)', defaultRate: 6.5 },
  { value: 'SIP', label: 'Systematic Investment Plan (SIP)', defaultRate: 12 },
  { value: 'PPF', label: 'Public Provident Fund (PPF)', defaultRate: 7.1 },
  { value: 'RD', label: 'Recurring Deposit (RD)', defaultRate: 6.0 },
  { value: 'NSC', label: 'National Savings Certificate (NSC)', defaultRate: 6.8 },
  { value: 'ELSS', label: 'Equity Linked Savings Scheme (ELSS)', defaultRate: 15 }
];

export const InvestmentForm: React.FC<InvestmentFormProps> = ({
  onAddInvestment,
  onRemoveInvestment,
  investments
}) => {
  const [formData, setFormData] = useState<Omit<Investment, 'id'>>({
    name: '',
    type: 'FD',
    principal: 100000,
    rate: 6.5,
    time: 5,
    frequency: 12
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.principal > 0 && formData.time > 0) {
      onAddInvestment({
        ...formData,
        id: Date.now().toString()
      });
      setFormData({
        name: '',
        type: 'FD',
        principal: 100000,
        rate: 6.5,
        time: 5,
        frequency: 12
      });
    }
  };

  const handleTypeChange = (type: Investment['type']) => {
    const typeConfig = investmentTypes.find(t => t.value === type);
    setFormData(prev => ({
      ...prev,
      type,
      rate: typeConfig?.defaultRate || 6.5
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Add Investment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Bank FD 2024"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value as Investment['type'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {investmentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.type === 'SIP' || formData.type === 'RD' ? 'Monthly Amount (₹)' : 'Principal Amount (₹)'}
            </label>
            <input
              type="number"
              value={formData.principal}
              onChange={(e) => setFormData(prev => ({ ...prev, principal: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (% per annum)
            </label>
            <input
              type="number"
              value={formData.rate}
              onChange={(e) => setFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0.1"
              max="50"
              step="0.1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Period (Years)
            </label>
            <input
              type="number"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="50"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Investment
        </button>
      </form>

      {investments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Added Investments</h3>
          <div className="space-y-2">
            {investments.map((investment) => (
              <div key={investment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div>
                  <span className="font-medium text-gray-800">{investment.name}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    ({investment.type} - {investment.rate}% - {investment.time} years)
                  </span>
                </div>
                <button
                  onClick={() => onRemoveInvestment(investment.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};