import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '', role: 'member', adminKey: '' });
  const [errors, setErrors] = useState({});
  const { register, user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be 8+ chars';
    if (formData.password !== formData.confirm) newErrors.confirm = 'Passwords do not match';
    if (formData.role === 'admin' && !formData.adminKey.trim()) newErrors.adminKey = 'Admin key is required to register as admin';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) return setErrors(newErrors);
    try {
      const { confirm, ...registerData } = formData;
      if (register) {
        await register(registerData);
      } else {
        console.log('Register:', registerData);
      }
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
    }
  };

  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-emerald-50">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 text-left space-y-6 hidden md:block">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-400 to-amethyst-500 flex items-center justify-center shadow-md">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2l1.5 3 3 .5-2.5 2 1 3L12 9l-3 2.5 1-3L7.5 6.5 11 6 12 2z" fill="currentColor" />
                </svg>
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-orange-400">Create an account</h2>
            </div>

            <p className="text-lg text-purple-100 max-w-lg">Join your team on a modern, collaborative issue tracker — organize work, assign issues, and resolve faster.</p>

            <ul className="mt-6 space-y-3 text-sm text-purple-200">
              <li>• Enterprise-grade scale with secure access controls</li>
              <li>• Seamless integrations and automated workflows</li>
            </ul>
          </div>

          <div className="md:col-span-5">
            <div className="bg-slate-900/85 rounded-2xl p-8 shadow-2xl border border-slate-800">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white">Sign up</h2>
                <p className="text-sm text-slate-300">Create your account to get started</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.form && <div className="text-sm text-red-400">{errors.form}</div>}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition ${errors.name ? 'border-red-500' : ''}`} placeholder="Your name" />
                  {errors.name && <div className="text-xs text-red-400 mt-1">{errors.name}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" className={`w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition ${errors.email ? 'border-red-500' : ''}`} placeholder="you@company.com" />
                  {errors.email && <div className="text-xs text-red-400 mt-1">{errors.email}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <input name="password" value={formData.password} onChange={handleChange} type="password" className={`w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition ${errors.password ? 'border-red-500' : ''}`} placeholder="Create a password" />
                  {errors.password && <div className="text-xs text-red-400 mt-1">{errors.password}</div>}
                </div>


                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm password</label>
                  <input name="confirm" value={formData.confirm} onChange={handleChange} type="password" className={`w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 transition ${errors.confirm ? 'border-red-500' : ''}`} placeholder="Repeat your password" />
                  {errors.confirm && <div className="text-xs text-red-400 mt-1">{errors.confirm}</div>}
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

export default SignUp;
