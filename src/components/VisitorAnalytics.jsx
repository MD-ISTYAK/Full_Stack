import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { visitorStats } from '../data/dataLoader';

const VisitorAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const periods = [
    { key: 'today', label: 'Today', value: visitorStats.today },
    { key: 'yesterday', label: 'Yesterday', value: visitorStats.yesterday },
    { key: 'week', label: 'Week', value: visitorStats.week },
    { key: 'month', label: 'Month', value: visitorStats.month },
    { key: 'allTime', label: 'All Time', value: visitorStats.allTime }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 font-serif">Platform Analytics</h2>
        <p className="text-gray-400">Real-time visitor statistics and platform engagement metrics</p>
      </div>

      {/* Main Analytics Card */}
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Total Visits</h3>
              <p className="text-sm text-gray-400">Real-time visitor tracking</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-5xl font-bold text-yellow-500 mb-2 font-mono">
            {periods.find(p => p.key === selectedPeriod)?.value.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {periods.map((period) => (
          <button
            key={period.key}
            onClick={() => setSelectedPeriod(period.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedPeriod === period.key
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

    </div>
  );
};

export default VisitorAnalytics;