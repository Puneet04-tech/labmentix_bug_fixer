import { useState, useEffect } from 'react';
import API from '../utils/api';

const ActivityTimeline = ({ ticketId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ticketId) {
      fetchActivities();
    }
  }, [ticketId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      // Fetch comments for this ticket
      const response = await API.get(`/comments/ticket/${ticketId}`);
      
      // Transform comments into activity format
      const commentActivities = response.data.map(comment => ({
        id: comment._id,
        type: 'comment',
        action: comment.isEdited ? 'edited a comment' : 'added a comment',
        user: comment.author,
        content: comment.content,
        timestamp: comment.isEdited ? comment.editedAt : comment.createdAt,
        icon: '💬'
      }));

      // Sort by timestamp (newest first)
      const sortedActivities = commentActivities.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );

      setActivities(sortedActivities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="bg-[#0f1724] rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-4">Activity</h3>
        <p className="text-slate-400">Loading activity...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1724] rounded-xl shadow-sm p-6 sm:p-8">
      <h3 className="text-xl font-bold text-slate-100 mb-4">
        Activity Timeline ({activities.length})
      </h3> 

      {activities.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No activity yet</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[#122433] rounded-full flex items-center justify-center text-lg text-slate-100">
                  {activity.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-slate-100">
                    <span className="font-semibold">{activity.user.name}</span>
                    {' '}
                    <span className="text-slate-400">{activity.action}</span>
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                
                {activity.content && activity.type === 'comment' && (
                  <div className="mt-2 bg-[#122433] rounded-lg p-3">
                    <p className="text-sm text-slate-300 line-clamp-3">
                      {activity.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
