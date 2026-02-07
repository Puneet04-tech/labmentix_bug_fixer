import { motion } from 'framer-motion';
// import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

const TicketChart = ({
  data,
  type = 'bar',
  title,
  subtitle,
  delay = 0,
  showAnimation = true
}) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay }}
        className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-xl"
      >
        <div className="flex items-center justify-center mb-4">
          {/* <BarChart3 className="w-8 h-8 text-slate-500 mr-3" /> */}
          <h3 className="text-xl font-bold text-slate-300">{title}</h3>
        </div>
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <BarChart3 className="w-8 h-8 text-slate-500" />
          </motion.div>
          <p className="text-slate-500 text-lg">No data available</p>
          <p className="text-slate-600 text-sm mt-2">Data will appear here once tickets are created</p>
        </div>
      </motion.div>
    );
  }

  const getColor = (key, index) => {
    const colorPalette = [
      // Status colors
      { bg: '#3B82F6', border: '#1D4ED8', text: '#DBEAFE' }, // Open - Blue
      { bg: '#EAB308', border: '#CA8A04', text: '#FEF3C7' }, // In Progress - Yellow
      { bg: '#A855F7', border: '#7C3AED', text: '#EDE9FE' }, // In Review - Purple
      { bg: '#10B981', border: '#059669', text: '#D1FAE5' }, // Resolved - Green
      { bg: '#6B7280', border: '#4B5563', text: '#F3F4F6' }, // Closed - Gray
      // Priority colors
      { bg: '#10B981', border: '#059669', text: '#D1FAE5' }, // Low - Green
      { bg: '#EAB308', border: '#CA8A04', text: '#FEF3C7' }, // Medium - Yellow
      { bg: '#F97316', border: '#EA580C', text: '#FED7AA' }, // High - Orange
      { bg: '#EF4444', border: '#DC2626', text: '#FECACA' }, // Critical - Red
      // Type colors
      { bg: '#EF4444', border: '#DC2626', text: '#FECACA' }, // Bug - Red
      { bg: '#8B5CF6', border: '#7C3AED', text: '#EDE9FE' }, // Feature - Purple
      { bg: '#3B82F6', border: '#1D4ED8', text: '#DBEAFE' }, // Improvement - Blue
      { bg: '#6B7280', border: '#4B5563', text: '#F3F4F6' }, // Task - Gray
    ];

    // Find color by key first, fallback to index-based color
    const statusColors = {
      'Open': colorPalette[0],
      'In Progress': colorPalette[1],
      'In Review': colorPalette[2],
      'Resolved': colorPalette[3],
      'Closed': colorPalette[4],
      'Low': colorPalette[5],
      'Medium': colorPalette[6],
      'High': colorPalette[7],
      'Critical': colorPalette[8],
      'Bug': colorPalette[9],
      'Feature': colorPalette[10],
      'Improvement': colorPalette[11],
      'Task': colorPalette[12],
    };

    return statusColors[key] || colorPalette[index % colorPalette.length];
  };

  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([_, value]) => value));

  if (type === 'bar') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center">
              {/* <BarChart3 className="w-6 h-6 mr-3 text-blue-400" /> */}
              {title}
            </h3>
            {subtitle && (
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-500">Live Data</span>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          {entries.map(([key, value], index) => {
            const color = getColor(key, index);
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + index * 0.1 }}
                className="group"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {key}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">{value}</span>
                    <span className="text-xs text-slate-500">
                      ({Math.round(percentage)}%)
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{
                        delay: delay + index * 0.1 + 0.2,
                        duration: 0.8,
                        ease: "easeOut"
                      }}
                      className="h-3 rounded-full relative overflow-hidden"
                      style={{ backgroundColor: color.bg }}
                    >
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`
                        }}
                      />
                    </motion.div>
                  </div>
                  <div
                    className="absolute top-0 left-0 w-1 h-3 rounded-full opacity-60"
                    style={{ backgroundColor: color.border }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  if (type === 'donut') {
    const total = entries.reduce((sum, [_, value]) => sum + value, 0);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay }}
        className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          {/* <PieChart className="w-6 h-6 mr-3 text-purple-400" /> */}
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>

        {/* Chart */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            <motion.svg
              viewBox="0 0 100 100"
              className="transform -rotate-90 w-full h-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, duration: 0.5 }}
            >
              {entries.map(([key, value], index) => {
                const percentage = (value / total) * 100;
                const prevPercentage = entries.slice(0, index).reduce((sum, [_, v]) => sum + (v / total) * 100, 0);
                const color = getColor(key, index);

                return (
                  <motion.circle
                    key={key}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={color.bg}
                    strokeWidth="20"
                    strokeDasharray={`${percentage} ${100 - percentage}`}
                    strokeDashoffset={-prevPercentage}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: percentage / 100 }}
                    transition={{
                      delay: delay + index * 0.1 + 0.3,
                      duration: 0.8,
                      ease: "easeOut"
                    }}
                  />
                );
              })}
            </motion.svg>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.5, type: "spring", stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{total}</div>
                <div className="text-sm text-slate-400">Total</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {entries.map(([key, value], index) => {
            const color = getColor(key, index);
            const percentage = Math.round((value / total) * 100);

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + index * 0.1 + 0.6 }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/30 transition-colors group"
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3 shadow-sm"
                    style={{ backgroundColor: color.bg }}
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {key}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white">{value}</span>
                  <span className="text-xs text-slate-500">({percentage}%)</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return null;
};

export default TicketChart;
