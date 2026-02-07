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
      <div className="fixed inset-0 opacity-70">
        {/* Green Mossy Rings */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-radial from-emerald-400/45 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-20 w-80 h-80 bg-gradient-radial from-green-500/37 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-radial from-lime-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-teal-400/37 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-gradient-radial from-emerald-500/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-20 w-48 h-48 bg-gradient-radial from-green-400/45 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-radial from-lime-500/37 to-transparent rounded-full blur-3xl"></div>

        {/* Blue Mossy Rings */}
        <div className="absolute top-20 right-1/4 w-88 h-88 bg-gradient-radial from-blue-400/45 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-10 w-76 h-76 bg-gradient-radial from-cyan-500/37 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-68 h-68 bg-gradient-radial from-sky-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/2 right-20 w-60 h-60 bg-gradient-radial from-blue-500/37 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/2 w-52 h-52 bg-gradient-radial from-cyan-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-2/3 w-44 h-44 bg-gradient-radial from-sky-500/45 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-3/4 w-36 h-36 bg-gradient-radial from-blue-400/37 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Foggy Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/15 via-slate-800/10 to-slate-900/15 backdrop-blur-[1px]"></div>

      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 opacity-20"
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