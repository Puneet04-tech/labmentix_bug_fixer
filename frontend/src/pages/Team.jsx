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
    <div className="min-h-screen relative">
      {/* Mossy Background Effects */}
      <div className="fixed inset-0 opacity-40 pointer-events-none">
        {/* Green Mossy Rings */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-radial from-emerald-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-20 w-80 h-80 bg-gradient-radial from-green-500/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-radial from-lime-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-teal-400/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-gradient-radial from-emerald-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-20 w-48 h-48 bg-gradient-radial from-green-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-radial from-lime-500/25 to-transparent rounded-full blur-3xl"></div>

        {/* Blue Mossy Rings */}
        <div className="absolute top-20 right-1/4 w-88 h-88 bg-gradient-radial from-blue-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-10 w-76 h-76 bg-gradient-radial from-cyan-500/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-68 h-68 bg-gradient-radial from-sky-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/2 right-20 w-60 h-60 bg-gradient-radial from-blue-500/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/2 w-52 h-52 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-2/3 w-44 h-44 bg-gradient-radial from-sky-500/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-3/4 w-36 h-36 bg-gradient-radial from-blue-400/25 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Foggy Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/10 via-slate-800/5 to-slate-900/10 backdrop-blur-[1px] pointer-events-none"></div>

      {/* Flowing Ribbon Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Warm Contrasting Ribbons */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-500/20 via-pink-500/15 to-purple-500/20 transform -rotate-6 translate-y-8 blur-sm"></div>
        <div className="absolute top-1/4 right-0 w-full h-24 bg-gradient-to-l from-red-500/18 via-orange-400/12 to-yellow-500/15 transform rotate-3 translate-y-6 blur-sm"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-28 bg-gradient-to-r from-purple-500/16 via-pink-400/14 to-red-500/18 transform -rotate-2 translate-y-4 blur-sm"></div>
        <div className="absolute bottom-0 right-0 w-full h-36 bg-gradient-to-l from-yellow-500/20 via-orange-500/15 to-red-400/18 transform rotate-5 translate-y-10 blur-sm"></div>
        <div className="absolute top-1/2 left-1/4 w-3/4 h-20 bg-gradient-to-r from-pink-500/14 via-purple-500/12 to-orange-500/16 transform rotate-1 translate-y-2 blur-sm"></div>
      </div>

      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 opacity-15 pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             backgroundSize: '128px 128px'
           }}></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white text-center">Team</h1>
              <p className="text-sm text-gray-300 mt-1">All users in the system</p>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800">
            {loading ? (
              <p className="text-gray-300">Loading...</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : users.length === 0 ? (
              <p className="text-gray-300">No users found</p>
            ) : (
              <div className="space-y-3">
                {users.map(u => (
                  <div key={u._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                        {u.name ? u.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-medium text-white">{u.name}</div>
                        <div className="text-sm text-gray-300">{u.email}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{u.role}</div>
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