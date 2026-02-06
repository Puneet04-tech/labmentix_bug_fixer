import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap, 
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Clock,
  Users,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Lightbulb,
  Eye,
  GitBranch,
  Code,
  Bug,
  Timer,
  Award,
  Sparkles
} from 'lucide-react';

const AIAnalytics = () => {
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAIInsights();
  }, []);

  const generateAIInsights = async () => {
    setLoading(true);
    try {
      const response = await API.get('/ai/analytics');
      const { insights: serverInsights = [], predictions: serverPredictions = [], recommendations: serverRecs = [], modelInfo = {} } = response.data || {};

      // Map server insights to the shape expected by the component when necessary
      setInsights(serverInsights.map(item => ({
        title: item.title,
        value: item.value,
        change: item.change,
        icon: item.icon ? TrendingUp : TrendingUp, // backend doesn't send icon component; default to TrendingUp
        description: item.description,
        detail: item.detail
      })));

      setPredictions(serverPredictions.map(pred => pred));
      setRecommendations(serverRecs.map(rec => ({
        ...rec,
        icon: rec.icon ? Zap : Zap
      })));

      // Optionally set model info (not currently displayed by state hooks but part of API)
      // setModelInfo(modelInfo)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load AI analytics');
    } finally {
      setLoading(false);
    }
  };

  const getChangeIcon = (change) => {
    switch (change) {
      case 'positive':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">AI is analyzing your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Intelligent insights powered by machine learning
          </p>
        </div>
        <button
          onClick={generateAIInsights}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Refresh Insights
        </button>
      </div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1">
                  {getChangeIcon(insight.change)}
                  <span className={`text-sm font-semibold ${
                    insight.change === 'positive' ? 'text-green-600' : 
                    insight.change === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {insight.value}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {insight.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {insight.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {insight.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Predictions & Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictions.map((prediction, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              {prediction.title}
            </h3>
            
            {prediction.items && (
              <div className="grid grid-cols-2 gap-4">
                {prediction.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div key={itemIndex} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.label}
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {prediction.risks && (
              <div className="space-y-3">
                {prediction.risks.map((risk, riskIndex) => (
                  <div key={riskIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(risk.level)}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {risk.issue}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Probability: {risk.probability}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      risk.level === 'high' ? 'bg-red-100 text-red-800' :
                      risk.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.level}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          AI-Powered Recommendations
        </h3>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {rec.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(rec.priority)}`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {rec.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Impact: {rec.impact}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Effort: {rec.effort}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                    Implement
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Model Info */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            AI Model Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Model Version</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">v2.1.0</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Last Trained</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">2 hours ago</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Accuracy</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">94.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
