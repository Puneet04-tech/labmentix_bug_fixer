# frontend-component-ModernCharts.md

## Overview
The `ModernCharts.jsx` component provides multi-library charting with Recharts, Chart.js, and Plotly.js integration.

## File Location
```
frontend/src/components/ModernCharts.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ComposedChart, Treemap
} from 'recharts';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip as ChartJSTooltip,
  Legend as ChartJSLegend, ArcElement
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import {
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon,
  Activity, TrendingUp, TrendingDown, Settings, Download, RefreshCw,
  Maximize2, Grid3x3, Layers, Zap, Target, AlertCircle,
  CheckCircle, Clock, Users
} from 'lucide-react';
```

### Import Statement Breakdown:
- **React Hooks**: `useState, useEffect` - State management and lifecycle effects
- **Framer Motion**: `motion, AnimatePresence` - Animation library for smooth transitions
- **Recharts**: 20+ components for various chart types (BarChart, LineChart, PieChart, etc.)
- **Chart.js**: Core chart library with scales, elements, and plugins
- **React-ChartJS-2**: React wrapper for Chart.js with Doughnut component
- **React-Plotly.js**: Plotly.js React integration
- **Lucide Icons**: 17 individual icon components for UI elements

## State Management Syntax

```jsx
const [currentChartType, setCurrentChartType] = useState(chartType || 'bar');
const [isFullscreen, setIsFullscreen] = useState(false);
## useEffect Hook - Data Synchronization

```jsx
useEffect(() => {
  if (data && data.length > 0) {
    setChartData(data);
    setAnimationKey(prev => prev + 1);
  }
}, [data]);
```

**Syntax Pattern**: useEffect with dependency array for data synchronization, functional state update for animation key.

## Chart Type Switching - Object Mapping Pattern

```jsx
const chartTypeMap = {
  bar: 'bar',
  line: 'line',
  pie: 'pie',
  area: 'area',
  radar: 'radar',
  scatter: 'scatter',
  composed: 'composed',
  treemap: 'treemap',
  doughnut: 'doughnut',
  plotly: 'plotly'
};

const handleChartTypeChange = (newType) => {
  setCurrentChartType(newType);
  setAnimationKey(prev => prev + 1);
};
```

**Syntax Pattern**: Object literal for type mapping, arrow function for event handling.

## Conditional Rendering with Switch Statement

```jsx
const renderChart = () => {
  switch (currentChartType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData} key={animationKey}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} key={animationKey}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    // ... other cases
  }
};
```

**Syntax Pattern**: Switch statement returning JSX elements, with key prop for re-rendering.

### Multi-Library Integration
- **Recharts**: Primary library for most chart types
- **Chart.js**: Specialized for doughnut charts
- **Plotly**: Advanced interactive visualizations
- **Fallback System**: Graceful degradation when libraries unavailable

### Interactive Controls
- **Chart Type Switcher**: One-click switching between chart types
- **Fullscreen Mode**: Expand chart to full screen
- **Refresh Button**: Reload data with loading animation
- **Export Functionality**: Download chart data (placeholder)

### Animation System
- **Framer Motion**: Smooth enter/exit animations
- **Loading States**: Spinner animations during data refresh
- **Hover Effects**: Interactive hover states on data points
- **Theme Transitions**: Smooth theme switching

### Responsive Design
- **Responsive Container**: Adapts to container size
- **Mobile Optimized**: Touch-friendly controls
- **Flexible Layout**: Grid-based footer statistics
- **Overflow Handling**: Horizontal scroll for chart type selector

## Code Breakdown

### Color System
```jsx
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
```

### Chart Type Configuration
```jsx
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
```

### Chart Rendering Logic
```jsx
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
    case 'bar': return renderRechartsBar();
    case 'line': return renderRechartsLine();
    case 'pie': return renderRechartsPie();
    case 'area': return renderRechartsArea();
    case 'radar': return renderRechartsRadar();
## Color System - Object Literals

```jsx
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
```

**Syntax Pattern**: Nested object literals for color organization.

## Array Mapping for Chart Type Configuration

```jsx
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
```

**Syntax Pattern**: Array of objects with consistent structure for configuration data.

## Conditional Rendering with Early Return

```jsx
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
    case 'bar': return renderRechartsBar();
    case 'line': return renderRechartsLine();
    case 'pie': return renderRechartsPie();
    // ... other cases
  }
};
```

**Syntax Pattern**: Early return for edge cases, switch statement for multiple conditions.

## Array Reduce for Statistics Calculation

```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
  <div className="text-center p-3 rounded-lg bg-gray-700">
    <div className="text-2xl font-bold text-white">
      {data.reduce((sum, item) => sum + (item.value || 0), 0)}
    </div>
    <div className="text-xs text-gray-400">Total</div>
  </div>
</div>
```

**Syntax Pattern**: Array.reduce() with accumulator and initial value, logical OR for default values.

## Critical Code Patterns

### 1. Functional State Updates
```jsx
setAnimationKey(prev => prev + 1);
```
**Pattern**: Using previous state in functional updates for incrementing counters.

### 2. Template Literals with Props
```jsx
<ResponsiveContainer width="100%" height={height}>
```
**Pattern**: Mixing string literals with dynamic prop values.

### 3. Object Destructuring in Switch Cases
```jsx
case 'bar': return renderRechartsBar();
```
**Pattern**: Switch statement with function calls for different chart types.

### 4. Logical OR for Default Values
```jsx
const colors = customColors || defaultColors;
```
**Pattern**: Fallback values using logical OR operator.