import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } 
    else if(/[0-9]/.test(formData.name)){
      newErrors.name = 'Name cannot start with number';
    }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await login(formData.email, formData.password);
  };

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-70">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 via-slate-900/30 to-slate-950/40"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.18) 0%, transparent 45%),
                           radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.15) 0%, transparent 40%),
                           radial-gradient(circle at 35% 75%, rgba(14, 165, 233, 0.20) 0%, transparent 50%),
                           radial-gradient(circle at 75% 65%, rgba(20, 184, 166, 0.12) 0%, transparent 35%),
                           radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.10) 0%, transparent 55%),
                           radial-gradient(circle at 20% 85%, rgba(2, 132, 199, 0.16) 0%, transparent 45%),
                           radial-gradient(circle at 90% 35%, rgba(45, 212, 191, 0.13) 0%, transparent 40%),
                           radial-gradient(circle at 10% 50%, rgba(16, 185, 129, 0.18) 0%, transparent 45%),
                           radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 40%),
                           radial-gradient(circle at 60% 20%, rgba(132, 204, 22, 0.20) 0%, transparent 50%),
                           radial-gradient(circle at 25% 70%, rgba(5, 150, 105, 0.12) 0%, transparent 35%),
                           radial-gradient(circle at 70% 45%, rgba(20, 184, 166, 0.10) 0%, transparent 55%),
                           radial-gradient(circle at 45% 85%, rgba(13, 148, 136, 0.16) 0%, transparent 45%),
                           radial-gradient(circle at 95% 60%, rgba(6, 182, 212, 0.13) 0%, transparent 40%)`
        }}></div>
        {/* Foggy overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15 backdrop-blur-[1px]"></div>
      </div>

      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 opacity-15 pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             backgroundSize: '128px 128px'
           }}></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          {/* Left Hero */}
          <div className="md:col-span-7 text-left space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2l1.5 3 3 .5-2.5 2 1 3L12 9l-3 2.5 1-3L7.5 6.5 11 6 12 2z" fill="currentColor" />
                </svg>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-cyan-400 drop-shadow-lg">Bug Tracker</h1>
            </div>

            <p className="text-lg text-blue-100 max-w-xl">A modern, collaborative issue tracker designed for teams — organize work, assign issues, and resolve faster.</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-900/50 rounded-xl p-4 shadow-inner backdrop-blur-sm border border-blue-700/40">
                <div className="text-2xl font-bold text-cyan-400">50M+</div>
                <div className="text-sm text-blue-100 mt-1">Enterprise-grade scale</div>
              </div>
              <div className="bg-blue-900/50 rounded-xl p-4 shadow-inner backdrop-blur-sm border border-blue-700/40">
                <div className="text-2xl font-bold text-cyan-400">99.95%</div>
                <div className="text-sm text-blue-100 mt-1">Reliable uptime</div>
              </div>
              <div className="bg-blue-900/50 rounded-xl p-4 shadow-inner backdrop-blur-sm border border-blue-700/40">
                <div className="text-2xl font-bold text-cyan-400">100+</div>
                <div className="text-sm text-blue-100 mt-1">Integrations</div>
              </div>
              <div className="bg-blue-900/50 rounded-xl p-4 shadow-inner backdrop-blur-sm border border-blue-700/40">
                <div className="text-2xl font-bold text-cyan-400">24/7</div>
                <div className="text-sm text-blue-100 mt-1">Support</div>
              </div>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2" />
                <div>
                  <div className="text-sm font-semibold text-blue-100">Real-time analytics</div>
                  <div className="text-xs text-blue-200">Track performance and issues instantly</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                <div>
                  <div className="text-sm font-semibold text-blue-100">Team collaboration</div>
                  <div className="text-xs text-blue-200">Seamless cross-team coordination</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Form */}
          <div className="md:col-span-5">
            <div className="bg-emerald-900/85 rounded-2xl p-8 shadow-2xl border border-emerald-700/60 backdrop-blur-2xl">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white drop-shadow-md">Welcome Back</h2>
                <p className="text-sm text-emerald-200">Sign in to access your dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-emerald-200 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-emerald-800/60 text-slate-50 placeholder:text-emerald-300 border border-emerald-600/50 focus:outline-none focus:ring-2 focus:ring-lime-500/60 focus:border-lime-400/60 backdrop-blur-sm transition-all duration-300 shadow-lg ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-blue-800/60 text-slate-50 placeholder:text-blue-300 border border-blue-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-400/60 backdrop-blur-sm transition-all duration-300 shadow-lg ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-blue-200">
                    <input type="checkbox" className="h-4 w-4 rounded border-blue-600/50 bg-blue-800/40 mr-2" /> Remember me
                  </label>
                  <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</a>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-xl hover:shadow-cyan-500/25">Sign In</button>
              </form>

              <div className="mt-4 text-sm text-blue-200">Don't have an account? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Sign up</Link></div>

              {/* Social auth removed to keep background and style only */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
