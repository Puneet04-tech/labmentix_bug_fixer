# frontend-component-StatsCard.md

## Overview
The `StatsCard.jsx` component displays statistical metrics with icons and trend indicators.

## File Location
```
frontend/src/components/StatsCard.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
// No external imports - pure React component
```

**Note**: This component uses only React and Tailwind CSS, no external libraries.

## Props Destructuring with Defaults

```jsx
const StatsCard = ({ title, value, icon, color = 'indigo', subtitle, trend }) => {
```

**Syntax Pattern**: Arrow function component with destructured props and default parameter.

## Object Literal for Color Mapping

```jsx
const colorClasses = {
  indigo: 'bg-indigo-50 text-indigo-600',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
  pink: 'bg-pink-50 text-pink-600',
  orange: 'bg-orange-50 text-orange-600'
};
```

**Syntax Pattern**: Object literal mapping color keys to Tailwind CSS classes.

## Template Literals for Dynamic Classes

```jsx
className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
```

**Syntax Pattern**: Template literal combining static classes with dynamic color classes.

## Conditional Rendering with Logical AND

```jsx
{subtitle && (
  <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
)}
```

**Syntax Pattern**: Short-circuit evaluation for optional content rendering.

## Nested Conditional Rendering

```jsx
{trend && (
  <div className={`flex items-center mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
    <span className="text-sm font-medium">{trend.value}</span>
  </div>
)}
```

**Syntax Pattern**: Nested conditional expressions within JSX for trend indicators.

## Critical Code Patterns

### 1. Default Parameter in Destructuring
```jsx
const StatsCard = ({ title, value, icon, color = 'indigo', subtitle, trend }) => {
```
**Pattern**: Default value assignment directly in parameter destructuring.

### 2. Color Tokenization Object
```jsx
const colorClasses = {
  indigo: 'bg-indigo-50 text-indigo-600',
  // ... other colors
};
```
**Pattern**: Centralized color mapping for consistent theming.

### 3. Dynamic Class Composition
```jsx
className={`base-classes ${colorClasses[color]}`}
```
**Pattern**: Template literals for combining static and dynamic CSS classes.

### 4. Conditional JSX Rendering
```jsx
{subtitle && <p>{subtitle}</p>}
```
**Pattern**: Logical AND operator for conditional element rendering.

### 5. Nested Conditional Classes
```jsx
className={`flex items-center ${trend.positive ? 'text-green-600' : 'text-red-600'}`}
```
**Pattern**: Ternary operator within template literals for conditional styling.

**colorClasses Object**:
- **Key**: Color name
- **Value**: Tailwind classes for icon container
- **Pattern**: `bg-{color}-50` (light background) + `text-{color}-600` (darker text)
- **Purpose**: Consistent color theming across app

**Color Mapping**:
| Color | Background | Text | Use Case |
|-------|------------|------|----------|
| indigo | bg-indigo-50 | text-indigo-600 | Default, general stats |
| blue | bg-blue-50 | text-blue-600 | Projects, collaboration |
| green | bg-green-50 | text-green-600 | Completed, success metrics |
| yellow | bg-yellow-50 | text-yellow-600 | In Progress, warnings |
| red | bg-red-50 | text-red-600 | Critical, high priority |
| purple | bg-purple-50 | text-purple-600 | Features, enhancements |
| pink | bg-pink-50 | text-pink-600 | Creative, design tasks |
| orange | bg-orange-50 | text-orange-600 | Medium priority, pending |

### Lines 12-42: JSX Render

#### Lines 12-14: Card Container
```jsx
return (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
```
- **shadow-md**: Medium shadow (Tailwind)
- **hover:shadow-lg**: Larger shadow on hover
- **transition-shadow**: Smooth shadow animation
- **flex items-start justify-between**: Title/value left, icon right

#### Lines 15-27: Left Side (Text Content)
```jsx
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
```
- **flex-1**: Takes remaining space (pushes icon to right)
- **title**: Small gray label
- **value**: Large bold number (3xl = 30px)

```jsx
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
```
- **Conditional render**: Only show if subtitle prop provided
- **Example**: "Last 30 days", "This week"

```jsx
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="mr-1">{trend.positive ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
          </div>
        )}
```
- **Conditional render**: Only show if trend prop provided
- **Color logic**: Green for positive, red for negative
- **Arrow**: ↑ (U+2191) or ↓ (U+2193) Unicode characters
- **trend.value**: Percentage or delta (e.g., "+12%", "-5")

**Trend Examples**:
```jsx
// Positive trend
<StatsCard trend={{ positive: true, value: '+15%' }} />
// Renders: ↑ +15% (green)

// Negative trend
<StatsCard trend={{ positive: false, value: '-8' }} />
// Renders: ↓ -8 (red)
```

#### Lines 28-31: Right Side (Icon)
```jsx
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
        <span className="text-2xl">{icon}</span>
      </div>
```
- **flex-shrink-0**: Icon doesn't shrink if space limited
- **w-12 h-12**: Fixed 48×48px square
- **rounded-lg**: Rounded corners
- **colorClasses[color]**: Dynamic Tailwind classes based on color prop
  - Example: `color='green'` → `'bg-green-50 text-green-600'`
- **text-2xl**: Large icon (24px)

## Related Files
- **Dashboard.jsx**: Uses multiple StatsCard for ticket/project stats
- **Analytics.jsx**: Uses StatsCard for metrics visualization
- **ProjectDetail.jsx**: Uses for project-specific stats

## Usage Examples

### Dashboard - Total Tickets
```jsx
<StatsCard
  title="Total Tickets"
  value={tickets.length}
  icon="🎫"
  color="indigo"
/>
```
**Renders**:
```
┌─────────────────────────────┐
│ Total Tickets         [🎫] │
│ 42                     🟣  │
└─────────────────────────────┘
```

### Dashboard - Resolved Tickets with Trend
```jsx
<StatsCard
  title="Resolved"
  value={resolvedCount}
  icon="✅"
  color="green"
  subtitle="This month"
  trend={{ positive: true, value: '+12%' }}
/>
```
**Renders**:
```
┌─────────────────────────────┐
│ Resolved              [✅] │
│ 28                     🟢  │
│ This month                  │
│ ↑ +12%         (green)      │
└─────────────────────────────┘
```

### Analytics - Critical Issues
```jsx
<StatsCard
  title="Critical Issues"
  value={criticalCount}
  icon="🚨"
  color="red"
  trend={{ positive: false, value: '-3' }}
/>
```
**Renders**:
```
┌─────────────────────────────┐
│ Critical Issues       [🚨] │
│ 5                      🔴  │
│ ↓ -3           (red)        │
└─────────────────────────────┘
```

## Prop Validation (Optional TypeScript)

**If using TypeScript**:
```typescript
interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: 'indigo' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'orange';
  subtitle?: string;
  trend?: {
    positive: boolean;
    value: string;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ ... }) => { ... }
```

## Color Scheme Selection Guide

**Recommended color usage**:
```jsx
// Statuses
<StatsCard color="green" />  // Resolved, Closed, Completed
<StatsCard color="blue" />   // In Progress, Ongoing
<StatsCard color="yellow" /> // In Review, Pending
<StatsCard color="red" />    // Open, Critical

// Priorities
<StatsCard color="red" />    // Critical
<StatsCard color="orange" /> // High
<StatsCard color="yellow" /> // Medium
<StatsCard color="green" />  // Low

// Types
<StatsCard color="red" />    // Bug
<StatsCard color="purple" /> // Feature
<StatsCard color="blue" />   // Improvement
```

## Hover Effect Breakdown

**CSS Transition**:
```css
/* Initial state */
shadow-md → box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)

/* Hover state */
hover:shadow-lg → box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)

/* Animation */
transition-shadow → transition: box-shadow 150ms ease-in-out
```

**Result**: Smooth shadow expansion on hover (feels interactive)

## Responsive Behavior

**Current**: No explicit responsive classes (works on all screens)

**Potential improvement**:
```jsx
<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
```
- **p-4**: Padding 16px on mobile
- **sm:p-6**: Padding 24px on desktop (≥640px)

## Alternative Icon Approaches

**Current** (Emoji):
```jsx
<StatsCard icon="🎫" />
```
- **Pro**: No dependencies, colorful
- **Con**: Inconsistent across platforms

**Option 1** (React Icons):
```jsx
import { FaTicketAlt } from 'react-icons/fa';
<StatsCard icon={<FaTicketAlt />} />
```
- **Pro**: Consistent, scalable, customizable color
- **Con**: Requires `react-icons` package

**Option 2** (Heroicons):
```jsx
import { TicketIcon } from '@heroicons/react/24/solid';
<StatsCard icon={<TicketIcon className="w-6 h-6" />} />
```
- **Pro**: Matches Tailwind design system
- **Con**: Requires `@heroicons/react` package

## Layout Pattern

**Dashboard Grid**:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatsCard title="Total" value={42} icon="🎫" />
  <StatsCard title="Open" value={15} icon="📋" color="yellow" />
  <StatsCard title="In Progress" value={12} icon="⚙️" color="blue" />
  <StatsCard title="Resolved" value={15} icon="✅" color="green" />
</div>
```
- **Mobile**: 1 column
- **Tablet**: 2 columns (≥640px)
- **Desktop**: 4 columns (≥1024px)

## Performance Notes

**Memoization** (optional optimization):
```jsx
import React, { memo } from 'react';

const StatsCard = memo(({ title, value, icon, color, subtitle, trend }) => {
  // ... component code
});
```
- **When to use**: If stats update frequently but cards don't change
- **Benefit**: Skip re-render if props haven't changed

## Accessibility Enhancements

**Current**: Basic semantic HTML

**Improvements**:
```jsx
<div 
  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
  role="article"
  aria-label={`${title}: ${value}`}
>
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-600 mb-1" id={`stat-label-${title}`}>
        {title}
      </p>
      <p 
        className="text-3xl font-bold text-gray-900" 
        aria-labelledby={`stat-label-${title}`}
      >
        {value}
      </p>
      {trend && (
        <div 
          className={...}
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">
            {trend.positive ? 'Increased' : 'Decreased'} by
          </span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
    <div 
      className={...}
      aria-hidden="true"
    >
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
</div>
```
- **role="article"**: Semantic card meaning
- **aria-label**: Screen reader summary
- **aria-live="polite"**: Announce trend changes
- **sr-only**: Screen reader only text for trend direction
- **aria-hidden="true"**: Hide decorative icon from screen readers

## Design System Integration

**If building a component library**:
```jsx
// stats-card.stories.jsx (Storybook)
export default {
  title: 'Components/StatsCard',
  component: StatsCard,
};

export const Default = () => (
  <StatsCard title="Total" value={42} icon="🎫" />
);

export const WithTrend = () => (
  <StatsCard 
    title="Revenue" 
    value="$24,500" 
    icon="💰" 
    color="green"
    subtitle="This month"
    trend={{ positive: true, value: '+15%' }}
  />
);

export const AllColors = () => (
  <div className="grid grid-cols-4 gap-4">
    {['indigo', 'blue', 'green', 'yellow', 'red', 'purple', 'pink', 'orange'].map(color => (
      <StatsCard 
        key={color}
        title={color}
        value={42}
        icon="🎨"
        color={color}
      />
    ))}
  </div>
);
```
