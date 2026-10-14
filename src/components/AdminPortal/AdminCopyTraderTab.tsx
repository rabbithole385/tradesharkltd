import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Save, Trash2, Eye, EyeOff, Users, TrendingUp, TrendingDown, StopCircle, Pencil, X } from 'lucide-react';
import { api, errMsg } from '../../lib/api';
import { useBrokerage } from '../../context/BrokerageContext';

interface AdminInvestor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  role: string;
  bio: string;
  return24M: number;
  copiers: number;
  baseCopiers: number;
  riskScore: number;
  topHoldings: string[];
  dailyTarget: number | null;
  active: boolean;
  activeCopies: number;
  liveChangePercent: number;
  sortOrder: number;
}

const EMPTY: Partial<AdminInvestor> = {
  name: '', handle: '', avatarUrl: '', role: 'Popular Investor', bio: '', return24M: 30, baseCopiers: 0, riskScore: 4,
  topHoldings: [], dailyTarget: null, active: true,
};

const money = (n: number) => `$${(Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const AdminCopyTraderTab: React.FC<{ onNotify: (msg: string) => void }> = ({ onNotify }) => {
  const { copies, users, refresh } = useBrokerage();
  const [investors, setInvestors] = useState<AdminInvestor[]>([]);
  const [editing, setEditing] = useState<Partial<AdminInvestor> | null>(null);
  const [busy, setBusy] = useState(false);
  const [adjust, setAdjust] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try { setInvestors((await api.get('/api/admin/investors')).investors); } catch (e) { onNotify(errMsg(e)); }
  }, [onNotify]);

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      const body = { ...editing, topHoldings: Array.isArray(editing.topHoldings) ? editing.topHoldings : String(editing.topHoldings || '') };
      const r = editing.id
        ? await api.put(`/api/admin/investors/${editing.id}`, body)
        : await api.post('/api/admin/investors', body);
      setInvestors(r.investors);
      setEditing(null);
      onNotify(editing.id ? 'Investor updated.' : 'Investor added.');
      refresh();
    } catch (e) { onNotify(errMsg(e)); } finally { setBusy(false); }
  };

  const toggle = async (inv: AdminInvestor) => {
    try {
      const r = await api.put(`/api/admin/investors/${inv.id}`, { active: !inv.active });
      setInvestors(r.investors);
      onNotify(inv.active ? `${inv.name} hidden from the website.` : `${inv.name} is now listed.`);
      refresh();
    } catch (e) { onNotify(errMsg(e)); }
  };

  const remove = async (inv: AdminInvestor) => {
    if (!window.confirm(`Delete ${inv.name}? Investors with active copiers are hidden instead.`)) return;
    try {
      const r = await api.del(`/api/admin/investors/${inv.id}`);
      setInvestors(r.investors);
      onNotify(r.hidden ? `${inv.name} has active copiers, so it was hidden instead of deleted.` : `${inv.name} deleted.`);
      refresh();
    } catch (e) { onNotify(errMsg(e)); }
  };

  const applyAdjust = async (copyId: string, mode: 'percent' | 'amount') => {
    const v = adjust[copyId];
    if (v === undefined || v === '') return onNotify('Enter a value first.');
    try {
      await api.post(`/api/admin/copies/${copyId}/adjust`, mode === 'percent' ? { profitPercent: Number(v) } : { amount: Number(v) });
      setAdjust(a => ({ ...a, [copyId]: '' }));
      onNotify('Copy P&L updated.');
      refresh();
    } catch (e) { onNotify(errMsg(e)); }
  };

  const forceStop = async (copyId: string, name: string) => {
    if (!window.confirm(`Close this copy of ${name} and return the funds to the client?`)) return;
    try { await api.post(`/api/admin/copies/${copyId}/stop`, {}); onNotify('Copy closed and funds returned.'); refresh(); load(); }
    catch (e) { onNotify(errMsg(e)); }
  };

  const userName = (id: string) => users.find(u => u.id === id)?.name || id;
  const field = (k: keyof AdminInvestor, label: string, type: 'text' | 'number' = 'text', placeholder = '') => (
    <label className="block text-[11px] text-white/60 space-y-1">
      <span>{label}</span>
      <input
        type={type}
        step="any"
        value={k === 'topHoldings' ? (Array.isArray(editing?.topHoldings) ? editing!.topHoldings.join(', ') : (editing?.topHoldings as any) || '') : (editing?.[k] as any) ?? ''}
        placeholder={placeholder}
        onChange={e => setEditing(ed => ({ ...ed, [k]: k === 'topHoldings' ? e.target.value : type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value }))}
        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
      />
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-[#6dff8a]" /> Popular Investors</h3>
          <p className="text-xs text-white/50">Everything here is live on the website. Performance moves every 10 seconds; copier counts include real copies.</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="px-4 py-2 rounded-lg bg-[#6dff8a] text-[#15170f] text-xs font-bold flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add investor
        </button>
      </div>

      {editing && (
        <div className="p-4 rounded-2xl border border-[#6dff8a]/30 bg-white/[0.03] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">{editing.id ? `Edit ${editing.name}` : 'New investor'}</h4>
            <button onClick={() => setEditing(null)} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {field('name', 'Name')}
            {field('handle', 'Handle', 'text', '@handle')}
            {field('role', 'Badge / role', 'text', 'Elite Pro Investor')}
            {field('avatarUrl', 'Photo URL', 'text', 'https://…')}
            {field('return24M', '24-month return %', 'number')}
            {field('riskScore', 'Risk score (1-10)', 'number')}
            {field('baseCopiers', 'Base copiers (shown + real copies)', 'number')}
            {field('dailyTarget', 'Daily performance % (blank = auto from 24M return)', 'number', 'e.g. 0.4')}
            {field('topHoldings', 'Top holdings (comma separated)', 'text', 'AAPL, MSFT, BTC')}
          </div>
          <label className="block text-[11px] text-white/60 space-y-1">
            <span>Bio</span>
            <textarea value={editing.bio || ''} onChange={e => setEditing(ed => ({ ...ed, bio: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs" />
          </label>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-white/70">
              <input type="checkbox" checked={editing.active !== false} onChange={e => setEditing(ed => ({ ...ed, active: e.target.checked }))} /> Listed on website
            </label>
            <button onClick={save} disabled={busy} className="px-4 py-2 rounded-lg bg-[#6dff8a] text-[#15170f] text-xs font-bold flex items-center gap-1.5 disabled:opacity-50">
              <Save className="w-4 h-4" /> {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-xs">
          <thead className="bg-white/5 text-white/50 text-left">
            <tr>
              <th className="p-3">Investor</th><th className="p-3">24M</th><th className="p-3">Live</th><th className="p-3">Risk</th>
              <th className="p-3">Copiers</th><th className="p-3">Active copies</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investors.map(inv => (
              <tr key={inv.id} className="border-t border-white/5 text-white/80">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <img src={inv.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover bg-white/10" />
                    <div><div className="font-semibold text-white">{inv.name}</div><div className="text-white/40">{inv.handle}</div></div>
                  </div>
                </td>
                <td className="p-3 text-[#6dff8a] font-mono">+{inv.return24M}%</td>
                <td className={`p-3 font-mono ${inv.liveChangePercent >= 0 ? 'text-[#6dff8a]' : 'text-red-400'}`}>
                  {inv.liveChangePercent >= 0 ? <TrendingUp className="inline w-3 h-3" /> : <TrendingDown className="inline w-3 h-3" />} {inv.liveChangePercent}%
                </td>
                <td className="p-3">{inv.riskScore}/10</td>
                <td className="p-3 font-mono">{inv.copiers.toLocaleString()}</td>
                <td className="p-3 font-mono">{inv.activeCopies}</td>
                <td className="p-3">{inv.active ? <span className="text-[#6dff8a]">Listed</span> : <span className="text-yellow-400">Hidden</span>}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <button title="Edit" onClick={() => setEditing({ ...inv })} className="p-1.5 rounded bg-white/5 hover:bg-white/10"><Pencil className="w-3.5 h-3.5" /></button>
                    <button title={inv.active ? 'Hide' : 'List'} onClick={() => toggle(inv)} className="p-1.5 rounded bg-white/5 hover:bg-white/10">{inv.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                    <button title="Delete" onClick={() => remove(inv)} className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-base font-bold text-white mb-2">Active client copies ({copies.length})</h3>
        {copies.length === 0 ? (
          <p className="text-xs text-white/50">No client is copying an investor right now.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-xs">
              <thead className="bg-white/5 text-white/50 text-left">
                <tr><th className="p-3">Client</th><th className="p-3">Copying</th><th className="p-3">Allocated</th><th className="p-3">Value</th><th className="p-3">P&L</th><th className="p-3">Adjust P&L</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {copies.map(c => (
                  <tr key={c.id} className="border-t border-white/5 text-white/80">
                    <td className="p-3">{userName(c.userId)}<div className="text-white/40">{c.userId}</div></td>
                    <td className="p-3">{c.name}</td>
                    <td className="p-3 font-mono">{money(c.allocated)}</td>
                    <td className="p-3 font-mono">{money(c.currentValue)}</td>
                    <td className={`p-3 font-mono ${c.profit >= 0 ? 'text-[#6dff8a]' : 'text-red-400'}`}>{c.profit >= 0 ? '+' : ''}{money(c.profit)} ({c.profitPercent}%)</td>
                    <td className="p-3">
                      <div className="flex gap-1 items-center">
                        <input value={adjust[c.id] || ''} onChange={e => setAdjust(a => ({ ...a, [c.id]: e.target.value }))} placeholder="value" className="w-20 px-2 py-1 rounded bg-black/40 border border-white/10 text-white" />
                        <button onClick={() => applyAdjust(c.id, 'percent')} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20" title="Set total P&L to this %">Set %</button>
                        <button onClick={() => applyAdjust(c.id, 'amount')} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20" title="Add (or subtract with -) this dollar amount">± $</button>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => forceStop(c.id, c.name)} className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-red-400" title="Close copy"><StopCircle className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
