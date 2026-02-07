# backend-route-ai.md

## Overview
The `ai.js` file defines routes for AI-powered analytics and chat functionality.

## File Location
```
backend/routes/ai.js
```

## Dependencies - Detailed Import Analysis

```javascript
const express = require('express');
const aiController = require('../controllers/ai');
const { protect } = require('../middleware/auth');
```

### Import Statement Breakdown:
- **express**: Framework for creating router instance
- **aiController**: Controller functions for AI operations
- **protect**: Authentication middleware function

## AI Analytics Endpoints

```javascript
router.get('/analytics', protect, aiController.getAIAnalytics);
router.get('/insights', protect, aiController.getAIInsights);
```

**Syntax Pattern**: GET routes for AI-powered data analysis and insights.

## AI Chat Endpoint

```javascript
router.post('/chat', protect, aiController.chatWithAI);
```

**Syntax Pattern**: POST route for interactive AI chat functionality.

## Router Export

```javascript
module.exports = router;
```

**Syntax Pattern**: Exporting configured router for application mounting.

## Critical Code Patterns

### 1. Controller Import
```javascript
const aiController = require('../controllers/ai');
```
**Pattern**: Importing AI controller module.

### 2. Named Middleware Import
```javascript
const { protect } = require('../middleware/auth');
```
**Pattern**: Destructuring specific middleware function.

### 3. Protected GET Routes
```javascript
router.get('/analytics', protect, aiController.getAIAnalytics);
```
**Pattern**: Applying authentication middleware to read operations.

### 4. Protected POST Route
```javascript
router.post('/chat', protect, aiController.chatWithAI);
```
**Pattern**: Protecting write operations with authentication.

### 5. Controller Method Access
```javascript
aiController.getAIAnalytics
```
**Pattern**: Accessing controller methods on imported module.

### 6. Route Handler Chain
```javascript
router.get('/path', protect, controller.method);
```
**Pattern**: Middleware followed by controller method in route definition.

### 7. Router Instance Creation
```javascript
const router = express.Router();
```
**Pattern**: Creating Express router for modular routing.

### 8. Module Export Pattern
```javascript
module.exports = router;
```
**Pattern**: Exporting router for mounting in main application.