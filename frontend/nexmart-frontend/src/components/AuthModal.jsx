import React, { useState, useRef, useEffect } from 'react';
import { 
  X, User, Lock, Mail, Phone, ArrowRight, ShieldCheck, 
  CheckCircle2, AlertCircle, KeyRound, ShieldAlert, Eye, EyeOff, RotateCw 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes block
const BLOCK_KEY = 'appzys_auth_blocked_until';
const RESEND_TIMEOUT_SECONDS = 150; // 2 minutes 30 seconds

const AuthModal = () => {
  const { isAuthModalOpen, closeAuth, authMode, setAuthMode, login, register, forgotPassword, validateOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  // Form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    gender: 'Male',
    identifier: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Forgot password sub-step: 'identifier' | 'otp' | 'password'
  const [forgotStep, setForgotStep] = useState('identifier');

  // 4-box OTP state
  const [otpBoxes, setOtpBoxes] = useState(['', '', '', '']);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // 2:30 Timer for Resend OTP (150 seconds)
  const [resendCountdown, setResendCountdown] = useState(RESEND_TIMEOUT_SECONDS);

  // Failed attempts tracking (Max 3 attempts)
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [blockedUntil, setBlockedUntil] = useState(() => {
    const saved = localStorage.getItem(BLOCK_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [blockTimeRemaining, setBlockTimeRemaining] = useState('');

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Alerts & loading
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Timer for device block countdown
  useEffect(() => {
    if (!blockedUntil || blockedUntil <= Date.now()) {
      if (blockedUntil) {
        localStorage.removeItem(BLOCK_KEY);
        setBlockedUntil(0);
        setAttemptsLeft(3);
      }
      return;
    }

    const interval = setInterval(() => {
      const diff = blockedUntil - Date.now();
      if (diff <= 0) {
        localStorage.removeItem(BLOCK_KEY);
        setBlockedUntil(0);
        setAttemptsLeft(3);
        setBlockTimeRemaining('');
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setBlockTimeRemaining(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  // Timer for 2:30 Resend OTP countdown
  useEffect(() => {
    let timer = null;
    if (forgotStep === 'otp' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [forgotStep, resendCountdown]);

  // Format seconds to mm:ss (e.g. 150s -> 02:30)
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      setForgotStep('identifier');
      setOtpBoxes(['', '', '', '']);
      setErrorMsg('');
      setSuccessMsg('');
      setResendCountdown(RESEND_TIMEOUT_SECONDS);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const isBlocked = blockedUntil > Date.now();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const id = formData.identifier.trim() || formData.email.trim();
    if (!id || !formData.password) {
      setErrorMsg('Please enter your email/phone and password');
      setLoading(false);
      return;
    }

    const res = await login(id, formData.password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`Welcome, ${res.user?.name || 'Customer'}!`);
      setTimeout(() => {
        closeAuth();
        if (res.user?.role === 'ROLE_ADMIN' || res.user?.role === 'ADMIN') {
          navigate('/admin');
        }
      }, 700);
    } else {
      setErrorMsg('Wrong password or email');
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.password.trim()) {
      setErrorMsg('Please fill all required fields');
      return;
    }

    setLoading(true);
    const res = await register({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      gender: formData.gender
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Account created successfully in database!');
      setTimeout(() => {
        closeAuth();
      }, 900);
    } else {
      setErrorMsg(res.message || 'Registration failed. Email or phone might already be registered.');
    }
  };

  // Step 1: Send OTP via Backend Email / SMS Service
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isBlocked) {
      setErrorMsg(`Device is blocked. Try again in ${blockTimeRemaining}`);
      return;
    }

    const id = formData.identifier.trim();
    if (!id) {
      setErrorMsg('Please enter your registered email address to receive OTP');
      return;
    }

    setLoading(true);
    const res = await forgotPassword(id);
    setLoading(false);

    if (res.success) {
      setForgotStep('otp');
      setOtpBoxes(['', '', '', '']);
      setResendCountdown(RESEND_TIMEOUT_SECONDS); // Start 2:30 timer

      // Auto-focus first OTP input after transition
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 150);
    } else {
      setErrorMsg(res.message || 'Could not find account with this email address');
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    if (isBlocked || resendCountdown > 0) return;
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    setOtpBoxes(['', '', '', '']);

    const id = formData.identifier.trim();
    const res = await forgotPassword(id);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`New OTP sent to ${id}!`);
      setResendCountdown(RESEND_TIMEOUT_SECONDS); // Reset 2:30 timer
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 150);
    } else {
      setErrorMsg(res.message || 'Failed to resend OTP. Please try again.');
    }
  };

  // Handle 4-box OTP input changes
  const handleOtpBoxChange = (index, value) => {
    if (isBlocked) return;
    setErrorMsg('');

    // Only allow single digit 0-9
    const cleanVal = value.replace(/[^0-9]/g, '');
    const char = cleanVal.slice(-1);

    const newBoxes = [...otpBoxes];
    newBoxes[index] = char;
    setOtpBoxes(newBoxes);

    // Auto focus next box if typed
    if (char && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpBoxes[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    if (isBlocked) return;
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (pasted.length > 0) {
      const newBoxes = ['', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newBoxes[i] = pasted[i];
      }
      setOtpBoxes(newBoxes);
      const nextFocus = Math.min(pasted.length, 3);
      otpInputRefs[nextFocus].current?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtpOnly = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isBlocked) {
      setErrorMsg(`Device is blocked. Try again in ${blockTimeRemaining}`);
      return;
    }

    const fullOtp = otpBoxes.join('');
    if (fullOtp.length < 4) {
      setErrorMsg('Please enter the full 4-digit verification code');
      return;
    }

    setLoading(true);
    let isValid = false;

    // Check with backend validateOtp
    try {
      const res = await validateOtp(formData.identifier.trim(), fullOtp);
      isValid = res.success;
    } catch (_) {
      isValid = false;
    }

    setLoading(false);

    if (isValid) {
      // OTP is correct! Advance to password reset bubble
      setSuccessMsg('OTP verified successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setForgotStep('password');
      }, 500);
    } else {
      // Wrong OTP handling & 3-attempt block
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);

      if (newAttempts <= 0) {
        const blockUntilTime = Date.now() + BLOCK_DURATION_MS;
        localStorage.setItem(BLOCK_KEY, blockUntilTime.toString());
        setBlockedUntil(blockUntilTime);
        setErrorMsg('Device Blocked! You have entered wrong OTP 3 times. For your security, this device is locked for 15 minutes.');
      } else {
        setErrorMsg(`Wrong OTP! (${newAttempts} of 3 attempts remaining)`);
        setOtpBoxes(['', '', '', '']);
        otpInputRefs[0].current?.focus();
      }
    }
  };

  // Step 3: Set New Password & Confirm Password -> Login
  const handleResetPasswordAndLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.newPassword.trim() || !formData.confirmPassword.trim()) {
      setErrorMsg('Please enter and confirm your new password');
      return;
    }

    if (formData.newPassword.trim().length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    if (formData.newPassword.trim() !== formData.confirmPassword.trim()) {
      setErrorMsg('Passwords do not match! Please check again.');
      return;
    }

    setLoading(true);
    const fullOtp = otpBoxes.join('');
    const res = await verifyOtp(formData.identifier.trim(), fullOtp, formData.newPassword.trim());
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Password updated successfully! Logging you in...');
      setTimeout(() => {
        closeAuth();
      }, 900);
    } else {
      setErrorMsg(res.message || 'Failed to update password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={closeAuth} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" />

      <div className="min-h-screen px-4 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header & Close */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1c2d4a] text-white flex items-center justify-center font-black text-sm">
                A
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {authMode === 'login' ? 'Sign In Account' : authMode === 'register' ? 'Create New Account' : 'Reset Password'}
                </h3>
                <p className="text-[10px] text-slate-500">Fast, secure access to your orders</p>
              </div>
            </div>
            <button
              onClick={closeAuth}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Mode Tabs */}
          {authMode !== 'forgot' && (
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  authMode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  authMode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1: LOGIN */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email or Mobile Number</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Email or Mobile Number"
                    autoComplete="off"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-700 font-bold">Password</label>
                  <button
                    type="button"
                    onClick={() => { 
                      setAuthMode('forgot'); 
                      setForgotStep('identifier'); 
                      setErrorMsg(''); 
                      setSuccessMsg(''); 
                    }}
                    className="text-[#1c2d4a] text-[11px] font-bold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-[#1c2d4a] hover:bg-[#142239] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <span>{loading ? 'Verifying...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 2: REGISTER */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  autoComplete="off"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="Mobile Number"
                  autoComplete="off"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email ID</label>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  autoComplete="off"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Set Password</label>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-[#1c2d4a] hover:bg-[#142239] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 3: FORGOT PASSWORD / MULTI-STEP OTP FLOW */}
          {authMode === 'forgot' && (
            <div className="space-y-4 text-xs">
              
              {/* SUB-STEP 1: Enter Email Only */}
              {forgotStep === 'identifier' && (
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div className="p-3 bg-blue-50 text-slate-700 rounded-xl text-xs flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#1c2d4a] shrink-0" />
                    <span>Enter your registered email address to receive a 4-digit verification code.</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Registered Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com"
                      autoComplete="email"
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      Back to Login
                    </button>
                    <button
                      type="submit"
                      disabled={loading || isBlocked}
                      className="flex-1 py-2.5 rounded-xl bg-[#1c2d4a] text-white font-bold transition hover:bg-[#142239] cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </div>
                </form>
              )}

              {/* SUB-STEP 2: 4-BOX OTP VERIFICATION */}
              {forgotStep === 'otp' && (
                <form onSubmit={handleVerifyOtpOnly} className="space-y-4">
                  {/* Status notification banner */}
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-emerald-800">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        OTP Sent to Your Email!
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                        Attempts: {attemptsLeft}/3
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      A 4-digit verification code has been dispatched to <strong>{formData.identifier}</strong>. Please check your Gmail inbox or Spam folder and enter each digit below.
                    </p>
                  </div>

                  {/* Device Block Alert if 3 wrong attempts */}
                  {isBlocked ? (
                    <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-center space-y-2">
                      <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto" />
                      <h4 className="font-bold text-sm text-rose-900">Device Temporarily Blocked</h4>
                      <p className="text-[11px] text-rose-700 leading-relaxed">
                        You have entered an incorrect OTP 3 times. For account security, this device is blocked.
                      </p>
                      <div className="inline-block px-3 py-1 bg-rose-200 text-rose-900 font-mono font-bold text-xs rounded-full">
                        Try again in {blockTimeRemaining}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* 4 Separate OTP Boxes */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-2 text-center">
                          Enter 4-Digit Verification Code
                        </label>
                        <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                          {[0, 1, 2, 3].map((idx) => (
                            <input
                              key={idx}
                              ref={otpInputRefs[idx]}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={otpBoxes[idx]}
                              onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              disabled={isBlocked}
                              className={`w-12 h-14 text-center font-mono text-2xl font-black rounded-2xl border-2 transition outline-hidden ${
                                otpBoxes[idx] 
                                  ? 'border-[#1c2d4a] bg-blue-50/40 text-slate-900 shadow-sm' 
                                  : 'border-slate-300 bg-white text-slate-700 focus:border-[#1c2d4a] focus:ring-2 focus:ring-[#1c2d4a]/20'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 text-center mt-2">
                          Check your phone's notification bar or Gmail inbox
                        </p>
                      </div>

                      {/* 2:30 Countdown Timer & Resend OTP Button */}
                      <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 font-medium">Didn't receive the code?</span>
                        {resendCountdown > 0 ? (
                          <span className="font-mono text-slate-600 font-bold flex items-center gap-1.5">
                            <RotateCw className="w-3 h-3 text-slate-400 animate-spin" />
                            Resend in <strong className="text-[#1c2d4a] font-black">{formatTimer(resendCountdown)}</strong>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={loading || isBlocked}
                            className="font-bold text-[#1c2d4a] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCw className="w-3.5 h-3.5 text-[#1c2d4a]" />
                            <span>Resend OTP</span>
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setForgotStep('identifier');
                            setOtpBoxes(['', '', '', '']);
                            setErrorMsg('');
                          }}
                          className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                          Change Email
                        </button>
                        <button
                          type="submit"
                          disabled={loading || otpBoxes.join('').length < 4}
                          className="flex-1 py-2.5 rounded-xl bg-[#1c2d4a] text-white font-bold transition hover:bg-[#142239] cursor-pointer disabled:opacity-50"
                        >
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}

              {/* SUB-STEP 3: NEW PASSWORD & CONFIRM PASSWORD BUBBLE */}
              {forgotStep === 'password' && (
                <form onSubmit={handleResetPasswordAndLogin} className="space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">OTP Verified Successfully!</p>
                      <p className="text-[10px] text-emerald-700">Set your new password below to log in</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Set New Password</label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Set New Password"
                        autoComplete="new-password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Confirm Password</label>
                    <div className="relative flex items-center">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 rounded-xl bg-[#1c2d4a] hover:bg-[#142239] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    <span>{loading ? 'Updating Password...' : 'Set & Login'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Bank-Grade Encrypted Authentication</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
