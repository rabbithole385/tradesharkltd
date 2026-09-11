import React, { useState } from 'react';
import { X, CheckCircle2, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { TradeSharkLogo } from './TradeSharkLogo';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  mode: initialMode, 
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSuccess({
        name: fullName || 'Valued Trader',
        email: email || 'trader@tradeshark.com'
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl bg-[#14170e] border border-[#6dff8a]/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white transition-colors border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Rich Financial Trading Visual Banner */}
        <div className="relative md:w-5/12 hidden sm:flex flex-col justify-between p-7 bg-[#0d1008] border-b md:border-b-0 md:border-r border-white/10 overflow-hidden shrink-0">
          <img
            src="/images/user-login.jpg"
            alt="TradeShark Financial Markets"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10130a] via-[#10130a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#14170e]" />

          {/* Top Brand Pill */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-[#6dff8a]/40 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#6dff8a] animate-pulse" />
              <span className="text-[11px] font-semibold text-white tracking-wide">Next-Gen Multi-Asset Broker</span>
            </div>
          </div>

          {/* Bottom Live Market Trust Metrics */}
          <div className="relative z-10 space-y-3 pt-24">
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Execution Speed</span>
                <span className="text-[#6dff8a] font-mono font-bold">&lt; 1.2ms</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Global Client Assets</span>
                <span className="text-white font-mono font-bold">$842M+</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Tier-1 Regulatory Escrow</span>
                <span className="text-yellow-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>FCA / CySEC</span>
                </span>
              </div>
            </div>

            <p className="text-[11px] text-white/50 leading-relaxed">
              Trade over 5,000 global stocks, forex pairs, indices, and crypto with institutional zero-spread matching.
            </p>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="flex-1 p-6 sm:p-8 md:p-9 flex flex-col justify-center bg-[#14170e]">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#6dff8a]/20 text-[#6dff8a] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {mode === 'signup' ? 'Welcome to TradeShark Ltd!' : 'Welcome Back!'}
              </h3>
              <p className="text-sm text-[#a3a89e]">
                Redirecting you to your TradeShark verified multi-asset dashboard...
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Header */}
              <div className="space-y-1.5">
                <TradeSharkLogo size="sm" showLtd={true} className="mb-2" />
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {mode === 'signup' ? 'Create your TradeShark account' : 'Log in to TradeShark'}
                </h3>
                <p className="text-xs text-[#a3a89e]">
                  {mode === 'signup' 
                    ? 'Join 40M+ investors trading stocks, crypto, and ETFs.' 
                    : 'Access your portfolio, live watchlists, and CopyTrader™.'}
                </p>
              </div>

              {/* Quick Demo Social buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('alex.m@gmail.com');
                    setFullName('Alex Mercer');
                    setSubmitted(true);
                    setTimeout(() => {
                      onSuccess({ name: 'Alex Mercer', email: 'alex.m@gmail.com' });
                      onClose();
                    }, 1000);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#6dff8a]" />
                    <span>Continue as Verified Trader (Alex Mercer)</span>
                  </div>
                  <span className="text-[10px] bg-[#6dff8a]/20 text-[#6dff8a] px-2 py-0.5 rounded font-mono font-bold">$104k Live</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] text-white/40 uppercase font-semibold">Or with credentials</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-xs text-white/70">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jordan Smith"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs text-white/70">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/70">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <label className="flex items-start gap-2 text-[11px] text-[#a3a89e] cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      required
                      className="accent-[#6dff8a] w-3.5 h-3.5 mt-0.5"
                    />
                    <span>
                      I confirm I have read and agree to the <strong>TradeShark Ltd Terms of Service</strong> and Risk Disclosures.
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(109,255,138,0.2)] transition-all cursor-pointer"
                >
                  <span>{mode === 'signup' ? 'Create Account' : 'Log In to Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Toggle login / signup */}
              <div className="text-center text-xs text-[#a3a89e] pt-1">
                {mode === 'signup' ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-[#6dff8a] font-semibold hover:underline"
                    >
                      Log in
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-[#6dff8a] font-semibold hover:underline"
                    >
                      Start Investing
                    </button>
                  </span>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
