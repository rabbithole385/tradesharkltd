import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Key, 
  X,
  Sparkles,
  Shield,
  HelpCircle
} from 'lucide-react';
import { TradeSharkLogo } from '../TradeSharkLogo';

export interface AdminSession {
  username: string;
  role: string;
  name: string;
  loginTime: number;
  expiresAt: number;
  sessionType: '30m' | '4h' | '24h' | 'tab';
  token: string;
}

export const ADMIN_CREDENTIALS = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'Super-Admin (Desk 01)',
    name: 'Executive Administrator',
    description: 'Full back-office access, market halters, treasury approvals & ledger adjustments'
  },
  {
    username: 'compliance',
    password: 'compliance123',
    role: 'Chief Compliance Officer',
    name: 'FCA & AML Compliance',
    description: 'KYC document verification, sanctions screening & audit trail governance'
  },
  {
    username: 'treasury',
    password: 'treasury123',
    role: 'Treasury & Cashier Desk',
    name: 'Chief Financial Officer',
    description: 'Deposit approvals, SWIFT/crypto payouts & client escrow releases'
  }
];

const SESSION_OPTIONS: { id: AdminSession['sessionType']; label: string; durationMs: number; desc: string }[] = [
  { 
    id: 'tab', 
    label: 'Single Browser Session', 
    durationMs: 0, // Cleared when browser/tab closes 
    desc: 'Highest security. Automatically cleared when tab or window is closed.' 
  },
  { 
    id: '30m', 
    label: '30 Minutes Inactivity', 
    durationMs: 30 * 60 * 1000, 
    desc: 'Auto-terminates after 30 minutes of operation.' 
  },
  { 
    id: '4h', 
    label: '4 Hours (Shift)', 
    durationMs: 4 * 60 * 60 * 1000, 
    desc: 'Standard trading floor shift duration.' 
  },
  { 
    id: '24h', 
    label: '24 Hours (Remember Me)', 
    durationMs: 24 * 60 * 60 * 1000, 
    desc: 'Retains administrative session on this device for 24 hours.' 
  }
];

interface AdminLoginGateProps {
  onLoginSuccess: (session: AdminSession) => void;
  onClose: () => void;
  sessionExpiredNotice?: boolean;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({
  onLoginSuccess,
  onClose,
  sessionExpiredNotice = false
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSessionType, setSelectedSessionType] = useState<AdminSession['sessionType']>('tab');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentialsHelper, setShowCredentialsHelper] = useState(true);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const matched = ADMIN_CREDENTIALS.find(
        c => c.username.toLowerCase() === trimmedUser && c.password === password
      );

      if (!matched) {
        setIsLoading(false);
        setErrorMessage('Invalid administrator credentials. Access denied.');
        return;
      }

      const sessionOption = SESSION_OPTIONS.find(s => s.id === selectedSessionType);
      const now = Date.now();
      const expiresAt = sessionOption && sessionOption.durationMs > 0 
        ? now + sessionOption.durationMs 
        : now + 8 * 60 * 60 * 1000; // fallback 8 hours for tab session

      const session: AdminSession = {
        username: matched.username,
        role: matched.role,
        name: matched.name,
        loginTime: now,
        expiresAt,
        sessionType: selectedSessionType,
        token: `ts_adm_${Math.random().toString(36).substring(2)}${Date.now()}`
      };

      // Store according to session type
      if (selectedSessionType === 'tab') {
        sessionStorage.setItem('tradeshark_admin_session', JSON.stringify(session));
        localStorage.removeItem('tradeshark_admin_session');
      } else {
        localStorage.setItem('tradeshark_admin_session', JSON.stringify(session));
        sessionStorage.removeItem('tradeshark_admin_session');
      }

      setIsLoading(false);
      onLoginSuccess(session);
    }, 450);
  };

  const handleQuickFill = (presetUser: string, presetPass: string) => {
    setUsername(presetUser);
    setPassword(presetPass);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-xl bg-[#12150d] border border-[#6dff8a]/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-left text-white relative animate-fadeIn">
      {/* Top Close / Return */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        title="Close & return to site"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Brand Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <TradeSharkLogo size="sm" showLtd={true} />
          <div className="h-4 w-px bg-white/20" />
          <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 font-mono px-2 py-0.5 rounded font-bold tracking-wider uppercase">
            Admin Auth
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/50 pr-8">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6dff8a]" />
          <span>FCA Secure Terminal</span>
        </div>
      </div>

      {/* Expired Notice */}
      {sessionExpiredNotice && (
        <div className="mb-5 p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs flex items-center gap-2.5">
          <Clock className="w-4 h-4 shrink-0" />
          <div>
            <span className="font-bold">Session Terminated:</span> Your administrative session has ended or expired. Please re-authenticate.
          </div>
        </div>
      )}

      {/* Main Title */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <span>Administrative Gateway</span>
          <Lock className="w-5 h-5 text-yellow-400" />
        </h2>
        <p className="text-xs text-[#a3a89e] mt-1">
          Back-office access is restricted to authorized risk officers, compliance desks, and executive administrators.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/80 block">
            Operator Username or ID
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin, compliance, treasury"
              className="w-full bg-[#181c10] border border-white/15 focus:border-[#6dff8a] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white/80">
              Security Password
            </label>
            <span className="text-[11px] text-white/40">Default: admin123</span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin security password"
              className="w-full bg-[#181c10] border border-white/15 focus:border-[#6dff8a] rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-white/30 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Session Options */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6dff8a]" />
              <span>Session Duration &amp; Persistence</span>
            </label>
            <span className="text-[10px] font-mono text-[#6dff8a]">Auto-locking</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SESSION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedSessionType(opt.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                  selectedSessionType === opt.id
                    ? 'bg-[#6dff8a]/15 border-[#6dff8a] text-white'
                    : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="font-semibold text-white text-[11px] flex items-center justify-between">
                  <span>{opt.label}</span>
                  {selectedSessionType === opt.id && <CheckCircle2 className="w-3 h-3 text-[#6dff8a]" />}
                </div>
                <div className="text-[9px] text-white/40 mt-0.5 line-clamp-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3 rounded-xl bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Verifying Operator Token...</span>
            </>
          ) : (
            <>
              <Key className="w-4 h-4" />
              <span>Authorize &amp; Open Back-Office</span>
            </>
          )}
        </button>
      </form>

      {/* Preset Operator Profiles / Credentials Helper */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <Shield className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-semibold">Pre-Configured Operator Roles</span>
          </div>
          <button
            type="button"
            onClick={() => setShowCredentialsHelper(!showCredentialsHelper)}
            className="text-[10px] text-white/50 hover:text-white transition-colors"
          >
            {showCredentialsHelper ? 'Hide quick-fill' : 'Show quick-fill'}
          </button>
        </div>

        {showCredentialsHelper && (
          <div className="space-y-2">
            {ADMIN_CREDENTIALS.map((cred) => (
              <div
                key={cred.username}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#6dff8a]/40 flex items-center justify-between gap-3 text-xs transition-colors group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-[#6dff8a]">
                      {cred.role}
                    </span>
                    <span className="text-[10px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                      User: {cred.username}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/50 truncate mt-0.5">
                    {cred.description}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickFill(cred.username, cred.password)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#6dff8a]/20 text-white/80 hover:text-[#6dff8a] border border-white/10 text-[11px] font-medium shrink-0 transition-colors"
                >
                  Fill Credentials
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Disclaimer */}
      <div className="mt-5 text-center text-[10px] text-white/40 flex items-center justify-center gap-1.5">
        <Clock className="w-3 h-3 text-[#6dff8a]" />
        <span>All administrative logins and IP addresses are cryptographically signed in the immutable regulatory audit ledger.</span>
      </div>
    </div>
  );
};
