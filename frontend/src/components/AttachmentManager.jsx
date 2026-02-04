import React, { useState } from 'react';
import { Download, Eye, Trash2, File, Image, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const AttachmentManager = ({ 
  attachments = [], 
  onDownload, 
  onDelete, 
  onView,
  canDelete = false,
  canDownload = true,
  className = ''
}) => {
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    if (file.type?.startsWith('image/')) {
      return <Image className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  const getFileTypeColor = (type) => {
    if (type?.startsWith('image/')) return 'text-green-600 dark:text-green-400';
    if (type?.includes('pdf')) return 'text-red-600 dark:text-red-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'uploading':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const handleDownload = async (attachment) => {
    if (loading[attachment.id]) return;
    
    try {
      setLoading(prev => ({ ...prev, [attachment.id]: true }));
      setErrors(prev => ({ ...prev, [attachment.id]: null }));
      
      await onDownload?.(attachment);
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [attachment.id]: error.message || 'Download failed' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [attachment.id]: false }));
    }
  };

  const handleDelete = async (attachment) => {
    if (loading[attachment.id]) return;
    
    if (!window.confirm(`Are you sure you want to delete "${attachment.name}"?`)) {
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, [attachment.id]: true }));
      setErrors(prev => ({ ...prev, [attachment.id]: null }));
      
      await onDelete?.(attachment);
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [attachment.id]: error.message || 'Delete failed' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [attachment.id]: false }));
    }
  };

  const handleView = (attachment) => {
    if (attachment.type?.startsWith('image/')) {
      onView?.(attachment);
    } else {
      // For non-image files, download them
      handleDownload(attachment);
    }
  };

  if (attachments.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        <File className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No attachments</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Attachments ({attachments.length})
        </h4>
      </div>
      
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`flex-shrink-0 ${getFileTypeColor(attachment.type)}`}>
                {getFileIcon(attachment)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {attachment.name}
                  </p>
                  {getStatusIcon(attachment.status)}
                </div>
                
                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatFileSize(attachment.size || 0)}</span>
                  {attachment.uploadedAt && (
                    <span>• {new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                  )}
                  {attachment.uploadedBy && (
                    <span>• by {attachment.uploadedBy}</span>
                  )}
                </div>
                
                {errors[attachment.id] && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors[attachment.id]}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1 flex-shrink-0">
              {canDownload && (
                <button
                  type="button"
                  onClick={() => handleDownload(attachment)}
                  disabled={loading[attachment.id]}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              
              {attachment.type?.startsWith('image/') && onView && (
                <button
                  type="button"
                  onClick={() => handleView(attachment)}
                  disabled={loading[attachment.id]}
                  className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              
              {canDelete && (
                <button
                  type="button"
                  onClick={() => handleDelete(attachment)}
                  disabled={loading[attachment.id]}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentManager;
