const TicketChart = ({ data, type = 'bar', title }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  const getColor = (key) => {
    const colors = {
      // Status colors
      'Open': '#3B82F6',
      'In Progress': '#EAB308',
      'In Review': '#A855F7',
      'Resolved': '#10B981',
      'Closed': '#6B7280',
      // Priority colors
      'Low': '#10B981',
      'Medium': '#EAB308',
      'High': '#F97316',
      'Critical': '#EF4444',
      // Type colors
      'Bug': '#EF4444',
      'Feature': '#8B5CF6',
      'Improvement': '#3B82F6',
      'Task': '#6B7280'
    };
    return colors[key] || '#6B7280';
  };

  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([_, value]) => value));

  if (type === 'bar') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-4">
          {entries.map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{key}</span>
                <span className="text-sm font-bold text-gray-900">{value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%`,
                    backgroundColor: getColor(key)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'donut') {
    const total = entries.reduce((sum, [_, value]) => sum + value, 0);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {entries.reduce((acc, [key, value], index) => {
                const percentage = (value / total) * 100;
                const prevPercentage = entries.slice(0, index).reduce((sum, [_, v]) => sum + (v / total) * 100, 0);
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -prevPercentage;
                
                return [
                  ...acc,
                  <circle
                    key={key}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={getColor(key)}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                ];
              }, [])}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          {entries.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getColor(key) }}
                />
                <span className="text-sm text-gray-700">{key}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {value} ({Math.round((value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default TicketChart;
