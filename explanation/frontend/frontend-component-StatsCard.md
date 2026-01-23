# StatsCard.jsx - Frontend Component Line-by-Line Explanation

## Overview
Reusable statistics card component with color-coded icons, trend indicators, and hover effects for displaying metrics across the dashboard.

## Key Features
- 8 predefined color schemes (indigo, blue, green, yellow, red, purple, pink, orange)
- Icon display with background color matching
- Optional subtitle for additional context
- Trend indicator with positive/negative arrows
- Hover shadow effect for interactivity

## Line-by-Line Analysis

### Lines 1-6: Component Props & Color Config
```jsx
const StatsCard = ({ title, value, icon, color = 'indigo', subtitle, trend }) => {
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

**Props**:
- **title**: Stat label (e.g., "Total Tickets", "Open Issues")
- **value**: Main metric (number or string, e.g., "42", "$1,234")
- **icon**: Emoji or icon string (e.g., "🎫", "📊")
- **color**: Color scheme key (default: 'indigo')
- **subtitle**: Optional secondary text (e.g., "Last 30 days")
- **trend**: Optional trend object `{ positive: boolean, value: string }`

### Technical Terms Glossary
- **Stat card**: Compact UI element presenting a single metric with contextual metadata (subtitle, trend, icon).
- **Trend indicator**: Visual cue showing change over time; uses `trend.positive` to select color and arrow direction.
- **Color tokenization**: `colorClasses` maps a semantic color key to Tailwind classes to keep styling consistent across cards.
- **Responsive spacing**: Card sizes rely on typography scale (`text-3xl`) and padding (`p-6`) to maintain visual hierarchy.

### Important Import & Syntax Explanations
- `const StatsCard = ({ title, value, icon, color = 'indigo', subtitle, trend }) => { ... }`: Default param `color='indigo'` provides a sensible fallback.
- `const colorClasses = { ... }`: Centralized mapping avoids scattering Tailwind class strings across markup and enables easy theming.
- `{subtitle && (<p>...</p>)}` and `{trend && (<div>...</div>)}`: Conditional rendering short-circuits to avoid rendering optional UI when props absent.
- `className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}`: Template literal composes dynamic classes; ensure `color` is a valid key to prevent undefined class names.
- Accessibility note: Provide `aria-label` on icon container if the icon conveys semantic meaning beyond decoration.

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
