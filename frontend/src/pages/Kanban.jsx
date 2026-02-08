import { useState, useEffect } from 'react';
import { useTicket } from '../context/TicketContext';
import { useProject } from '../context/ProjectContext';
import { toast } from 'react-toastify';
import KanbanColumn from '../components/KanbanColumn';

const Kanban = () => {
  const { tickets, fetchTickets, updateTicket } = useTicket();
  const { projects } = useProject();
  const [selectedProject, setSelectedProject] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    fetchTickets();
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    setLoading(true);
    try {
      const result = await updateTicket(ticketId, { status: newStatus });
      if (result.success) {
        toast.success(`Ticket moved to ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update ticket status');
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets by selected project
  const filteredTickets = selectedProject === 'all' 
    ? tickets 
    : tickets.filter(t => t.project?._id === selectedProject);

  // Group tickets by status
  const columns = [
    { 
      title: 'Open', 
      tickets: filteredTickets.filter(t => t.status === 'Open'),
      color: 'bg-blue-500'
    },
    { 
      title: 'In Progress', 
      tickets: filteredTickets.filter(t => t.status === 'In Progress'),
      color: 'bg-yellow-500'
    },
    { 
      title: 'In Review', 
      tickets: filteredTickets.filter(t => t.status === 'In Review'),
      color: 'bg-purple-500'
    },
    { 
      title: 'Resolved', 
      tickets: filteredTickets.filter(t => t.status === 'Resolved'),
      color: 'bg-green-500'
    },
    { 
      title: 'Closed', 
      tickets: filteredTickets.filter(t => t.status === 'Closed'),
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b1220] relative overflow-hidden">
      {/* Mossy Foggy Background */}
      <div className="fixed inset-0">
        {/* Primary Mossy Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900"></div>

        {/* Secondary Foggy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-600/40 via-emerald-500/30 to-teal-400/40"></div>

        {/* Accent Moss Layer */}
        <div className="absolute inset-0 bg-gradient-to-bl from-lime-500/25 via-green-500/20 to-emerald-500/25"></div>

        {/* Foggy Mesh Gradient */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: `
              radial-gradient(circle at 15% 25%, rgba(16, 185, 129, 0.25) 0%, transparent 45%),
              radial-gradient(circle at 85% 15%, rgba(34, 197, 94, 0.20) 0%, transparent 40%),
              radial-gradient(circle at 35% 75%, rgba(132, 204, 22, 0.30) 0%, transparent 50%),
              radial-gradient(circle at 75% 65%, rgba(20, 184, 166, 0.18) 0%, transparent 35%),
              radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.15) 0%, transparent 55%),
              radial-gradient(circle at 20% 85%, rgba(2, 132, 199, 0.22) 0%, transparent 45%),
              radial-gradient(circle at 90% 35%, rgba(45, 212, 191, 0.19) 0%, transparent 40%),
              radial-gradient(circle at 10% 50%, rgba(16, 185, 129, 0.24) 0%, transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.21) 0%, transparent 40%),
              radial-gradient(circle at 60% 20%, rgba(132, 204, 22, 0.26) 0%, transparent 50%),
              radial-gradient(circle at 25% 70%, rgba(5, 150, 105, 0.17) 0%, transparent 35%),
              radial-gradient(circle at 70% 45%, rgba(20, 184, 166, 0.16) 0%, transparent 55%),
              radial-gradient(circle at 45% 85%, rgba(13, 148, 136, 0.23) 0%, transparent 45%),
              radial-gradient(circle at 95% 60%, rgba(6, 182, 212, 0.20) 0%, transparent 40%)
            `
          }}
        ></div>

        {/* Mossy Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgZmlsbD0iIzMzZmJmZiIgZmlsbC1vcGFjaXR5PSIwLjA4Ij4KICAgICAgPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41Ii8+CiAgICA8L2c+CgogICAgPGcgZmlsbD0iIzMzZmJmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KICAgICAgPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMC41Ii8+CiAgICAgIDxjaXJjbGUgY3g9IjQ1IiBjeT0iMTUiIHI9IjAuNSIvPgogICAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIwLjUiLz4KICAgICAgPGNpcmNsZSBjeD0iMTUiIGN5PSI0NSIgcj0iMC41Ii8+CiAgICAgIDxjaXJjbGUgY3g9IjQ1IiBjeT0iNDUiIHI9IjAuNSIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+")`,
            backgroundSize: '60px 60px'
          }}
        ></div>

        {/* Foggy Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10">
      {/* Header */}
      <div className="bg-[#0f1724] rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">📋 Kanban Board</h1>
            <p className="text-slate-400">Drag and drop tickets to update their status</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Project Filter */}
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>

            <button
              onClick={loadTickets}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-slate-600">Total:</span>
            <span className="font-bold text-slate-900">{filteredTickets.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-600">Active:</span>
            <span className="font-bold text-yellow-600">
              {filteredTickets.filter(t => ['Open', 'In Progress', 'In Review'].includes(t.status)).length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-600">Completed:</span>
            <span className="font-bold text-green-600">
              {filteredTickets.filter(t => ['Resolved', 'Closed'].includes(t.status)).length}
            </span>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0f1724] rounded-lg shadow-xl p-4 z-50">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
            <span className="text-slate-300">Updating ticket...</span>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.title}
            title={column.title}
            tickets={column.tickets}
            color={column.color}
            onDrop={handleStatusChange}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && (
        <div className="bg-[#0f1724] rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-slate-100 mb-2">No tickets found</h3>
          <p className="text-slate-400 mb-6">
            {selectedProject === 'all' 
              ? 'Create your first ticket to get started!'
              : 'No tickets in this project. Try selecting a different project.'}
          </p>
          <a
            href="/tickets/create"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            + Create First Ticket
          </a>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-[#0f1724] border border-slate-700 rounded-lg p-4">
        <h3 className="font-semibold text-slate-100 mb-2">💡 How to use:</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• <strong>Drag & Drop:</strong> Click and drag tickets between columns to update their status</li>
          <li>• <strong>Click Ticket:</strong> Click on any ticket card to view full details</li>
          <li>• <strong>Filter by Project:</strong> Use the dropdown to view tickets from specific projects</li>
          <li>• <strong>Color Codes:</strong> Left border indicates priority (Gray=Low, Blue=Medium, Orange=High, Red=Critical)</li>
        </ul>
      </div>
    </div>
    </div>
  );
};

export default Kanban;
