import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { register, user } = useAuth();

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if(/^[0-9]{1}/.test(formData.name)){
      newErrors.name = 'Name cannot start with number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    const { confirmPassword, ...registerData } = {
      ...formData,
      role: 'member' // All users register as members by default
    };
    await register(registerData);
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          {/* Left Hero */}
          <div className="md:col-span-7 flex items-center justify-center h-full">
            <div className="w-full max-w-2xl bg-blue-900/70 rounded-2xl shadow-xl p-10 flex flex-col gap-8 border border-blue-700/50 backdrop-blur-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 2l1.5 3 3 .5-2.5 2 1 3L12 9l-3 2.5 1-3L7.5 6.5 11 6 12 2z" fill="currentColor" />
                  </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-400 drop-shadow-lg">Bug Tracker</h1>
              </div>
              <p className="text-lg text-blue-100 max-w-xl">Create your account and join your team on a modern, collaborative issue tracker — organize work, assign issues, and resolve faster.</p>

              <div className="grid grid-cols-2 gap-6 mt-2">
                <div className="bg-blue-800/60 rounded-xl p-5 shadow-inner min-h-[96px] flex flex-col justify-center border border-blue-700/30">
                  <div className="text-2xl font-bold text-cyan-400">50M+</div>
                  <div className="text-sm text-blue-100 mt-1">Enterprise-grade scale</div>
                </div>
                <div className="bg-blue-800/60 rounded-xl p-5 shadow-inner min-h-[96px] flex flex-col justify-center border border-blue-700/30">
                  <div className="text-2xl font-bold text-cyan-400">99.95%</div>
                  <div className="text-sm text-blue-100 mt-1">Reliable uptime</div>
                </div>
                <div className="bg-blue-800/60 rounded-xl p-5 shadow-inner min-h-[96px] flex flex-col justify-center border border-blue-700/30">
                  <div className="text-2xl font-bold text-cyan-400">100+</div>
                  <div className="text-sm text-blue-100 mt-1">Integrations</div>
                </div>
                <div className="bg-blue-800/60 rounded-xl p-5 shadow-inner min-h-[96px] flex flex-col justify-center border border-blue-700/30">
                  <div className="text-2xl font-bold text-cyan-400">24/7</div>
                  <div className="text-sm text-blue-100 mt-1">Support</div>
                </div>
              </div>

              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-200">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-semibold">Real-time analytics</div>
                    <div className="text-xs text-blue-200">Track performance and issues instantly</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-semibold">Team collaboration</div>
                    <div className="text-xs text-blue-200">Seamless cross-team coordination</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-5 flex items-start md:items-center">
            <div className="bg-blue-900/80 rounded-2xl p-8 shadow-2xl border border-blue-700/50 w-full max-w-md mx-auto backdrop-blur-2xl">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">Sign up</h2>
                <p className="text-sm text-blue-100">Create your account to get started</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.form && <div className="text-sm text-red-400">{errors.form}</div>}

                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg bg-blue-800/60 text-blue-100 placeholder:text-blue-400 border border-blue-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 ${errors.name ? 'border-red-500' : ''}`} placeholder="John Doe" />
                  {errors.name && <div className="text-xs text-red-400 mt-1">{errors.name}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">Email address</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" className={`w-full px-4 py-3 rounded-lg bg-blue-800/60 text-blue-100 placeholder:text-blue-400 border border-blue-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 ${errors.email ? 'border-red-500' : ''}`} placeholder="john@example.com" />
                  {errors.email && <div className="text-xs text-red-400 mt-1">{errors.email}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">Password</label>
                  <input name="password" value={formData.password} onChange={handleChange} type="password" className={`w-full px-4 py-3 rounded-lg bg-blue-800/60 text-blue-100 placeholder:text-blue-400 border border-blue-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 ${errors.password ? 'border-red-500' : ''}`} placeholder="••••••••" />
                  {errors.password && <div className="text-xs text-red-400 mt-1">{errors.password}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">Confirm Password</label>
                  <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" className={`w-full px-4 py-3 rounded-lg bg-blue-800/60 text-blue-100 placeholder:text-blue-400 border border-blue-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 ${errors.confirmPassword ? 'border-red-500' : ''}`} placeholder="••••••••" />
                  {errors.confirmPassword && <div className="text-xs text-red-400 mt-1">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">Create account</button>
              </form>

              <div className="mt-4 text-sm text-blue-100">Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</Link></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
