import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ComposedChart,
  Treemap
} from 'recharts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend,
  ArcElement
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity,
  TrendingUp,
  TrendingDown,
  Settings,
  Download,
  RefreshCw,
  Maximize2,
  Grid3x3,
  Layers,
  Zap,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartJSTooltip,
  ChartJSLegend,
  ArcElement
);

const ModernCharts = ({
  data,
  chartType = 'bar',
  title = 'Chart',
  subtitle = '',
  height = 400,
  animated = true,
  theme = 'dark',
  showControls = true,
  showLegend = true,
  showTooltip = true,
  customColors = null,
  onDataPointClick = null,
  className = ''
}) => {
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);

  const defaultColors = {
    primary: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'],
    secondary: ['#1E40AF', '#6D28D9', '#BE185D', '#D97706', '#059669', '#DC2626'],
    gradient: ['#3B82F6', '#8B5CF6', '#EC4899'],
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  };

  const colors = customColors || defaultColors;

  const chartTypes = [
    { id: 'bar', icon: BarChart3, label: 'Bar', fullName: 'Bar Chart' },
    { id: 'line', icon: LineChartIcon, label: 'Line', fullName: 'Line Chart' },
    { id: 'pie', icon: PieChartIcon, label: 'Pie', fullName: 'Pie Chart' },
    { id: 'area', icon: Activity, label: 'Area', fullName: 'Area Chart' },
    { id: 'radar', icon: Target, label: 'Radar', fullName: 'Radar Chart' },
    { id: 'scatter', icon: Zap, label: 'Scatter', fullName: 'Scatter Plot' },
    { id: 'composed', icon: Layers, label: 'Composed', fullName: 'Composed Chart' },
    { id: 'treemap', icon: Grid3x3, label: 'Treemap', fullName: 'Tree Map' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting chart data...');
  };

  const renderRechartsBar = () => (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
          <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          <Bar dataKey="value" fill={colors.primary[0]} radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors.primary[index % colors.primary.length]}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderRechartsLine = () => (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
          <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={colors.primary[0]} 
            strokeWidth={3}
            dot={{ fill: colors.primary[0], r: 6, style: { cursor: 'pointer' } }}
            activeDot={{ r: 8, style: { cursor: 'pointer' } }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderRechartsPie = () => (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={Math.min(height, 300) / 3}
            fill={colors.primary[0]}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors.primary[index % colors.primary.length]}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderRechartsArea = () => (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
          <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={colors.primary[0]} 
            fill={colors.primary[0]}
            fillOpacity={0.6}
            style={{ cursor: 'pointer' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const renderRechartsRadar = () => (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 80, left: 80, bottom: 20 }}>
          <PolarGrid stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
          <PolarAngleAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          <PolarRadiusAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          <Radar 
            name="Value" 
            dataKey="value" 
            stroke={colors.primary[0]} 
            fill={colors.primary[0]}
            fillOpacity={0.6}
          />
          {showLegend && <Legend />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderChartJSDoughnut = () => {
    const chartData = {
      labels: data.map(item => item.name),
      datasets: [
        {
          data: data.map(item => item.value),
          backgroundColor: colors.primary,
          borderWidth: 0,
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
          position: 'bottom',
          labels: {
            color: theme === 'dark' ? '#F3F4F6' : '#111827',
            padding: 20
          }
        },
        tooltip: {
          enabled: showTooltip
        }
      }
    };

    return (
      <div style={{ width: '100%', height: height }}>
        <Doughnut data={chartData} options={options} />
      </div>
    );
  };

  const renderPlotlyChart = () => (
    <div style={{ width: '100%', height: height }}>
      <Plot
        data={[
          {
            x: data.map(item => item.name),
            y: data.map(item => item.value),
            type: 'scatter',
            mode: 'markers+lines',
            marker: { color: colors.primary[0], size: 12 },
            line: { color: colors.primary[0], width: 3 }
          }
        ]}
        layout={{
          height: height,
          width: '100%',
          paper_bgcolor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
          plot_bgcolor: theme === 'dark' ? '#111827' : '#F9FAFB',
          font: { color: theme === 'dark' ? '#F3F4F6' : '#111827' },
          showlegend: showLegend,
          margin: { t: 20, r: 20, b: 40, l: 40 },
          autosize: true
        }}
        config={{
          responsive: true
        }}
      />
    </div>
  );

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No data available</p>
          </div>
        </div>
      );
    }

    switch (selectedChartType) {
      case 'bar':
        return renderRechartsBar();
      case 'line':
        return renderRechartsLine();
      case 'pie':
        return renderRechartsPie();
      case 'area':
        return renderRechartsArea();
      case 'radar':
        return renderRechartsRadar();
      case 'doughnut':
        return renderChartJSDoughnut();
      case 'plotly':
        return renderPlotlyChart();
      case 'scatter':
        return renderPlotlyChart(); // Using Plotly for scatter
      case 'composed':
        return renderRechartsBar(); // Using bar as fallback for composed
      case 'treemap':
        return renderRechartsPie(); // Using pie as fallback for treemap
      default:
        return renderRechartsBar();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-xl shadow-lg p-6 ${className}`}
      style={{ minHeight: height + 100, width: '100%' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              {subtitle}
            </p>
          )}
        </div>
        
        {showControls && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <RefreshCw className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExport}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <Download className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <Maximize2 className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        )}
      </div>

      {/* Chart Type Selector */}
      {showControls && (
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
          {chartTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedChartType(type.id)}
                title={type.fullName}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  selectedChartType === type.id
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Chart Container */}
      <motion.div
        variants={chartVariants}
        className={`relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-' + (theme === 'dark' ? 'gray-900' : 'white') + ' p-8' : ''}`}
        style={{ height: height, width: '100%' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-900 z-10">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        
        {renderChart()}
        
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      {/* Footer Stats */}
      {data && data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className={`text-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {data.reduce((sum, item) => sum + (item.value || 0), 0)}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {Math.max(...data.map(item => item.value || 0))}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Max</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {Math.min(...data.map(item => item.value || 0))}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Min</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {Math.round(data.reduce((sum, item) => sum + (item.value || 0), 0) / data.length)}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Average</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ModernCharts;
