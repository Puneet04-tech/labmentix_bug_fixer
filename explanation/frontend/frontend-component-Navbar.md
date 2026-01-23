# Navbar.jsx - Frontend Component Line-by-Line Explanation

## Overview
Top navigation bar with hamburger menu, search input, notifications, user profile avatar with color hash, and logout button.

## Key Features
- Hamburger menu for mobile sidebar toggle
- Search input (desktop only)
- Notification bell with badge
- User avatar with initials and color hash
- User name and email display
- Logout button
- Sticky positioning (stays at top when scrolling)

## Line-by-Line Analysis

### Lines 1-3: Imports
```jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
```

### Lines 5-6: Component Props
```jsx
const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
```
- **toggleSidebar**: Function from Layout to open/close mobile sidebar
- **user**: Current user object from AuthContext
- **logout**: Function to log out user

### Lines 8-14: Get Initials Helper
```jsx
const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
```
- **Split by space**: "John Doe" → ['John', 'Doe']
- **Map to first letter**: ['John', 'Doe'] → ['J', 'D']
- **Join**: ['J', 'D'] → 'JD'
- **Uppercase**: 'jd' → 'JD'
- **Take first 2**: 'JD' (prevents long initials for 3+ names)
- **Examples**:
  - "John Doe" → "JD"
  - "Alice" → "A"
  - "Mary Jane Watson" → "MJ" (only first 2)

### Lines 16-26: Avatar Color Hash (CRITICAL)
```jsx
const getAvatarColor = (name) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-indigo-500'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
```
- **6 color options**: Blue, green, purple, pink, yellow, indigo
- **name.charCodeAt(0)**: Get ASCII code of first character
  - 'A' → 65, 'B' → 66, 'J' → 74, etc.
- **% colors.length**: Modulo operator to get index 0-5
  - 65 % 6 = 5 (indigo)
  - 74 % 6 = 2 (purple)
- **Consistent color**: Same name always gets same color
- **Deterministic**: Not random, based on name
- **Examples**:
  - "Alice" → A = 65, 65 % 6 = 5 → indigo
  - "Bob" → B = 66, 66 % 6 = 0 → blue
  - "John" → J = 74, 74 % 6 = 2 → purple

### Lines 28-106: JSX Template

### Lines 36-46: Hamburger Menu (Mobile Only)
```jsx
<button
  onClick={toggleSidebar}
  className="lg:hidden text-gray-600 hover:text-primary-600 focus:outline-none"
>
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>
```
- **lg:hidden**: Only show on screens < 1024px (mobile/tablet)
- **onClick={toggleSidebar}**: Opens sidebar when clicked
- **SVG**: Three horizontal lines (hamburger icon)

### Lines 48-64: Search Bar (Desktop Only)
```jsx
<div className="hidden md:block ml-4">
  <div className="relative">
    <input
      type="text"
      placeholder="Search tickets, projects..."
      className="w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
    />
    <svg
      className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
</div>
```
- **hidden md:block**: Hidden on mobile, visible on screens ≥ 768px
- **w-80**: Width 20rem (320px)
- **pl-10**: Padding-left for search icon
- **absolute left-3 top-2.5**: Position icon inside input (left side)
- **Note**: Search is non-functional (placeholder for future feature)

### Lines 68-78: Notification Bell
```jsx
<button className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition">
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
  {/* Notification Badge */}
  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
</button>
```
- **Bell icon**: SVG notification bell
- **Red badge**: Small red dot indicates unread notifications
- **absolute top-1 right-1**: Position badge at top-right of bell
- **w-2 h-2**: 8px × 8px dot

### Lines 80-92: User Profile Section
```jsx
<div className="flex items-center space-x-3">
  <div className="hidden sm:block text-right">
    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
    <p className="text-xs text-gray-500">{user?.email}</p>
  </div>
  <div className={`w-10 h-10 rounded-full ${getAvatarColor(user?.name || 'User')} text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-80 transition`}>
    {getInitials(user?.name || 'User')}
  </div>
</div>
```
- **Name and email**: Hidden on very small screens (< 640px), shown on ≥ 640px
- **Avatar circle**:
  - `w-10 h-10 rounded-full`: 40px × 40px circle
  - `${getAvatarColor(user?.name || 'User')}`: Dynamic background color
  - **Fallback**: 'User' if user?.name is undefined
  - `text-white`: White text for initials
  - `font-bold text-sm`: Bold, small font size
  - `cursor-pointer hover:opacity-80`: Hover effect (for future dropdown)

### Lines 94-104: Logout Button
```jsx
<button
  onClick={logout}
  className="hidden sm:flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
  <span className="font-medium">Logout</span>
</button>
```
- **hidden sm:flex**: Hidden on very small screens, shown on ≥ 640px
- **onClick={logout}**: Call logout function from AuthContext
- **Red color**: `text-red-600` for danger action
- **Hover effect**: `hover:bg-red-50` light red background
- **SVG icon**: Logout/exit icon

## Related Files
- **Layout.jsx**: Provides toggleSidebar prop
- **AuthContext.jsx**: Provides user and logout
- **Sidebar.jsx**: Toggled by hamburger menu

## Avatar Color Hash Algorithm

| Name | First Char | charCodeAt(0) | % 6 | Color |
|------|------------|---------------|-----|-------|
| Alice | A | 65 | 5 | indigo |
| Bob | B | 66 | 0 | blue |
| Charlie | C | 67 | 1 | green |
| David | D | 68 | 2 | purple |
| Eve | E | 69 | 3 | pink |
| Frank | F | 70 | 4 | yellow |
| Grace | G | 71 | 5 | indigo |
| Henry | H | 72 | 0 | blue (wraps around) |

## Responsive Behavior

| Screen Size | Hamburger | Search | User Info | Logout |
|-------------|-----------|--------|-----------|--------|
| < 640px (sm) | ✅ Show | ❌ Hide | ❌ Hide | ❌ Hide |
| 640px-768px | ✅ Show | ❌ Hide | ✅ Show | ✅ Show |
| 768px-1024px | ✅ Show | ✅ Show | ✅ Show | ✅ Show |
| ≥ 1024px (lg) | ❌ Hide | ✅ Show | ✅ Show | ✅ Show |

## Sticky Navbar
```jsx
className="bg-white border-b border-gray-200 sticky top-0 z-10"
```
- **sticky top-0**: Stays at top when scrolling
- **z-10**: Above content, below modals
- **border-b**: Bottom border for separation

## Avatar vs Gravatar
This implementation uses **local avatar generation** with initials and color hash:
- **Pros**: No external API, consistent colors, works offline
- **Cons**: Not customizable by user
- **Alternative**: Could use Gravatar API with user email as fallback
