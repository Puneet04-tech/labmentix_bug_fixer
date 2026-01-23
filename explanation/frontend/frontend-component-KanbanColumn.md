# KanbanColumn.jsx - Frontend Component Line-by-Line Explanation

## Overview
Drag-and-drop kanban column component that handles ticket dragging, drop zones, status-based visual styling, and priority border indicators.

## Key Features
- Drag-and-drop using HTML5 Drag and Drop API
- Status-specific styling (colors, counts)
- Priority-based left border colors
- Drop zone visual feedback (blue border on drag over)
- Prevents default browser drag behavior
- Ticket count badge in column header

## Line-by-Line Analysis

### Lines 1-8: Component Props
```jsx
const KanbanColumn = ({ status, tickets, onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);
```

**Props**:
| Prop | Type | Required | Purpose |
|------|------|----------|---------|
| status | string | Yes | Column status ('Open', 'In Progress', etc.) |
| tickets | array | Yes | Filtered tickets for this status |
| onDrop | function | Yes | Callback when ticket dropped (handles status update) |

**State**:
- **isDragOver**: Boolean to show drop zone indicator

### Lines 10-18: Status Configuration
```jsx
  const statusConfig = {
    'Open': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    'In Progress': { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
    'In Review': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    'Resolved': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    'Closed': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
  };

  const config = statusConfig[status] || statusConfig['Open'];
```

**Status Color Scheme**:
| Status | Background | Text | Border | Visual |
|--------|------------|------|--------|--------|
| Open | bg-blue-50 | text-blue-600 | border-blue-200 | 🔵 |
| In Progress | bg-yellow-50 | text-yellow-600 | border-yellow-200 | 🟡 |
| In Review | bg-purple-50 | text-purple-600 | border-purple-200 | 🟣 |
| Resolved | bg-green-50 | text-green-600 | border-green-200 | 🟢 |
| Closed | bg-gray-50 | text-gray-600 | border-gray-200 | ⚫ |

**Fallback**: If status doesn't match, use 'Open' config

### Lines 20-27: Priority Border Colors
```jsx
  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'border-l-green-500',
      'Medium': 'border-l-yellow-500',
      'High': 'border-l-orange-500',
      'Critical': 'border-l-red-500'
    };
    return colors[priority] || 'border-l-gray-300';
  };
```

**Priority Left Border**:
| Priority | Border Class | Color | Visual |
|----------|--------------|-------|--------|
| Low | border-l-green-500 | Green | 🟢│ |
| Medium | border-l-yellow-500 | Yellow | 🟡│ |
| High | border-l-orange-500 | Orange | 🟠│ |
| Critical | border-l-red-500 | Red | 🔴│ |
| Default | border-l-gray-300 | Gray | ⚪│ |

### Lines 29-35: Handle Drag Start
```jsx
  const handleDragStart = (e, ticket) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('ticketId', ticket._id);
    e.dataTransfer.setData('currentStatus', ticket.status);
  };
```

**dataTransfer API**:
- **effectAllowed**: 'move' (vs 'copy', 'link')
  - Visual cursor feedback
  - Browser shows move icon
- **setData('ticketId', ticket._id)**: Store ticket ID for drop handler
- **setData('currentStatus', ticket.status)**: Store current status (optional check)

**Example**:
```javascript
// User starts dragging ticket "Fix login bug" (ID: 507f...)
handleDragStart(e, {
  _id: '507f1f77bcf86cd799439011',
  title: 'Fix login bug',
  status: 'Open'
})

// dataTransfer now contains:
// ticketId: '507f1f77bcf86cd799439011'
// currentStatus: 'Open'
```

### Lines 37-41: Handle Drag Over (Allow Drop)
```jsx
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };
```

**Critical**: `e.preventDefault()` required to allow drop
- **Default behavior**: Browser disallows drop
- **preventDefault()**: Enable drop zone

**dropEffect**: 'move' (matches effectAllowed)

**setIsDragOver(true)**: Show visual drop indicator (blue border)

### Lines 43-46: Handle Drag Leave
```jsx
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
```
- **Reset visual**: Remove drop indicator when drag leaves column
- **Fires**: When cursor exits column boundary

### Lines 48-60: Handle Drop (CRITICAL)
```jsx
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const ticketId = e.dataTransfer.getData('ticketId');
    const currentStatus = e.dataTransfer.getData('currentStatus');
    
    if (currentStatus !== status) {
      onDrop(ticketId, status);
    }
  };
```

**Flow**:
1. **preventDefault()**: Stop default browser behavior
2. **setIsDragOver(false)**: Remove drop indicator
3. **getData('ticketId')**: Retrieve ticket ID from drag start
4. **getData('currentStatus')**: Retrieve old status
5. **Status check**: Only trigger update if status actually changed
   - Prevents unnecessary API calls if dropped in same column
6. **onDrop(ticketId, status)**: Call parent handler to update ticket

**Example**:
```javascript
// User drops "Fix login bug" from 'Open' to 'In Progress'
handleDrop(e)

// Extracted data:
ticketId = '507f1f77bcf86cd799439011'
currentStatus = 'Open'
status = 'In Progress'  // Column's status

// Status check:
'Open' !== 'In Progress' → true

// Trigger update:
onDrop('507f1f77bcf86cd799439011', 'In Progress')
```

### Lines 62-129: JSX Render

#### Lines 62-69: Column Container
```jsx
  return (
    <div
      className={`flex-1 min-w-[250px] ${config.bg} rounded-lg p-4 transition-all ${
        isDragOver ? 'ring-2 ring-blue-500' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
```

**Classes**:
- **flex-1**: Equal width columns
- **min-w-[250px]**: Minimum 250px width (prevents squishing)
- **config.bg**: Dynamic background color (blue-50, yellow-50, etc.)
- **transition-all**: Smooth ring appearance
- **Conditional ring**: `ring-2 ring-blue-500` when dragging over
  - Blue ring indicates drop zone

**Drag Events**:
- **onDragOver**: Allow drop + show indicator
- **onDragLeave**: Hide indicator
- **onDrop**: Handle ticket drop

#### Lines 70-78: Column Header
```jsx
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold text-lg ${config.text}`}>{status}</h3>
        <span className={`${config.bg} ${config.text} ${config.border} border-2 rounded-full px-3 py-1 text-sm font-semibold`}>
          {tickets.length}
        </span>
      </div>
```

**Header structure**:
- **Status title**: Left-aligned, colored text
- **Ticket count badge**: Right-aligned pill
  - Background, text, and border match status color
  - Shows number of tickets in column

**Visual**:
```
Open                    [5]
^^^^                    ^^^
(blue text)      (blue pill badge)
```

#### Lines 80-128: Ticket Cards
```jsx
      <div className="space-y-3">
        {tickets.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            No tickets
          </p>
        ) : (
```
- **Empty state**: "No tickets" message if column empty
- **space-y-3**: 12px vertical gap between cards

```jsx
          tickets.map(ticket => (
            <div
              key={ticket._id}
              draggable
              onDragStart={(e) => handleDragStart(e, ticket)}
              className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md cursor-move transition-all border-l-4 ${getPriorityColor(ticket.priority)}`}
            >
```

**Card attributes**:
- **draggable**: Makes card draggable (HTML5 API)
- **onDragStart**: Attach ticket data to drag
- **cursor-move**: Visual feedback (cursor changes to move icon)
- **border-l-4**: Thick left border
- **getPriorityColor()**: Dynamic left border color

**Visual Example (High Priority)**:
```
┌─────────────────────────┐
│█│ Fix login bug          │
│█│ Status: Open           │
│█│ Priority: High         │
│█│ Reporter: John Doe     │
└─────────────────────────┘
 ^
 Orange left border (High priority)
```

```jsx
              <h4 className="font-semibold text-gray-900 mb-2 truncate">
                {ticket.title}
              </h4>
```
- **truncate**: Truncate long titles with ellipsis

```jsx
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Priority:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                    ticket.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                    ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {ticket.priority}
                  </span>
                </p>
```

**Priority badge**:
| Priority | Classes | Visual |
|----------|---------|--------|
| Critical | bg-red-100 text-red-700 | 🔴 Critical |
| High | bg-orange-100 text-orange-700 | 🟠 High |
| Medium | bg-yellow-100 text-yellow-700 | 🟡 Medium |
| Low | bg-green-100 text-green-700 | 🟢 Low |

```jsx
                <p>
                  <span className="font-medium">Type:</span> {ticket.type}
                </p>
                
                <p>
                  <span className="font-medium">Reporter:</span> {ticket.reporter.name}
                </p>
                
                {ticket.assignedTo && (
                  <p>
                    <span className="font-medium">Assigned:</span> {ticket.assignedTo.name}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
```

**Additional fields**:
- **Type**: Bug, Feature, Improvement, Task
- **Reporter**: Ticket creator
- **Assigned**: Assignee (conditional, only if assigned)

## Related Files
- **Kanban.jsx**: Parent component that renders 5 KanbanColumn instances
- **backend/controllers/ticketController.js**: updateTicket endpoint for status change
- **TicketContext.jsx**: updateTicket function

## Drag and Drop Flow

```
User clicks and drags ticket card
         ↓
handleDragStart() fires
         ↓
Store ticketId and currentStatus in dataTransfer
         ↓
effectAllowed = 'move'
         ↓
User drags over different column
         ↓
handleDragOver() fires (continuously)
         ↓
preventDefault() → Allow drop
setIsDragOver(true) → Show blue ring
         ↓
User drags out of column
         ↓
handleDragLeave() fires
setIsDragOver(false) → Hide blue ring
         ↓
User drags back and releases
         ↓
handleDrop() fires
         ↓
preventDefault() → Stop default behavior
Get ticketId and currentStatus from dataTransfer
         ↓
Check if status changed (currentStatus !== status)
         ↓
If changed → onDrop(ticketId, newStatus)
         ↓
Parent (Kanban.jsx) updates ticket via API
         ↓
Ticket moves to new column
```

## Visual States

### Normal State
```
┌─────────────────────────┐
│ Open              [5]   │
├─────────────────────────┤
│ ┌───────────────────┐   │
│ │█ Ticket 1         │   │
│ └───────────────────┘   │
│ ┌───────────────────┐   │
│ │█ Ticket 2         │   │
│ └───────────────────┘   │
└─────────────────────────┘
```

### Drag Over State (Drop Zone)
```
┌═════════════════════════┐ ← Blue ring
║ In Progress       [3]   ║
╠═════════════════════════╣
║ ┌───────────────────┐   ║
║ │█ Ticket 3         │   ║
║ └───────────────────┘   ║
║                         ║
║  [Drop ticket here]     ║ ← Visual feedback
╚═════════════════════════╝
```

### Empty Column
```
┌─────────────────────────┐
│ Resolved          [0]   │
├─────────────────────────┤
│                         │
│    No tickets           │ ← Empty message
│                         │
└─────────────────────────┘
```

## Kanban Board Layout (5 Columns)

```jsx
// In Kanban.jsx
<div className="flex gap-4 overflow-x-auto">
  <KanbanColumn status="Open" tickets={openTickets} onDrop={handleDrop} />
  <KanbanColumn status="In Progress" tickets={inProgressTickets} onDrop={handleDrop} />
  <KanbanColumn status="In Review" tickets={inReviewTickets} onDrop={handleDrop} />
  <KanbanColumn status="Resolved" tickets={resolvedTickets} onDrop={handleDrop} />
  <KanbanColumn status="Closed" tickets={closedTickets} onDrop={handleDrop} />
</div>
```

**Layout**:
- **flex**: Horizontal columns
- **gap-4**: 16px spacing between columns
- **overflow-x-auto**: Horizontal scroll if columns don't fit

## Priority Border Examples

**Card visual with different priorities**:
```
┌─────────────────────────┐
│🟢│ Low Priority Ticket   │
│  │ Status: Open          │
└─────────────────────────┘

┌─────────────────────────┐
│🟡│ Medium Priority       │
│  │ Status: In Progress   │
└─────────────────────────┘

┌─────────────────────────┐
│🟠│ High Priority Bug     │
│  │ Status: In Review     │
└─────────────────────────┘

┌─────────────────────────┐
│🔴│ CRITICAL: Server Down │
│  │ Status: Open          │
└─────────────────────────┘
```

## dataTransfer API Explained

**HTML5 Drag and Drop API**:
```javascript
// On drag start
e.dataTransfer.effectAllowed = 'move'
e.dataTransfer.setData('key', 'value')

// On drag over
e.dataTransfer.dropEffect = 'move'

// On drop
const value = e.dataTransfer.getData('key')
```

**Data Transfer Object**:
| Property/Method | Purpose |
|----------------|---------|
| effectAllowed | Allowed drag operations ('move', 'copy', 'link') |
| dropEffect | Visual feedback for drop operation |
| setData(key, value) | Store data (key-value pairs) |
| getData(key) | Retrieve stored data |

**Why not state/props?**
- **Cross-component**: Drag starts in one component, drops in another
- **No shared state**: Columns don't share state
- **Browser API**: Built-in for drag-drop

## Performance Considerations

**Current**:
- Re-renders on every drag over (setIsDragOver(true) called repeatedly)
- Could optimize with debounce

**Optimization**:
```jsx
import { useCallback, useRef } from 'react';

const handleDragOver = useCallback((e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  // Only update state if not already true
  if (!isDragOver) {
    setIsDragOver(true);
  }
}, [isDragOver]);
```

## Accessibility Limitations

**Current**: Drag-drop is mouse/touch only

**Keyboard Alternative** (not implemented):
```jsx
// Add keyboard support
const handleKeyDown = (e, ticket) => {
  if (e.key === 'Enter' || e.key === ' ') {
    // Enter "move mode"
    setSelectedTicket(ticket);
  }
  
  if (selectedTicket && e.key === 'ArrowRight') {
    // Move to next status
    const statusOrder = ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed'];
    const currentIndex = statusOrder.indexOf(selectedTicket.status);
    const nextStatus = statusOrder[currentIndex + 1];
    if (nextStatus) {
      onDrop(selectedTicket._id, nextStatus);
    }
  }
};

<div
  tabIndex={0}
  onKeyDown={(e) => handleKeyDown(e, ticket)}
  role="button"
  aria-label={`Move ${ticket.title} to different status`}
>
  {/* Ticket card */}
</div>
```

## Testing

**Unit tests**:
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanColumn from './KanbanColumn';

const mockTickets = [
  { _id: '1', title: 'Ticket 1', priority: 'High', type: 'Bug', reporter: { name: 'John' }, status: 'Open' },
  { _id: '2', title: 'Ticket 2', priority: 'Low', type: 'Feature', reporter: { name: 'Jane' }, status: 'Open' }
];

test('renders column with tickets', () => {
  render(<KanbanColumn status="Open" tickets={mockTickets} onDrop={() => {}} />);
  expect(screen.getByText('Open')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument(); // Count
  expect(screen.getByText('Ticket 1')).toBeInTheDocument();
  expect(screen.getByText('Ticket 2')).toBeInTheDocument();
});

test('renders empty state when no tickets', () => {
  render(<KanbanColumn status="Open" tickets={[]} onDrop={() => {}} />);
  expect(screen.getByText('No tickets')).toBeInTheDocument();
});

test('shows drop zone indicator on drag over', () => {
  const { container } = render(<KanbanColumn status="Open" tickets={[]} onDrop={() => {}} />);
  const column = container.firstChild;
  
  fireEvent.dragOver(column);
  expect(column).toHaveClass('ring-2', 'ring-blue-500');
  
  fireEvent.dragLeave(column);
  expect(column).not.toHaveClass('ring-2');
});

test('calls onDrop when ticket dropped with new status', () => {
  const mockOnDrop = jest.fn();
  const { container } = render(<KanbanColumn status="In Progress" tickets={[]} onDrop={mockOnDrop} />);
  
  const dropEvent = {
    preventDefault: jest.fn(),
    dataTransfer: {
      getData: jest.fn((key) => key === 'ticketId' ? '123' : 'Open')
    }
  };
  
  fireEvent.drop(container.firstChild, dropEvent);
  
  expect(mockOnDrop).toHaveBeenCalledWith('123', 'In Progress');
});

test('does not call onDrop if status unchanged', () => {
  const mockOnDrop = jest.fn();
  const { container } = render(<KanbanColumn status="Open" tickets={[]} onDrop={mockOnDrop} />);
  
  const dropEvent = {
    preventDefault: jest.fn(),
    dataTransfer: {
      getData: jest.fn((key) => key === 'ticketId' ? '123' : 'Open')
    }
  };
  
  fireEvent.drop(container.firstChild, dropEvent);
  
  expect(mockOnDrop).not.toHaveBeenCalled();
});
```

## Browser Compatibility

**HTML5 Drag and Drop**:
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ⚠️ Mobile: Limited support (touch events different)

**Mobile Alternative**:
Use libraries like `react-beautiful-dnd` or `react-dnd` for better touch support
