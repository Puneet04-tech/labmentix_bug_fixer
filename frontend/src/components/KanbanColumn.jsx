import { Link } from 'react-router-dom';

const KanbanColumn = ({ title, tickets, color, onDrop }) => {
  const handleDragStart = (e, ticket) => {
    e.dataTransfer.setData('ticketId', ticket._id);
    e.dataTransfer.setData('fromStatus', ticket.status);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-gray-100');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');
    const ticketId = e.dataTransfer.getData('ticketId');
    const fromStatus = e.dataTransfer.getData('fromStatus');
    
    if (fromStatus !== title) {
      onDrop(ticketId, title);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Bug': '🐛',
      'Feature': '✨',
      'Improvement': '🔧',
      'Task': '📋'
    };
    return icons[type] || '📋';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'border-l-gray-400',
      'Medium': 'border-l-blue-500',
      'High': 'border-l-orange-500',
      'Critical': 'border-l-red-500'
    };
    return colors[priority] || 'border-l-gray-400';
  };

  return (
    <div className="flex-1 min-w-[300px]">
      <div className="bg-white rounded-lg shadow-md">
        {/* Column Header */}
        <div className={`${color} text-white p-4 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">{title}</h3>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm font-medium">
              {tickets.length}
            </span>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          className="p-4 space-y-3 min-h-[500px] transition-colors"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {tickets.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p className="text-sm">No tickets</p>
              <p className="text-xs mt-1">Drag tickets here</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                draggable
                onDragStart={(e) => handleDragStart(e, ticket)}
                className={`bg-white border-l-4 ${getPriorityColor(ticket.priority)} rounded-lg shadow hover:shadow-lg cursor-move transition-all`}
              >
                <Link to={`/tickets/${ticket._id}`} className="block p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeIcon(ticket.type)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority).replace('border-l-', 'bg-')
                        .replace('400', '100 text-gray-700')
                        .replace('500', '100 text-blue-700')
                        .replace('orange-100 text-blue-700', 'orange-100 text-orange-700')
                        .replace('red-100 text-blue-700', 'red-100 text-red-700')}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {ticket.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {ticket.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate">{ticket.project?.name}</span>
                    {ticket.assignedTo && (
                      <span className="ml-2 flex-shrink-0 flex items-center space-x-1">
                        <span>👤</span>
                        <span className="truncate max-w-[100px]">{ticket.assignedTo.name}</span>
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
