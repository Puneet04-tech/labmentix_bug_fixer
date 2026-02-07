# frontend-component-Loader.md

## Overview
The `Loader.jsx` component provides a spinning loading indicator with size variations.

## File Location
```
frontend/src/components/Loader.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
// No external imports - pure React component
```

**Note**: This component uses only React and Tailwind CSS, no external libraries.

## Props Destructuring with Defaults

```jsx
const Loader = ({ size = 'medium', text = 'Loading...' }) => {
```

**Syntax Pattern**: Arrow function component with destructured props and default parameters.

## Object Literal for Size Mapping

```jsx
const sizeClasses = {
  small: 'h-5 w-5 border-2',
  medium: 'h-10 w-10 border-3',
  large: 'h-16 w-16 border-4',
};
```

**Syntax Pattern**: Object literal mapping size keys to Tailwind CSS classes.

## Template Literals for Dynamic Classes

```jsx
className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses[size]}`}
```

**Syntax Pattern**: Template literal combining animation classes with dynamic size classes.

## Conditional Rendering with Logical AND

```jsx
{text && (
  <p className="mt-4 text-gray-600 text-center">{text}</p>
)}
```

**Syntax Pattern**: Short-circuit evaluation for optional text rendering.

## Critical Code Patterns

### 1. Default Parameters in Destructuring
```jsx
const Loader = ({ size = 'medium', text = 'Loading...' }) => {
```
**Pattern**: Default value assignment directly in parameter destructuring.

### 2. Size Configuration Object
```jsx
const sizeClasses = {
  small: 'h-5 w-5 border-2',
  medium: 'h-10 w-10 border-3',
  large: 'h-16 w-16 border-4',
};
```
**Pattern**: Centralized size mapping for consistent component variations.

### 3. Dynamic Class Composition
```jsx
className={`animate-spin rounded-full border-blue-600 ${sizeClasses[size]}`}
```
**Pattern**: Template literals for combining animation and size-specific classes.

### 4. Conditional Text Rendering
```jsx
{text && <p className="mt-4 text-gray-600">{text}</p>}
```
**Pattern**: Logical AND operator for optional content rendering.

### 5. CSS Animation Classes
```jsx
className="animate-spin rounded-full border-t-transparent"
```
**Pattern**: Tailwind CSS animation classes for spinning effect.

```jsx
      <div
        className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
      ></div>
```

**Breakdown**:
1. **`${sizeClasses[size]}`**: Dynamic size classes
   - Example: `size='large'` → `'h-16 w-16 border-4'`
   
2. **border-blue-600**: Border color (blue 600 shade)
   - RGB: rgb(37, 99, 235)
   
3. **border-t-transparent**: Top border transparent
   - Creates the "spinning" effect
   - Only 3 sides visible (left, right, bottom)
   - Top transparent creates gap
   
4. **rounded-full**: 100% border radius (perfect circle)
   
5. **animate-spin**: Tailwind animation
   - Rotates 360° infinitely
   - Duration: 1 second per rotation
   - Linear timing (constant speed)

```jsx
      {text && <p className="mt-4 text-gray-600 text-sm">{text}</p>}
```
- **Conditional render**: Only show if `text` prop is truthy
- **mt-4**: Margin-top 16px (space between spinner and text)
- **text-gray-600**: Medium gray color
- **text-sm**: 14px font size

## Related Files
- **Dashboard.jsx**: Full-page loading while fetching stats
- **ProjectDetail.jsx**: Loading project data
- **TicketDetail.jsx**: Loading ticket details
- **Any async operation**: Shows during API calls

## Usage Examples

### Full-Page Loading (Dashboard)
```jsx
if (loading) {
  return <Loader size="large" text="Loading dashboard..." />;
}
```
**Renders**:
```
        ⟳  (large spinner, 64×64px)
  Loading dashboard...
```

### Modal Loading (EditTicketModal)
```jsx
{isSubmitting && (
  <Loader size="medium" text="Updating ticket..." />
)}
```
**Renders**:
```
      ⟳  (medium spinner, 40×40px)
 Updating ticket...
```

### Button Loading (No Text)
```jsx
<button disabled={loading}>
  {loading ? (
    <Loader size="small" text="" />
  ) : (
    'Submit'
  )}
</button>
```
**Renders**:
```
[⟳]  (small spinner inside button, no text)
```

### Custom Text
```jsx
<Loader size="medium" text="Please wait..." />
```

### No Text
```jsx
<Loader size="medium" text={null} />
// or
<Loader size="medium" text="" />
// or
<Loader size="medium" text={false} />
```

## Animation Deep Dive

**Tailwind's `animate-spin` equivalent CSS**:
```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

**Properties**:
- **1s**: Duration (1 second per full rotation)
- **linear**: Constant speed (no easing)
- **infinite**: Never stops

**Visual Effect**:
```
border-blue-600:         ┌─────┐
                         │  ⟳  │  (3 sides blue)
border-t-transparent:    └─────┘  (top transparent)
                            ↑
                        Rotating gap
```

## Color Scheme

**Current** (Blue):
```jsx
border-blue-600  // Primary app color
```

**Alternative colors** (if needed):
```jsx
// Success loading
border-green-600

// Warning loading
border-yellow-600

// Danger loading
border-red-600

// Neutral loading
border-gray-600
```

## Size Comparison Visual

### Technical Terms Glossary

- **Default props**: In `({ size = 'medium', text = 'Loading...' })`, `size` and `text` get default values when not provided.
- **Template literal**: Backtick string used to compose class names dynamically: `` `${sizeClasses[size]} ...` ``.
- **Tailwind utility classes**: Atomic CSS classes (e.g., `h-10`, `w-10`, `border-3`) composing the component's style.
- **`animate-spin`**: Tailwind utility that maps to a keyframes animation rotating the element indefinitely.
- **Accessibility**: Loader should include `aria-busy="true"` or similar when used in larger components (not shown but recommended).

---

### Important Import & Syntax Explanations

```jsx
const Loader = ({ size = 'medium', text = 'Loading...' }) => { ... }
```

- `({ size = 'medium', text = 'Loading...' })`: Function parameter destructuring with default values — concise way to define props and defaults.
- `const sizeClasses = { ... }`: Plain object mapping keys to Tailwind class strings; chosen at runtime via `sizeClasses[size]`.
- ``className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}``: Combines dynamic and static classes; dynamic part depends on `size` prop.
- `text && <p>...</p>`: Short-circuit conditional rendering — if `text` is falsy (`null`, `''`, `false`) the paragraph is omitted.


```
Small (20×20px):          ⟳
Used in: Buttons, inline elements

Medium (40×40px):        ⟳⟳
Used in: Modals, default loading

Large (64×64px):       ⟳⟳⟳
Used in: Full-page loading
```

## Accessibility Enhancements

**Current**: Basic visual spinner

**Improvements**:
```jsx
const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = { ... };

  return (
    <div 
      className="flex flex-col items-center justify-center p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
        aria-hidden="true"
      ></div>
      {text && (
        <p className="mt-4 text-gray-600 text-sm">
          {text}
        </p>
      )}
      {!text && (
        <span className="sr-only">Loading content, please wait</span>
      )}
    </div>
  );
};
```
- **role="status"**: ARIA landmark for status updates
- **aria-live="polite"**: Announce to screen readers when loading starts/stops
- **aria-busy="true"**: Indicates busy state
- **aria-hidden="true"**: Hide spinner from screen readers (decorative)
- **sr-only**: Screen reader only text when no visible text

## Alternative Loader Styles

### Option 1: Dots Loader
```jsx
const DotsLoader = () => (
  <div className="flex space-x-2">
    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-100" />
    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-200" />
  </div>
);
```
**Visual**: ● ● ● (bouncing dots)

### Option 2: Pulse Loader
```jsx
const PulseLoader = () => (
  <div className="w-12 h-12 bg-blue-600 rounded-full animate-pulse" />
);
```
**Visual**: ⬤ (pulsing circle)

### Option 3: Bar Loader
```jsx
const BarLoader = () => (
  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
    <div className="h-full bg-blue-600 animate-pulse" />
  </div>
);
```
**Visual**: ▬▬▬▬ (horizontal bar)

## Conditional Loading Pattern

**Common usage**:
```jsx
const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get('/data');
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader size="large" text="Loading data..." />;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  return <div>{/* Render data */}</div>;
};
```

## Performance Considerations

**CSS Animation** (Current):
- **Pro**: Hardware accelerated, smooth
- **Con**: None (very efficient)

**JavaScript Animation** (Avoid):
```jsx
// BAD - Don't do this
const [rotation, setRotation] = useState(0);
useEffect(() => {
  const interval = setInterval(() => {
    setRotation(r => (r + 6) % 360);
  }, 16);
  return () => clearInterval(interval);
}, []);
return <div style={{ transform: `rotate(${rotation}deg)` }} />;
```
- **Pro**: More control
- **Con**: JS overhead, not hardware accelerated, 60 FPS cap

## Integration with Suspense (React 18)

**Future enhancement**:
```jsx
import { Suspense } from 'react';

<Suspense fallback={<Loader size="large" text="Loading component..." />}>
  <LazyComponent />
</Suspense>
```
- **Suspense**: React 18 feature for lazy loading
- **fallback**: Shows Loader while component loads
- **Automatic**: No manual loading state

## Testing Considerations

**Storybook stories**:
```jsx
// loader.stories.jsx
export default {
  title: 'Components/Loader',
  component: Loader,
};

export const Small = () => <Loader size="small" />;
export const Medium = () => <Loader size="medium" />;
export const Large = () => <Loader size="large" />;
export const NoText = () => <Loader text="" />;
export const CustomText = () => <Loader text="Custom loading message..." />;
```

**Unit tests**:
```jsx
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

test('renders with default text', () => {
  render(<Loader />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('renders without text when text is null', () => {
  render(<Loader text={null} />);
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

test('renders custom text', () => {
  render(<Loader text="Custom text" />);
  expect(screen.getByText('Custom text')).toBeInTheDocument();
});
```

## Responsive Behavior

**Current**: Fixed sizes on all screens

**Potential improvement**:
```jsx
const sizeClasses = {
  small: 'h-4 w-4 sm:h-5 sm:w-5 border-2',
  medium: 'h-8 w-8 sm:h-10 sm:w-10 border-3',
  large: 'h-12 w-12 sm:h-16 sm:w-16 border-4',
};
```
- **Mobile**: Smaller spinners (space constrained)
- **Desktop**: Larger spinners (more visible)

## Design Token Integration

**If using CSS variables**:
```jsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          600: 'var(--color-primary)',
        },
      },
    },
  },
};

// Component
<div className="border-primary-600 ..." />
```
- **Benefit**: Single source of truth for colors
- **Easy theme switching**: Change CSS variable, all loaders update
