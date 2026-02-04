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
    <div className="min-h-screen relative flex items-center justify-center px-4 auth-gradient">
      <div className="absolute top-6 left-6 hidden md:block">
        <p className="text-sm font-semibold text-slate-100">Make every bug count.</p>
        <p className="text-xs text-slate-400 mt-1">Start fixing today — collaborate with your team.</p>
      </div>      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          {/* Left Hero */}
          <div className="md:col-span-7 text-left space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-400 to-amethyst-500 flex items-center justify-center shadow-md">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2l1.5 3 3 .5-2.5 2 1 3L12 9l-3 2.5 1-3L7.5 6.5 11 6 12 2z" fill="currentColor" />
                </svg>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-orange-400">Bug Tracker</h1>
            </div>

            <p className="text-lg text-purple-100 max-w-xl">A modern, collaborative issue tracker designed for teams — organize work, assign issues, and resolve faster.</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/40 rounded-xl p-4 shadow-inner backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange-400">50M+</div>
                <div className="text-sm text-purple-100 mt-1">Enterprise-grade scale</div>
              </div>
              <div className="bg-slate-900/40 rounded-xl p-4 shadow-inner backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange-400">99.95%</div>
                <div className="text-sm text-purple-100 mt-1">Reliable uptime</div>
              </div>
              <div className="bg-slate-900/40 rounded-xl p-4 shadow-inner backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange-400">100+</div>
                <div className="text-sm text-purple-100 mt-1">Integrations</div>
              </div>
              <div className="bg-slate-900/40 rounded-xl p-4 shadow-inner backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange-400">24/7</div>
                <div className="text-sm text-purple-100 mt-1">Support</div>
              </div>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* Right Form */}
          <div className="md:col-span-5">
            <div className="bg-slate-900/85 rounded-2xl p-8 shadow-2xl border border-slate-800">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-sm text-slate-300">Sign in to access your dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-slate-300">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-transparent mr-2" /> Remember me
                  </label>
                  <a href="#" className="text-sm text-amber-300 hover:text-amber-400">Forgot password?</a>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-accent-500 text-white font-semibold hover:from-orange-600 hover:to-accent-600 transition-shadow shadow-md">Sign In</button>
              </form>

              <div className="mt-4 text-sm text-slate-300">Don't have an account? <Link to="/signup" className="text-amber-300 hover:text-amber-400 font-medium">Sign up</Link></div>

              {/* Social auth removed to keep background and style only */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
