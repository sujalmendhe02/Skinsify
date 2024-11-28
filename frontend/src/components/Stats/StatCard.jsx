import React from 'react';

const StatCard = ({ title, value, icon: Icon, change, changeType }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-cyan-400" />
        </div>
      </div>
      <div className={`mt-2 flex items-center text-sm ${
        changeType === 'positive' ? 'text-green-400' : 'text-red-400'
      }`}>
        {change}
        <span className="text-gray-400 ml-2">from last month</span>
      </div>
    </div>
  );
};

export default StatCard;