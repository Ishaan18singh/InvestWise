import { useState } from 'react';
import { BarChart3, Calculator, TrendingUp } from 'lucide-react';
import { Investment, InvestmentResult } from './types/investment';
import { InvestmentForm } from './components/InvestmentForm';
import { ComparisonChart } from './components/ComparisonChart';
import { ResultsTable } from './components/ResultsTable';
import { calculateInvestment } from './utils/calculations';

function App() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [results, setResults] = useState<InvestmentResult[]>([]);
  const [livePreview, setLivePreview] = useState<InvestmentResult | null>(null);

  const handleAddInvestment = (investment: Investment) => {
    const newInvestments = [...investments, investment];
    setInvestments(newInvestments);

    const newResults = newInvestments.map(inv => calculateInvestment(inv));
    setResults(newResults);
    setLivePreview(null); // Clear preview after adding
  };

  const handleRemoveInvestment = (id: string) => {
    const newInvestments = investments.filter(inv => inv.id !== id);
    setInvestments(newInvestments);

    const newResults = newInvestments.map(inv => calculateInvestment(inv));
    setResults(newResults);
  };

  const handleLivePreview = (investment: Investment) => {
    const previewResult = calculateInvestment(investment);
    setLivePreview(previewResult);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Investment Comparison Tool</h1>
                <p className="text-sm text-gray-600">Compare returns across different investment options</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calculator size={16} />
                <span>MathJS Calculations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp size={16} />
                <span>Recharts Visualization</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Investment Form */}
          <div className="lg:col-span-1">
            <InvestmentForm
              onAddInvestment={handleAddInvestment}
              onRemoveInvestment={handleRemoveInvestment}
              investments={investments}
              onPreviewChange={handleLivePreview}
            />

            {livePreview && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow text-sm text-gray-800">
                <h4 className="font-semibold mb-2 text-blue-600">Live Return Preview:</h4>
                <p>Total Invested: ₹{livePreview.totalInvested.toLocaleString()}</p>
                <p>Estimated Returns: ₹{livePreview.totalReturns.toLocaleString()}</p>
                <p>Maturity Amount: ₹{livePreview.maturityAmount.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Charts and Results */}
          <div className="lg:col-span-2 space-y-8">
            {results.length > 0 && <ComparisonChart results={results} />}
            {results.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="bg-gray-100 rounded-full p-6 mx-auto mb-4 w-fit">
                  <BarChart3 className="text-gray-400" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Investments Added</h3>
                <p className="text-gray-600 mb-4">
                  Add your first investment to start comparing returns and see visualizations.
                </p>
                <div className="text-sm text-gray-500">
                  Supported: FD, SIP, PPF, RD, NSC, ELSS
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Table */}
        <div className="mt-8">
          <ResultsTable results={results} />
        </div>

        {/* Footer */}
        <footer className="mt-12 py-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              
            </p>
            <p>
              Investment calculations are estimates.Please consult with a financial advisor for actual investment decisions.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
