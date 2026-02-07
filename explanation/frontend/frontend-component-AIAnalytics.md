# frontend-component-AIAnalytics.md

## Overview
The `AIAnalytics.jsx` component displays AI-powered analytics with insights, predictions, and recommendations.

## File Location
```
frontend/src/components/AIAnalytics.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
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
```

### Import Statement Breakdown:
- **React Hooks**: `useState, useEffect` - State management and lifecycle effects
- **API Utility**: `API` - Centralized HTTP request handling from utils/api.js
- **Toast Notifications**: `toast` from 'react-toastify' - User feedback system
- **Lucide Icons**: 22 individual icon components for visual indicators and UI elements

## State Management
## State Management Syntax

```jsx
const [insights, setInsights] = useState([]);
const [predictions, setPredictions] = useState([]);
const [recommendations, setRecommendations] = useState([]);
const [loading, setLoading] = useState(true);
```

**Syntax Pattern**: Array destructuring with useState hook for multiple state variables.

## Icon Mapping System - Key Syntax

```jsx
const iconMap = {
  bug: Bug,
  timer: Timer,
  users: Users,
  target: Target,
  zap: Zap,
  code: Code,
  eye: Eye,
  award: Award,
  sparkles: Sparkles,
  trendingup: TrendingUp,
  alerttriangle: AlertTriangle
};

const getIconByName = (name) => {
  if (!name) return Bug;
  const key = name.toString().toLowerCase();
  return iconMap[key] || Bug;
};
```

**Syntax Pattern**: Object literal for icon mapping, arrow function with conditional logic and optional chaining.

const getIconByName = (name) => {
  if (!name) return Bug;
  const key = name.toString().toLowerCase();
  return iconMap[key] || Bug;
};
```

### Data Fetching
```jsx
const generateAIInsights = async () => {
  setLoading(true);
  try {
    const response = await API.get('/ai/analytics');
## Data Fetching - Async/Await Syntax

```jsx
const generateAIInsights = async () => {
  setLoading(true);
  try {
    const response = await API.get('/ai/analytics');
    const { insights: serverInsights = [], predictions: serverPredictions = [], recommendations: serverRecs = [], modelInfo = {} } = response.data || {};

    // Transform and map server data to component state when necessary
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
```

**Key Syntax Elements**:
- `async/await` pattern for asynchronous operations
- Destructuring assignment with default values: `{ insights: serverInsights = [] }`
- Spread operator: `{ ...rec, icon: rec.icon ? Zap : Zap }`
- Optional chaining: `error.response?.data?.message`
- Ternary operator: `item.icon ? TrendingUp : TrendingUp`

## Conditional Rendering - Ternary and Logical Operators

```jsx
const getChangeIcon = (change) => {
  switch (change) {
    case 'positive':
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    case 'negative':
## Template Literals and Dynamic Classes

```jsx
<span className={`text-sm font-semibold ${
  insight.change === 'positive' ? 'text-green-600' :
  insight.change === 'negative' ? 'text-red-600' : 'text-gray-600'
}`}>
  {insight.value}
</span>
```

**Syntax Pattern**: Template literals with nested ternary operators for dynamic CSS classes.

## Array Mapping with Conditional Rendering

```jsx
{recommendations.map((rec, index) => {
  const Icon = typeof rec.icon === 'string' ? getIconByName(rec.icon) : (rec.icon || Zap);
  return (
    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
    </div>
  );
})}
```

**Key Syntax**:
- Array.map() with index parameter
- Dynamic component assignment: `const Icon = ...`
- Type checking: `typeof rec.icon === 'string'`
- Logical OR operator: `rec.icon || Zap`

## Critical Code Patterns

### 1. State Updates with Functional Updates
```jsx
setInsights(serverInsights.map(item => ({ ...item })));
```
**Pattern**: Functional state updates with object spread.

### 2. Error Handling with Optional Chaining
```jsx
toast.error(error.response?.data?.message || 'Default message');
```
**Pattern**: Safe property access with fallback values.

### 3. Dynamic Icon Component Selection
```jsx
const Icon = getIconByName(item.icon) || Bug;
<Icon className="w-5 h-5 text-purple-600" />
```
**Pattern**: Dynamic component rendering with fallback.

### 4. Conditional Styling with Template Literals
```jsx
className={`base-classes ${condition ? 'true-class' : 'false-class'}`}
```
**Pattern**: Dynamic CSS classes using template literals and ternary operators.

## Future Enhancements
- Real-time data streaming with WebSockets
- Customizable dashboard layouts
- Export functionality for reports
- Historical trend analysis
- Predictive modeling visualizations
- Integration with external BI tools