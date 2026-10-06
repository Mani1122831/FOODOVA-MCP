import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Keyboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VirtualKeyboard from '../components/VirtualKeyboard';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Virtual keyboard state
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [activeField, setActiveField] = useState('email');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || location.state?.from?.pathname || '/menu';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.error);
    }
  };

  // Voice controller remote sign in triggers
  React.useEffect(() => {
    const handleVoiceCustomer = async () => {
      setEmail('test@foodova.com');
      setPassword('Test@1234');
      setLoading(true);
      setError('');
      const res = await login('test@foodova.com', 'Test@1234');
      setLoading(false);
      if (res.success) {
        navigate(redirectPath, { replace: true });
      } else {
        setError(res.error);
      }
    };

    const handleVoiceAdmin = async () => {
      setEmail('admin@foodova.com');
      setPassword('Admin@123');
      setLoading(true);
      setError('');
      const res = await login('admin@foodova.com', 'Admin@123');
      setLoading(false);
      if (res.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(res.error);
      }
    };

    window.addEventListener('foodova:quick-login-customer', handleVoiceCustomer);
    window.addEventListener('foodova:quick-login-admin', handleVoiceAdmin);

    return () => {
      window.removeEventListener('foodova:quick-login-customer', handleVoiceCustomer);
      window.removeEventListener('foodova:quick-login-admin', handleVoiceAdmin);
    };
  }, [login, navigate, redirectPath]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-200/80 shadow-card space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-400 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-brand">
            F
          </div>
          <h1 className="font-display font-black text-2xl text-dark-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-gray-500">
            Sign in to access saved addresses, coupons, and 1-click orders.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-700">Email Address</label>
              <button
                type="button"
                onClick={() => {
                  setActiveField('email');
                  setKeyboardOpen(true);
                }}
                className="text-[11px] text-brand-600 hover:underline flex items-center gap-1"
              >
                <Keyboard className="w-3 h-3" /> Virtual Key
              </button>
            </div>
            <div className="relative">
              <input
                type="email"
                value={email}
                onFocus={() => setActiveField('email')}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="input pl-10 text-xs"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-700">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onFocus={() => setActiveField('password')}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input pl-10 pr-10 text-xs"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-brand-500 focus:ring-brand-400"
              />
              <span>Remember this session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white font-bold text-xs shadow-brand hover:shadow-brand-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Demo Login Buttons */}
        <div className="p-4 bg-gradient-to-br from-cream-50 to-amber-50/50 rounded-2xl border border-amber-200/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>1-Click Instant Sign-In</span>
            </span>
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Fast Test</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setEmail('test@foodova.com');
                setPassword('Test@1234');
                setLoading(true);
                setError('');
                const res = await login('test@foodova.com', 'Test@1234');
                setLoading(false);
                if (res.success) {
                  navigate(redirectPath, { replace: true });
                } else {
                  setError(res.error);
                }
              }}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-amber-100/60 text-dark-900 border border-amber-200 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>🍔 Customer</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setEmail('admin@foodova.com');
                setPassword('Admin@123');
                setLoading(true);
                setError('');
                const res = await login('admin@foodova.com', 'Admin@123');
                setLoading(false);
                if (res.success) {
                  navigate('/admin', { replace: true });
                } else {
                  setError(res.error);
                }
              }}
              className="py-2.5 px-3 rounded-xl bg-dark-900 hover:bg-dark-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>👑 Admin</span>
            </button>
          </div>
        </div>

        {/* Signup Link */}
        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Create an Account
          </Link>
        </div>

        {/* Hands-Free Virtual Keyboard */}
        <VirtualKeyboard
          isOpen={keyboardOpen}
          onClose={() => setKeyboardOpen(false)}
          isPassword={activeField === 'password'}
          onKeyPress={(char) => {
            if (activeField === 'email') setEmail(prev => prev + char);
            if (activeField === 'password') setPassword(prev => prev + char);
          }}
          onBackspace={() => {
            if (activeField === 'email') setEmail(prev => prev.slice(0, -1));
            if (activeField === 'password') setPassword(prev => prev.slice(0, -1));
          }}
          onSubmit={() => setKeyboardOpen(false)}
        />

      </motion.div>
    </div>
  );
};

export default LoginPage;
