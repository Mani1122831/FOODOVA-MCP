import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RefreshCw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export const VerifyOTPPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [cooldown, setCooldown] = useState(60); // 60s cooldown for resend
  const [error, setError] = useState('');

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleInputChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto advance focus
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits of your OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/verify-otp', {
        email,
        otp: fullOtp
      });

      if (res.data?.success && res.data.resetToken) {
        toast.success('OTP verified successfully!');
        sessionStorage.setItem('foodova_reset_token', res.data.resetToken);
        navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(res.data.resetToken)}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('New OTP sent to your registered email!');
      setTimeLeft(300);
      setCooldown(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      toast.error('Could not resend OTP. Please try again.');
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-200/80 shadow-card space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-display font-black text-2xl text-dark-900 tracking-tight">
            Verify Email OTP
          </h1>
          <p className="text-xs text-gray-500">
            Enter the 6-digit code sent to <strong className="text-dark-800">{email}</strong>.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          
          {/* 6 Digit OTP inputs */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center font-display font-black text-xl rounded-2xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none transition-all"
              />
            ))}
          </div>

          {/* Expiry countdown */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span>Code expires in: <strong className="text-brand-600 font-mono">{formatTimer(timeLeft)}</strong></span>
            
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={handleResend}
              className="text-xs font-bold text-brand-600 disabled:text-gray-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend Code'}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || timeLeft <= 0}
            className="w-full py-3.5 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white font-bold text-xs shadow-brand hover:shadow-brand-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify OTP Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          <Link to="/forgot-password" className="inline-flex items-center gap-1 font-bold text-brand-600 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Email</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTPPage;
