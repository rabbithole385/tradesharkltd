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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#181b12] border border-white/15 rounded-3xl shadow-2xl p-7 sm:p-8 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
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
          <div className="space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <TradeSharkLogo size="md" showLtd={true} className="justify-center mb-2" />
              <h3 className="text-2xl font-bold text-white">
                {mode === 'signup' ? 'Create your TradeShark account' : 'Log in to TradeShark Ltd'}
              </h3>
              <p className="text-xs text-[#a3a89e]">
                {mode === 'signup' 
                  ? 'Join 40M+ investors trading stocks, crypto, and ETFs.' 
                  : 'Access your portfolio, live watchlists, and CopyTrader™.'}
              </p>
            </div>

            {/* Quick Demo Social buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setEmail('demo@tradeshark.com');
                  setFullName('Alex Mercer');
                  setSubmitted(true);
                  setTimeout(() => {
                    onSuccess({ name: 'Alex Mercer', email: 'demo@tradeshark.com' });
                    onClose();
                  }, 1000);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2.5 transition-colors"
              >
                <span>Continue as Instant Demo Trader</span>
                <span className="text-[10px] bg-[#6dff8a]/20 text-[#6dff8a] px-1.5 py-0.5 rounded font-bold">$100k Virtual</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] text-white/40 uppercase font-semibold">Or with email</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs text-white/70">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6dff8a]"
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
                <label className="flex items-start gap-2.5 text-[11px] text-[#a3a89e] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    className="accent-[#6dff8a] w-3.5 h-3.5 mt-0.5"
                  />
                  <span>
                    I confirm I have read and agree to the <strong>TradeShark Ltd Terms of Service</strong>, Risk Disclosures, and Privacy Policy.
                  </span>
                </label>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(109,255,138,0.25)] transition-all transform hover:scale-[1.01]"
              >
                <span>{mode === 'signup' ? 'Create TradeShark Account' : 'Log In to Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Toggle login / signup */}
            <div className="text-center text-xs text-[#a3a89e] pt-2">
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
  );
};
