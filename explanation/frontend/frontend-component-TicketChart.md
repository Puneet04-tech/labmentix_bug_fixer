# frontend-component-TicketChart.md

## Overview
The `TicketChart.jsx` component renders bar and donut charts with dynamic colors and data visualization.

## File Location
```
frontend/src/components/TicketChart.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
// No external imports - pure React component with inline SVG
```

**Note**: This component uses only React and Tailwind CSS, with inline SVG for chart rendering.

## Props Destructuring with Defaults

```jsx
const TicketChart = ({ data, type = 'bar', title }) => {
```

**Syntax Pattern**: Arrow function component with destructured props and default parameter.

## Early Return for Empty State

```jsx
if (!data || Object.keys(data).length === 0) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-500 text-center py-8">No data available</p>
    </div>
  );
}
```

**Syntax Pattern**: Conditional early return to handle empty or null data.

## Object.entries for Data Iteration

```jsx
const entries = Object.entries(data);
```

**Syntax Pattern**: Converting object to key-value pairs array for iteration.

## Math.max with Spread Operator

```jsx
const maxValue = Math.max(...entries.map(([_, value]) => value));
```

**Syntax Pattern**: Spread operator with array destructuring to find maximum value.

## Array Map with Destructuring

```jsx
{entries.map(([key, value], index) => (
  <div key={key} className="bar-container">
    <div
      className="bar"
      style={{ width: `${(value / maxValue) * 100}%`, backgroundColor: getColor(key) }}
    />
  </div>
))}
```

**Syntax Pattern**: Array map with parameter destructuring for key-value pairs.

## Inline Styles with Template Literals

```jsx
style={{ width: `${(value / maxValue) * 100}%`, backgroundColor: getColor(key) }}
```

**Syntax Pattern**: Template literals for dynamic percentage calculations.

## Array Reduce for Cumulative Calculations

```jsx
const segments = entries.reduce((acc, [key, value], index) => {
  const percentage = (value / total) * 100;
  const cumulativePercentage = acc.previousOffset + percentage;
  // ... create segment
  return { segments: [...acc.segments, segment], previousOffset: cumulativePercentage };
}, { segments: [], previousOffset: 0 });
```

**Syntax Pattern**: Array reduce with accumulator object for building cumulative data.

## Critical Code Patterns

### 1. Empty State Handling
```jsx
if (!data || Object.keys(data).length === 0) {
  return <div>No data available</div>;
}
```
**Pattern**: Early return pattern for null/empty data validation.

### 2. Object to Array Conversion
```jsx
const entries = Object.entries(data);
```
**Pattern**: Object.entries for iterating over key-value pairs.

### 3. Spread Operator with Math.max
```jsx
const maxValue = Math.max(...entries.map(([_, value]) => value));
```
**Pattern**: Spread syntax for finding maximum value in array.

### 4. Array Map with Destructuring
```jsx
entries.map(([key, value], index) => { /* ... */ })
```
**Pattern**: Parameter destructuring in map callback.

### 5. Dynamic Inline Styles
```jsx
style={{ width: `${(value / maxValue) * 100}%` }}
```
**Pattern**: Template literals for calculated style values.

### 6. Reduce for Accumulation
```jsx
entries.reduce((acc, [key, value]) => {
  // build cumulative data
  return { ...acc, newData };
}, initialAccumulator);
```
**Pattern**: Reduce method for building complex accumulated state.
**Example empty data**:
```jsx
<TicketChart data={null} />        // Empty state
<TicketChart data={{}} />          // Empty state
<TicketChart data={{ Open: 5 }} /> // Renders chart
```

### Lines 13-33: Color Mapping Function
```jsx
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
```

**Color Scheme**:
| Category | Key | Hex Color | Tailwind Equivalent | Visual |
|----------|-----|-----------|---------------------|--------|
| **Status** | Open | #3B82F6 | blue-600 | 🔵 |
| | In Progress | #EAB308 | yellow-600 | 🟡 |
| | In Review | #A855F7 | purple-500 | 🟣 |
| | Resolved | #10B981 | green-500 | 🟢 |
| | Closed | #6B7280 | gray-500 | ⚫ |
| **Priority** | Low | #10B981 | green-500 | 🟢 |
| | Medium | #EAB308 | yellow-600 | 🟡 |
| | High | #F97316 | orange-500 | 🟠 |
| | Critical | #EF4444 | red-500 | 🔴 |
| **Type** | Bug | #EF4444 | red-500 | 🔴 |
| | Feature | #8B5CF6 | purple-600 | 🟣 |
| | Improvement | #3B82F6 | blue-600 | 🔵 |
| | Task | #6B7280 | gray-500 | ⚫ |

**Fallback color**: `#6B7280` (gray) for unknown keys

### Lines 35-37: Data Processing
```jsx
  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([_, value]) => value));
```

**Object.entries() transformation**:
```javascript
// Input
data = { Open: 5, Closed: 3, In Progress: 8 }

// Output
entries = [
  ['Open', 5],
  ['Closed', 3],
  ['In Progress', 8]
]
```

**Max value calculation**:
```javascript
entries.map(([_, value]) => value) // [5, 3, 8]
Math.max(...[5, 3, 8])             // 8
```
- **Purpose**: Normalize bar widths (longest bar = 100%)

### Lines 39-60: Bar Chart Render
```jsx
  if (type === 'bar') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-4">
```
- **space-y-4**: 16px vertical gap between bars

```jsx
          {entries.map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{key}</span>
                <span className="text-sm font-bold text-gray-900">{value}</span>
              </div>
```
- **Label row**: Category name (left) + value (right)

**Visual**:
```
Open                          5
In Progress                   8
Closed                        3
```

```jsx
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%`,
                    backgroundColor: getColor(key)
                  }}
                />
              </div>
```

**Bar structure**:
- **Outer div**: Gray background (100% width, 3px height)
- **Inner div**: Colored bar (percentage width)

**Width calculation**:
```javascript
// Example: value=5, maxValue=8
width = (5 / 8) * 100 = 62.5%

// Example: value=8, maxValue=8
width = (8 / 8) * 100 = 100%

// Example: value=3, maxValue=8
width = (3 / 8) * 100 = 37.5%
```

**Inline styles** (dynamic):
- **width**: Calculated percentage
- **backgroundColor**: From getColor()

**CSS classes** (static):
- **transition-all duration-500**: Smooth animation (500ms)
- **rounded-full**: Rounded ends

**Example Bar Chart**:
```
Tickets by Status

Open                          5
█████████████████████████░░░░░░░ (62.5%)

In Progress                   8
████████████████████████████████ (100%)

Closed                        3
████████████░░░░░░░░░░░░░░░░░░░░ (37.5%)
```

### Lines 62-136: Donut Chart Render

#### Lines 63-64: Calculate Total
```jsx
  if (type === 'donut') {
    const total = entries.reduce((sum, [_, value]) => sum + value, 0);
```
- **reduce()**: Sum all values
- **Example**: `{ Open: 5, Closed: 3, In Progress: 8 }` → total = 16

#### Lines 66-88: Donut SVG
```jsx
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
```
- **viewBox="0 0 100 100"**: Coordinate system (0-100 for easier math)
- **transform -rotate-90**: Start at top (default starts at right)

```jsx
              {entries.reduce((acc, [key, value], index) => {
                const percentage = (value / total) * 100;
                const prevPercentage = entries.slice(0, index).reduce((sum, [_, v]) => sum + (v / total) * 100, 0);
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -prevPercentage;
```

**Donut Segment Calculation**:
| Segment | Value | Percentage | Prev % | strokeDasharray | strokeDashoffset |
|---------|-------|------------|--------|-----------------|------------------|
| Open | 5 | 31.25% | 0% | "31.25 68.75" | 0 |
| In Progress | 8 | 50% | 31.25% | "50 50" | -31.25 |
| Closed | 3 | 18.75% | 81.25% | "18.75 81.25" | -81.25 |

**SVG Circle Properties**:
```javascript
// Circle circumference (2πr where r=40)
circumference = 2 * Math.PI * 40 ≈ 251.33

// strokeDasharray controls visible/invisible parts
// "31.25 68.75" means:
//   - 31.25% visible (31.25 * 251.33 / 100 ≈ 78.67)
//   - 68.75% gap (rest of circumference)

// strokeDashoffset rotates where segment starts
// -31.25 rotates by 31.25% counterclockwise
```

```jsx
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
```
- **cx="50" cy="50"**: Center of 100x100 viewBox
- **r="40"**: Radius (leaves 10 units padding on each side)
- **strokeWidth="20"**: Thick stroke creates donut hole (40-20=20 inner radius)
- **fill="none"**: No fill, only stroke visible

**Visual Donut**:
```
        ████████      (Blue: In Progress 50%)
     ███        ███
   ███            ███  (Gray: Closed 18.75%)
  ███    16      ███
  ███    Total    ███
   ███            ███  (Green: Open 31.25%)
     ███        ███
        ████████
```

#### Lines 90-97: Center Label
```jsx
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
```
- **absolute inset-0**: Cover entire donut
- **flex items-center justify-center**: Center text
- **text-3xl**: Large total number

#### Lines 98-115: Legend
```jsx
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
```

**Legend structure**:
- **Color dot**: 12×12px circle with segment color
- **Category name**: Left-aligned
- **Value + percentage**: Right-aligned

**Visual Legend**:
```
🔵 Open           5 (31%)
🟡 In Progress    8 (50%)
⚫ Closed          3 (19%)
```

**Percentage rounding**:
```javascript
Math.round((5 / 16) * 100)  // 31% (rounds 31.25)
Math.round((8 / 16) * 100)  // 50% (exact)
Math.round((3 / 16) * 100)  // 19% (rounds 18.75)
```

## Related Files
- **Analytics.jsx**: Uses TicketChart for multiple visualizations
- **Dashboard.jsx**: May use for quick stats

## Usage Examples

### Bar Chart - Tickets by Status
```jsx
<TicketChart
  data={{
    'Open': 15,
    'In Progress': 12,
    'In Review': 5,
    'Resolved': 20,
    'Closed': 8
  }}
  type="bar"
  title="Tickets by Status"
/>
```

### Donut Chart - Tickets by Priority
```jsx
<TicketChart
  data={{
    'Low': 10,
    'Medium': 15,
    'High': 8,
    'Critical': 3
  }}
  type="donut"
  title="Tickets by Priority"
/>
```

### Bar Chart - Tickets by Type
```jsx
<TicketChart
  data={{
    'Bug': 25,
    'Feature': 18,
    'Improvement': 12,
    'Task': 20
  }}
  type="bar"
  title="Tickets by Type"
/>
```

## Chart Type Selection Guide

**Use Bar Chart when**:
- Comparing quantities
- Many categories (5+)
- Exact values important
- Linear comparison needed

**Use Donut Chart when**:
- Showing parts of a whole
- Few categories (2-5)
- Percentage distribution matters
- Circular visual more appealing

## Performance Notes

**Optimizations**:
- SVG rendering is efficient
- No external chart library (no bundle size)
- Simple calculations (no heavy math)

**Trade-offs**:
- **Pro**: Lightweight, customizable
- **Con**: Limited chart types

## Alternative Chart Libraries

**If more features needed**:

### Option 1: Recharts
```jsx
import { BarChart, Bar, PieChart, Pie } from 'recharts';

<BarChart data={data}>
  <Bar dataKey="value" fill="#3B82F6" />
</BarChart>
```
- **Pro**: Many chart types, responsive, tooltips
- **Con**: 100KB+ bundle size

### Option 2: Chart.js
```jsx
import { Bar, Doughnut } from 'react-chartjs-2';

<Bar data={data} options={options} />
```
- **Pro**: Popular, well-documented, animations
- **Con**: 200KB+ bundle size

### Option 3: Victory
```jsx
import { VictoryBar, VictoryPie } from 'victory';

<VictoryBar data={data} />
```
- **Pro**: React-first, accessible
- **Con**: 150KB+ bundle size

## Accessibility Enhancements

**Improvements**:
```jsx
<div 
  className="bg-white rounded-lg shadow-md p-6"
  role="img"
  aria-label={`${title}: ${entries.map(([key, value]) => `${key} ${value}`).join(', ')}`}
>
  <h3 className="text-lg font-bold text-gray-900 mb-4" id={`chart-title-${title}`}>
    {title}
  </h3>
  
  {/* Bar chart */}
  <div className="space-y-4" role="list">
    {entries.map(([key, value]) => (
      <div key={key} role="listitem">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{key}</span>
          <span className="text-sm font-bold text-gray-900" aria-label={`${key}: ${value}`}>
            {value}
          </span>
        </div>
        <div 
          className="w-full bg-gray-200 rounded-full h-3"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={maxValue}
          aria-label={`${key} progress bar`}
        >
          <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${...}%`, backgroundColor: getColor(key) }} />
        </div>
      </div>
    ))}
  </div>
  
  {/* Data table (screen reader fallback) */}
  <table className="sr-only">
    <caption>{title}</caption>
    <thead>
      <tr>
        <th>Category</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      {entries.map(([key, value]) => (
        <tr key={key}>
          <td>{key}</td>
          <td>{value}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

## Testing

**Unit tests**:
```jsx
import { render, screen } from '@testing-library/react';
import TicketChart from './TicketChart';

test('renders empty state when no data', () => {
  render(<TicketChart data={{}} title="Test Chart" />);
  expect(screen.getByText('No data available')).toBeInTheDocument();
});

test('renders bar chart correctly', () => {
  const data = { Open: 5, Closed: 3 };
  render(<TicketChart data={data} type="bar" title="Test Chart" />);
  expect(screen.getByText('Open')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(screen.getByText('Closed')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
});

test('renders donut chart with correct total', () => {
  const data = { Open: 5, Closed: 3 };
  render(<TicketChart data={data} type="donut" title="Test Chart" />);
  expect(screen.getByText('8')).toBeInTheDocument(); // Total
  expect(screen.getByText('5 (63%)')).toBeInTheDocument(); // Open
  expect(screen.getByText('3 (38%)')).toBeInTheDocument(); // Closed (rounded)
});
```
