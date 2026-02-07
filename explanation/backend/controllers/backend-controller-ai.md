# backend-controller-ai.md

## Overview
The `ai.js` file handles AI-powered analytics and chat assistant functionality.

## File Location
```
backend/controllers/ai.js
```

## Dependencies - Detailed Import Analysis

```javascript
const express = require('express');
const AIAnalyticsEngine = require('../services/aiAnalyticsEngine');
```

### Import Statement Breakdown:
- **express**: Framework for HTTP response handling
- **AIAnalyticsEngine**: Custom AI service for data processing and analytics

## AI Engine Initialization

```javascript
const aiEngine = new AIAnalyticsEngine();
```

**Syntax Pattern**: Creating singleton instance for consistent AI operations.

## Query Parameter Destructuring with Defaults

```javascript
const { projectId, timeframe = '30d' } = req.query;
```

**Syntax Pattern**: Destructuring query parameters with default values.

## AI Service Method Call with Options

```javascript
const analytics = await aiEngine.generateAnalytics({
  projectId,
  timeframe,
  userId: req.user._id
});
```

**Syntax Pattern**: Calling AI service methods with configuration objects.

## Success Response Format

```javascript
res.json({
  success: true,
  data: analytics
});
```

**Syntax Pattern**: Standardized JSON response with success flag and data.

## Input Validation with Trim

```javascript
if (!message || message.trim().length === 0) {
  return res.status(400).json({
    success: false,
    message: 'Message is required'
  });
}
```

**Syntax Pattern**: Validating and trimming user input before processing.

## Context Object Construction

```javascript
context: {
  userRole: req.user.role,
  ...context
}
```

**Syntax Pattern**: Merging user context with additional provided context.

## Response Destructuring with Fallback

```javascript
response: response.message,
suggestions: response.suggestions || []
```

**Syntax Pattern**: Extracting response data with default empty array.

## Critical Code Patterns

### 1. AI Engine Initialization
```javascript
const aiEngine = new AIAnalyticsEngine();
```
**Pattern**: Creating singleton AI service instance.

### 2. Query Parameter Handling
```javascript
const { param1, param2 = 'default' } = req.query;
```
**Pattern**: Destructuring query parameters with defaults.

### 3. AI Service Method Calls
```javascript
await aiEngine.methodName({
  param1: value1,
  param2: value2,
  userId: req.user._id
})
```
**Pattern**: Calling AI methods with user context.

### 4. Standardized Response Format
```javascript
res.json({
  success: true,
  data: result
})
```
**Pattern**: Consistent API response structure.

### 5. Input Validation and Sanitization
```javascript
if (!input || input.trim().length === 0) {
  return res.status(400).json({ success: false, message: 'Error' });
}
```
**Pattern**: Validating and trimming user inputs.

### 6. Context Object Merging
```javascript
context: {
  userRole: req.user.role,
  ...additionalContext
}
```
**Pattern**: Combining user context with request context.

### 7. Safe Property Access
```javascript
property: obj.property || defaultValue
```
**Pattern**: Providing fallbacks for optional properties.

### 8. Comprehensive Error Handling
```javascript
catch (error) {
  console.error('Service Error:', error);
  res.status(500).json({
    success: false,
    message: 'Service temporarily unavailable'
  });
}
```
**Pattern**: Logging errors and returning user-friendly messages.