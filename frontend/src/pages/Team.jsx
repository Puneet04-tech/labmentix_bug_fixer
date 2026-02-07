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
      {/* Desktop Picture Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        {/* Desktop-like gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-300/20 via-transparent to-blue-200/10"></div>
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