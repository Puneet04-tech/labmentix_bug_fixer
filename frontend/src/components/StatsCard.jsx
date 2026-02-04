const StatsCard = ({ title, value, icon, color = 'indigo', subtitle, trend }) => {
  const colorClasses = {
    indigo: 'bg-indigo-900 text-indigo-100',
    blue: 'bg-blue-900 text-blue-100',
    green: 'bg-green-900 text-green-100',
    yellow: 'bg-yellow-800 text-yellow-100',
    red: 'bg-red-800 text-red-100',
    purple: 'bg-purple-900 text-purple-100',
    pink: 'bg-pink-800 text-pink-100',
    orange: 'bg-orange-800 text-orange-100'
  };

  return (
    <div className="bg-[#0f1724] rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-300 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-100">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-1">{trend.positive ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
