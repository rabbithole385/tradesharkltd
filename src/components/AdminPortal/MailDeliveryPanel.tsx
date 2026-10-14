import React, { useEffect, useState } from 'react';
import { Send, ServerCog, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api, errMsg } from '../../lib/api';

/** Shows which email provider is live and lets the admin send a real test email. */
export const MailDeliveryPanel: React.FC = () => {
  const [status, setStatus] = useState<{ providers: string[]; status: string; resend?: string; fromAddress: string; loginOtp: boolean } | null>(null);
  const [to, setTo] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    api.get('/api/admin/mail/status').then(setStatus).catch(e => setResult({ ok: false, text: errMsg(e) }));
  }, []);

  const test = async () => {
    setBusy(true);
    setResult(null);
    try {
      const r = await api.post('/api/admin/mail/test', { to });
      setResult({ ok: true, text: r.message });
    } catch (e) {
      setResult({ ok: false, text: errMsg(e) });
    } finally {
      setBusy(false);
    }
  };

  const noProvider = status && status.providers.length === 0;

  return (
    <div className={`p-4 rounded-2xl border text-xs space-y-3 ${noProvider ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-white/10 bg-white/[0.03]'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-white font-semibold">
          <ServerCog className="w-4 h-4 text-[#6dff8a]" /> Email delivery
        </div>
        {status && (
          <span className="text-white/60">
            Provider: <span className="text-white font-mono">{status.providers.length ? status.providers.join(' → ') : 'none'}</span>
            {' · '}From: <span className="text-white font-mono">{status.fromAddress}</span>
            {' · '}Login OTP: <span className={status.loginOtp ? 'text-[#6dff8a]' : 'text-yellow-400'}>{status.loginOtp ? 'on' : 'off'}</span>
          </span>
        )}
      </div>
      {status?.resend && (
        <div className={`flex items-start gap-2 ${status.resend.startsWith('ready') ? 'text-[#6dff8a]' : 'text-yellow-300'}`}>
          {status.resend.startsWith('ready') ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>Resend: {status.resend}</span>
        </div>
      )}
      {noProvider && (
        <div className="flex items-start gap-2 text-yellow-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>No email provider is set, so clients will not receive login codes or notifications. Add <b>RESEND_API_KEY</b> in Railway → Variables — the sender address is picked automatically from your verified Resend domain.</span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <input
          value={to}
          onChange={e => setTo(e.target.value)}
          placeholder="Send a test email to…"
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
        />
        <button onClick={test} disabled={busy} className="px-4 py-2 rounded-lg bg-[#6dff8a] text-[#15170f] font-bold flex items-center gap-1.5 disabled:opacity-50">
          <Send className="w-3.5 h-3.5" /> {busy ? 'Sending…' : 'Send test'}
        </button>
      </div>
      {result && (
        <div className={`flex items-start gap-2 break-all ${result.ok ? 'text-[#6dff8a]' : 'text-red-400'}`}>
          {result.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{result.text}</span>
        </div>
      )}
    </div>
  );
};
