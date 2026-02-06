import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Target,
  Lightbulb,
  Zap,
  Brain,
  MessageSquare,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'assistant',
          content: '🤖 Hi! I\'m your AI Assistant. I can help you with:',
          suggestions: [
            'Analyze project trends',
            'Predict bug patterns',
            'Suggest improvements',
            'Team performance insights'
          ]
        }
      ]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = async (userInput) => {
    // Simulate AI processing
    setIsTyping(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responses = {
      'analyze': {
        content: '📊 Based on your project data, I found some interesting patterns:',
        insights: [
          { type: 'trend', icon: TrendingUp, text: 'Bug resolution time improved by 23% this month', color: 'text-green-500' },
          { type: 'warning', icon: AlertTriangle, text: 'High priority tickets increased by 15%', color: 'text-yellow-500' },
          { type: 'success', icon: CheckCircle, text: 'Team velocity increased by 8%', color: 'text-blue-500' }
        ]
      },
      'predict': {
        content: '🔮 Predictive Analysis for Next Week:',
        insights: [
          { type: 'prediction', icon: Target, text: 'Expected 12 new high-priority bugs', color: 'text-purple-500' },
          { type: 'prediction', icon: Clock, text: 'Average resolution time: 2.3 days', color: 'text-orange-500' },
          { type: 'prediction', icon: Users, text: 'Team workload: 78% capacity', color: 'text-cyan-500' }
        ]
      },
      'improve': {
        content: '💡 AI-Powered Improvement Suggestions:',
        insights: [
          { type: 'suggestion', icon: Lightbulb, text: 'Consider automated testing for login module', color: 'text-yellow-400' },
          { type: 'suggestion', icon: Zap, text: 'Optimize database queries to reduce load time', color: 'text-blue-400' },
          { type: 'suggestion', icon: Brain, text: 'Implement code review checklist to prevent bugs', color: 'text-green-400' }
        ]
      },
      'team': {
        content: '👥 Team Performance Insights:',
        insights: [
          { type: 'team', icon: Users, text: 'John Doe resolved 45% of critical bugs', color: 'text-indigo-500' },
          { type: 'team', icon: Target, text: 'Frontend team has 92% on-time delivery', color: 'text-pink-500' },
          { type: 'team', icon: CheckCircle, text: 'Code quality score improved to 8.5/10', color: 'text-emerald-500' }
        ]
      }
    };

    // Find matching response
    const lowerInput = userInput.toLowerCase();
    let response = null;
    
    for (const [key, value] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        response = value;
        break;
      }
    }

    // Default response
    if (!response) {
      response = {
        content: '🤖 I can help you with project analysis, predictions, improvements, and team insights. Try asking me to "analyze", "predict", "improve", or check "team" performance.',
        insights: []
      };
    }

    setIsTyping(false);
    return response;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const aiResponse = await generateAIResponse(input);
    
    const assistantMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      ...aiResponse
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const renderMessage = (message) => {
    const isUser = message.type === 'user';
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-blue-500 ml-2' : 'bg-gradient-to-br from-purple-500 to-pink-500 mr-2'
          }`}>
            {isUser ? (
              <span className="text-white text-sm font-bold">U</span>
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
          
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          }`}>
            <p className="text-sm mb-2">{message.content}</p>
            
            {message.insights && message.insights.length > 0 && (
              <div className="space-y-2 mt-3">
                {message.insights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        isUser ? 'bg-blue-600' : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${insight.color}`} />
                      <span className="text-xs">{insight.text}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            {message.suggestions && (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-3 py-1 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              AI Assistant - Click to get insights!
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-96'} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-90">Smart Insights & Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map(renderMessage)}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me about your project..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['Analyze trends', 'Predict issues', 'Suggest fixes', 'Team stats'].map((action) => (
                <button
                  key={action}
                  onClick={() => setInput(action.toLowerCase())}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
