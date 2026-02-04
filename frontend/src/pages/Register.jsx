import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member',
    adminKey: ''
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

    if (formData.role === 'admin' && !formData.adminKey.trim()) {
      newErrors.adminKey = 'Admin key is required to register as admin';
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

    const { confirmPassword, ...registerData } = formData;
    await register(registerData);
  };

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 auth-gradient">
      <div className="absolute top-6 center-6  md:block">
        <p className="text-sm font-semibold text-slate-100">Make every bug count.</p>
        <p className="text-xs text-slate-400 mt-1">Start fixing today — collaborate with your team.</p>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          {/* Left Hero */}
          <div className="md:col-span-7 flex items-center justify-center h-full">
            <div className="w-full max-w-2xl bg-slate-900/70 rounded-2xl shadow-xl p-10 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-400 to-amethyst-500 flex items-center justify-center shadow-md">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 2l1.5 3 3 .5-2.5 2 1 3L12 9l-3 2.5 1-3L7.5 6.5 11 6 12 2z" fill="currentColor" />
                  </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-orange-400">Bug Tracker</h1>
              </div>
              <p className="text-lg text-purple-100 max-w-xl">Create your account and join your team on a modern, collaborative issue tracker — organize work, assign issues, and resolve faster.</p>

              <div className="grid grid-cols-2 gap-6 mt-2">
                <div className="bg-slate-900/60 rounded-xl p-5 shadow-inner min-h-[96px] flex flex-col justify-center">
                  <div className="text-2xl font-bold text-orange-400">50M+</div>
                  <div className="text-sm text-purple-100 mt-1">Enterprise-grade scale</div>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-5 shadow-inner min-h-[96px] flex flex-col justify-center">
                  <div className="text-2xl font-bold text-orange-400">99.95%</div>
                  <div className="text-sm text-purple-100 mt-1">Reliable uptime</div>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-5 shadow-inner min-h-[96px] flex flex-col justify-center">
                  <div className="text-2xl font-bold text-orange-400">100+</div>
                  <div className="text-sm text-purple-100 mt-1">Integrations</div>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-5 shadow-inner min-h-[96px] flex flex-col justify-center">
                  <div className="text-2xl font-bold text-orange-400">24/7</div>
                  <div className="text-sm text-purple-100 mt-1">Support</div>
                </div>
              </div>

              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-purple-200">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-semibold">Real-time analytics</div>
                    <div className="text-xs text-purple-200">Track performance and issues instantly</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amethyst-400 rounded-full mt-2" />
                  <div>
                    <div className="text-sm font-semibold">Team collaboration</div>
                    <div className="text-xs text-purple-200">Seamless cross-team coordination</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-5 flex items-start md:items-center">
            <div className="bg-slate-900/85 rounded-2xl p-8 shadow-2xl border border-slate-800 w-full max-w-md mx-auto">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white">Sign up</h2>
                <p className="text-sm text-slate-300">Create your account to get started</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.form && <div className="text-sm text-red-400">{errors.form}</div>}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition ${errors.name ? 'border-red-500' : ''}`} placeholder="John Doe" />
                  {errors.name && <div className="text-xs text-red-400 mt-1">{errors.name}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" className={`w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition ${errors.email ? 'border-red-500' : ''}`} placeholder="john@example.com" />
                  {errors.email && <div className="text-xs text-red-400 mt-1">{errors.email}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <input name="password" value={formData.password} onChange={handleChange} type="password" className={`w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition ${errors.password ? 'border-red-500' : ''}`} placeholder="••••••••" />
                  {errors.password && <div className="text-xs text-red-400 mt-1">{errors.password}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                  <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" className={`w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition ${errors.confirmPassword ? 'border-red-500' : ''}`} placeholder="••••••••" />
                  {errors.confirmPassword && <div className="text-xs text-red-400 mt-1">{errors.confirmPassword}</div>}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                  <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition">
                    <option value="member">Member</option>
                    <option value="core">Core</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {formData.role === 'admin' && (
                  <div>
                    <label htmlFor="adminKey" className="block text-sm font-medium text-slate-300 mb-2">Admin Key (required to register as admin)</label>
                    <input type="text" id="adminKey" name="adminKey" value={formData.adminKey} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition ${errors.adminKey ? 'border-red-500' : ''}`} placeholder="Enter admin registration key" />
                    {errors.adminKey && <div className="text-xs text-red-400 mt-1">{errors.adminKey}</div>}
                  </div>
                )}

                <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-accent-500 text-white font-semibold hover:from-orange-600 hover:to-accent-600 transition-shadow shadow-md">Create account</button>
              </form>

              <div className="mt-4 text-sm text-slate-300">Already have an account? <Link to="/login" className="text-amber-300 hover:text-amber-400 font-medium">Sign in</Link></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
