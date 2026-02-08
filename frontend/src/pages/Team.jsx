import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

const Team = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get('/users');
        setUsers(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white text-center">Team</h1>
              <p className="text-sm text-gray-300 mt-1">All users in the system</p>
            </div>
          </div>

          <div className="bg-emerald-900/20 rounded-xl p-6 border border-emerald-500/30 backdrop-blur-sm">
            {loading ? (
              <p className="text-emerald-100">Loading...</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : users.length === 0 ? (
              <p className="text-emerald-100">No users found</p>
            ) : (
              <div className="space-y-3">
                {users.map(u => (
                  <div key={u._id} className="flex items-center justify-between p-4 rounded-lg bg-emerald-800/30 border border-emerald-600/20 hover:bg-emerald-700/40 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center text-white font-semibold shadow-lg">
                        {u.name ? u.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="font-medium text-emerald-100">{u.name}</div>
                        <div className="text-sm text-emerald-200/80">{u.email}</div>
                      </div>
                    </div>
                    <div className="text-sm text-emerald-300/90 font-medium px-3 py-1 rounded-full bg-emerald-700/50 border border-emerald-500/30">{u.role}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;