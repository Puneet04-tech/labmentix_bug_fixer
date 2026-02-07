# frontend-component-ScreenshotUpload.md

## Overview
The `ScreenshotUpload.jsx` component provides drag-and-drop file upload interface for screenshots and documents.

## File Location
```
frontend/src/components/ScreenshotUpload.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
import React, { useState, useRef } from 'react';
import { Upload, X, Image, File, AlertCircle, CheckCircle } from 'lucide-react';
```

### Import Statement Breakdown:
- **React Hooks**: `useState, useRef` - State management and DOM references
- **Lucide Icons**: 6 individual icon components for upload UI and status indicators

## State Management Syntax

```jsx
const [files, setFiles] = useState([]);
const [dragActive, setDragActive] = useState(false);
const [errors, setErrors] = useState([]);
const [uploading, setUploading] = useState(false);
const fileInputRef = useRef(null);
```

**Syntax Pattern**: Multiple useState hooks with different initial values, useRef for DOM access.

## Drag and Drop Event Handlers

```jsx
const handleDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === 'dragenter' || e.type === 'dragover') {
    setDragActive(true);
  } else if (e.type === 'dragleave') {
    setDragActive(false);
  }
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFiles(Array.from(e.dataTransfer.files));
  }
};
```

**Syntax Pattern**: Event prevention, conditional logic based on event type, dataTransfer API usage.

## File Validation Logic

```jsx
const validateFile = (file) => {
  const errors = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push(`${file.name}: Invalid file type`);
  }

  if (file.size > maxSize) {
    errors.push(`${file.name}: File too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`);
  }

  return errors;
};
```

**Syntax Pattern**: Array push for error collection, mathematical calculations for size formatting.

## File Processing with Array Methods

```jsx
const handleFiles = (fileList) => {
  const validFiles = [];
  const newErrors = [];

  fileList.forEach(file => {
    const fileErrors = validateFile(file);
    if (fileErrors.length === 0) {
      validFiles.push({
        file,
        id: Date.now() + Math.random(),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      });
    } else {
      newErrors.push(...fileErrors);
    }
  });

  if (validFiles.length + files.length > maxFiles) {
    newErrors.push(`Cannot add ${validFiles.length} files. Would exceed maximum of ${maxFiles} files.`);
  } else {
    setFiles(prev => [...prev, ...validFiles]);
    onFilesChange?.([...files, ...validFiles]);
  }

  setErrors(newErrors);
};
```

**Syntax Pattern**: Array forEach, spread operator for array concatenation, optional chaining.

## Critical Code Patterns

### 1. DOM API Usage
```jsx
e.dataTransfer.files
fileInputRef.current?.click()
```
**Pattern**: Browser drag-and-drop and DOM manipulation APIs.

### 2. URL Object for Previews
```jsx
preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
```
**Pattern**: URL.createObjectURL for image previews.

### 3. Array Destructuring and Spread
```jsx
const [files, setFiles] = useState([]);
setFiles(prev => [...prev, ...validFiles]);
```
**Pattern**: Array spread for immutable state updates.

### 4. Template Literals for Dynamic Messages
```jsx
`Cannot add ${validFiles.length} files. Would exceed maximum of ${maxFiles} files.`
```
**Pattern**: Template literals for dynamic error messages.

### 5. Optional Chaining for Callbacks
```jsx
onFilesChange?.([...files, ...validFiles]);
```
**Pattern**: Safe function calls with optional chaining.

## State Management
```jsx
const [files, setFiles] = useState([]);
const [dragActive, setDragActive] = useState(false);
const [errors, setErrors] = useState([]);
const [uploading, setUploading] = useState(false);
const fileInputRef = useRef(null);
```

## Key Features

### Drag-and-Drop Interface
- **Visual Feedback**: Highlighted drop zone during drag operations
- **File Validation**: Real-time validation of file type and size
- **Multiple Upload**: Support for multiple file selection
- **Progress Indicators**: Loading states during upload process

### File Validation
- **Type Checking**: Restricts uploads to images and PDFs
- **Size Limits**: Configurable maximum file sizes
- **Quantity Limits**: Prevents exceeding maximum file count
- **Error Display**: Clear error messages for validation failures

### Upload Management
- **Automatic Upload**: Files uploaded immediately upon selection
- **Progress Tracking**: Visual feedback during upload process
- **Error Handling**: Graceful handling of upload failures
- **File Removal**: Easy removal of uploaded files

### File Display
- **File Icons**: Different icons for images vs documents
- **Size Formatting**: Human-readable file sizes
- **Upload Status**: Clear indication of upload completion
- **File Links**: Direct links to uploaded files

## Code Breakdown

### File Upload Logic
```jsx
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('screenshot', file);
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/screenshots/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      ...file,
      uploadedUrl: data.screenshotUrl,
      filename: data.filename
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

### File Validation
```jsx
const validateFile = (file) => {
  const newErrors = [];
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    newErrors.push(`${file.name}: Invalid file type. Only images and PDFs are allowed.`);
    return false;
  }
  
  // Check file size
  if (file.size > maxSize) {
    newErrors.push(`${file.name}: File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit.`);
    return false;
  }
  
  return true;
};
```

### Drag and Drop Handlers
```jsx
const handleDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === 'dragenter' || e.type === 'dragover') {
    setDragActive(true);
  } else if (e.type === 'dragleave') {
    setDragActive(false);
  }
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFiles(Array.from(e.dataTransfer.files));
  }
};
```

### File Processing
```jsx
const handleFiles = async (newFiles) => {
  const validFiles = [];
  const newErrors = [];
  
  // Check total file limit
  if (files.length + newFiles.length > maxFiles) {
    newErrors.push(`Maximum ${maxFiles} files allowed.`);
    setErrors(newErrors);
    return;
  }
  
  // Validate each file
  newFiles.forEach(file => {
    if (validateFile(file)) {
      validFiles.push(file);
    }
  });
  
  if (validFiles.length > 0) {
    setUploading(true);
    
    try {
      // Upload each file
      const uploadedFiles = await Promise.all(
        validFiles.map(file => uploadFile(file))
      );
      
      const updatedFiles = [...files, ...uploadedFiles];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    } catch (error) {
      newErrors.push('Failed to upload one or more files. Please try again.');
      setErrors(newErrors);
    } finally {
      setUploading(false);
    }
  }
};
```

## Flow Diagram

```mermaid
graph TD
    A[Component Mount] --> B[Initialize empty file state]
    B --> C[Render upload area]

    C --> D{Files dropped or selected?}
    D -->|Yes| E[handleFiles(newFiles)]
    E --> F[Validate file count]
    F --> G{Count OK?}
    G -->|No| H[Show count error]
    G -->|Yes| I[Validate each file]

    I --> J{File valid?}
    J -->|Yes| K[Add to validFiles]
    J -->|No| L[Add to errors]

    K --> M{Any valid files?}
    M -->|No| N[Show validation errors]
    M -->|Yes| O[Set uploading: true]
    O --> P[Upload each file]
    P --> Q{Upload success?}
    Q -->|Yes| R[Add uploaded file to state]
    Q -->|No| S[Add upload error]

    R --> T[Update files state]
    T --> U[Call onFilesChange]
    U --> V[Set uploading: false]
    V --> C

    S --> V
    N --> C
    H --> C
```

## API Integration

### Upload Endpoint
**Method**: POST
**URL**: `/api/screenshots/upload`
**Headers**:
```json
{
  "Authorization": "Bearer {token}"
}
```
**Body**: FormData with 'screenshot' field
**Response**:
```json
{
  "screenshotUrl": "https://example.com/uploads/screenshot-123.png",
  "filename": "screenshot-123.png"
}
```

## File Constraints

### Default Limits
- **Maximum Files**: 5 files per upload session
- **Maximum Size**: 5MB per file
- **Allowed Types**: JPEG, PNG, GIF, WebP images and PDF documents

### Validation Rules
- **Type Validation**: Strict MIME type checking
- **Size Validation**: Server and client-side size limits
- **Count Validation**: Prevents exceeding maximum file count
- **Duplicate Prevention**: No duplicate file handling (can be enhanced)

## Testing Examples

### Test Drag and Drop
```javascript
const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
const mockDataTransfer = { files: [mockFile] };

render(<ScreenshotUpload onFilesChange={jest.fn()} />);

// Simulate drop
const dropZone = screen.getByText(/Drop files here/).parentElement;
fireEvent.drop(dropZone, {
  dataTransfer: mockDataTransfer
});

// Verify file processing
await waitFor(() => {
  expect(screen.getByText('test.png')).toBeInTheDocument();
});
```

### Test File Validation
```javascript
// Test invalid file type
const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });

render(<ScreenshotUpload onFilesChange={jest.fn()} />);

const input = screen.getByTestId('file-input'); // Assuming test id
fireEvent.change(input, { target: { files: [invalidFile] } });

// Verify error message
expect(screen.getByText(/Invalid file type/)).toBeInTheDocument();
```

### Test File Removal
```javascript
const mockOnFilesChange = jest.fn();
render(<ScreenshotUpload onFilesChange={mockOnFilesChange} />);

// Assume file is already uploaded and displayed
const removeButton = screen.getByTitle('Remove file');
fireEvent.click(removeButton);

// Verify file removal
expect(mockOnFilesChange).toHaveBeenCalledWith([]);
```

### Test Upload Error
```javascript
// Mock failed upload
fetch.mockRejectedValueOnce(new Error('Upload failed'));

render(<ScreenshotUpload onFilesChange={jest.fn()} />);

// Trigger upload
// ... file selection code ...

// Verify error handling
await waitFor(() => {
  expect(screen.getByText('Failed to upload one or more files')).toBeInTheDocument();
});
```

## Performance Considerations
- **Concurrent Uploads**: Multiple files uploaded simultaneously
- **Memory Management**: Files not stored in component memory after upload
- **Efficient Re-renders**: Targeted state updates for specific operations
- **Lazy Validation**: Files validated only when selected

## Accessibility Features
- **Keyboard Navigation**: File input accessible via keyboard
- **Screen Reader Support**: Descriptive labels and status messages
- **Focus Management**: Clear focus indicators for interactive elements
- **Error Announcements**: Screen reader accessible error messages
- **Drag State Feedback**: Visual and potentially audio feedback for drag states

## Error Handling
- **Upload Failures**: Graceful handling with user feedback
- **Validation Errors**: Clear, specific error messages
- **Network Issues**: Retry mechanisms could be added
- **File System Errors**: Browser file API error handling

## Security Considerations
- **File Type Validation**: Server-side validation required
- **Size Limits**: Prevents resource exhaustion attacks
- **Authentication**: JWT token required for uploads
- **Content Scanning**: Consider virus scanning for uploaded files

## Browser Compatibility
- **Modern Browsers**: Full drag-and-drop support
- **Fallback Support**: Traditional file input for older browsers
- **Mobile Support**: Touch-friendly file selection
- **Progressive Enhancement**: Works without JavaScript drag-and-drop

## Related Files
- **EnhancedTicketForm**: Uses ScreenshotUpload for attachments
- **AttachmentManager**: Displays uploaded files
- **API Routes**: Backend screenshot upload endpoint

## Future Enhancements
- Image preview thumbnails
- Drag-and-drop reordering
- Batch upload progress
- File compression
- Cloud storage integration
- Advanced file type support
- Upload queue management
- Resume interrupted uploads