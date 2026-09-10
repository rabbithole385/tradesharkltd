import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Users, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  FileText, 
  RefreshCw, 
  Search, 
  Lock,
  ArrowUpRight,
  Database,
  BarChart3,
  Edit2
} from 'lucide-react';
import { TradeSharkLogo } from './TradeSharkLogo';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'markets' | 'users' | 'pro' | 'compliance'>('overview');
  const [notification, setNotification] = useState<string | null>(null);

  // Mock Admin Markets State
  const [marketAssets, setMarketAssets] = useState([
    { symbol: 'NVDA', name: 'NVIDIA Corp', category: 'Stocks', price: 218.15, spread: '0.02%', status: 'Active', halted: false },
    { symbol: 'BTC', name: 'Bitcoin', category: 'Crypto', price: 91420.00, spread: '0.30%', status: 'Active', halted: false },
    { symbol: 'SPY', name: 'S&P 500 ETF', category: 'ETFs', price: 546.80, spread: '0.00%', status: 'Active', halted: false },
    { symbol: 'TSLA', name: 'Tesla Motors', category: 'Stocks', price: 428.37, spread: '0.04%', status: 'Active', halted: false },
    { symbol: 'GOLD', name: 'Gold Bullion', category: 'Commodities', price: 2748.50, spread: '0.05%', status: 'Active', halted: false },
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Currencies', price: 1.0842, spread: '0.01%', status: 'Active', halted: false },
  ]);

  // Mock Admin Users State
  const [usersList, setUsersList] = useState([
    { id: 'USR-891', name: 'Alex Mercer', email: 'alex.m@gmail.com', balance: '$104,850.25', kycStatus: 'Approved', role: 'Trader', active: true },
    { id: 'USR-892', name: 'Sarah Jenkins', email: 'sjenkins@techcorp.io', balance: '$42,300.00', kycStatus: 'Approved', role: 'Pro Investor', active: true },
    { id: 'USR-893', name: 'Liam Chen', email: 'liam.chen@outlook.com', balance: '$15,820.00', kycStatus: 'Pending', role: 'Trader', active: true },
    { id: 'USR-894', name: 'Elena Rostov', email: 'e.rostov@proton.me', balance: '$8,450.00', kycStatus: 'Under Review', role: 'Trader', active: false },
  ]);

  // Mock CopyTrader Pro candidates
  const [proCandidates, setProCandidates] = useState([
    { id: 'pro-1', name: 'Marcus Vance', return24M: '+78.4%', riskScore: 4, copiersRequest: 410, status: 'Pending Review' },
    { id: 'pro-2', name: 'Klara Lindqvist', return24M: '+52.1%', riskScore: 3, copiersRequest: 890, status: 'Approved' }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleHalt = (symbol: string) => {
    setMarketAssets(prev => prev.map(a => {
      if (a.symbol === symbol) {
        const nextHalted = !a.halted;
        showToast(`Asset ${symbol} trading ${nextHalted ? 'HALTED' : 'RESUMED'}`);
        return { ...a, halted: nextHalted, status: nextHalted ? 'Halted' : 'Active' };
      }
      return a;
    }));
  };

  const toggleUserStatus = (id: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        const nextActive = !u.active;
        showToast(`User ${u.name} status updated to ${nextActive ? 'Active' : 'Suspended'}`);
        return { ...u, active: nextActive };
      }
      return u;
    }));
  };

  const approveKyc = (id: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        showToast(`KYC Approved for ${u.name}`);
        return { ...u, kycStatus: 'Approved' };
      }
      return u;
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-6xl h-[90vh] bg-[#12140d] border border-[#6dff8a]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Notification Toast */}
        {notification && (
          <div className="bg-[#1b2b18] border-b border-[#6dff8a]/40 text-white px-4 py-2 text-xs text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6dff8a] animate-ping" />
            <span className="font-semibold">{notification}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#161a0f] flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <TradeSharkLogo size="sm" showLtd={true} />
            <div className="h-5 w-px bg-white/15" />
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-white">Management Console</span>
              <span className="text-[10px] bg-[#6dff8a] text-[#15170f] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                SUPER ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#6dff8a]" />
              <span>Liquidity Engine: <strong>Operational</strong> (12ms)</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#14170d] px-6 gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Platform Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('markets')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'markets'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Market &amp; Asset Controls</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users &amp; KYC Verification</span>
          </button>
          <button
            onClick={() => setActiveTab('pro')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'pro'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>CopyTrader™ Master</span>
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'compliance'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Regulatory Audit Logs</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: PLATFORM OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-xs text-white/50 block">24h Gross Trading Volume</span>
                  <span className="text-2xl font-bold text-white font-mono">$842,610,940</span>
                  <span className="text-[11px] text-[#6dff8a] block">+14.2% vs previous day</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-xs text-white/50 block">Total Registered Traders</span>
                  <span className="text-2xl font-bold text-white font-mono">40,184,219</span>
                  <span className="text-[11px] text-white/60 block">75 active licensed jurisdictions</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-xs text-white/50 block">Segregated Reserve Ratio</span>
                  <span className="text-2xl font-bold text-[#6dff8a] font-mono">108.4%</span>
                  <span className="text-[11px] text-[#6dff8a] block">Barclays &amp; BNY Mellon tier 1</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-xs text-white/50 block">KYC Queued Reviews</span>
                  <span className="text-2xl font-bold text-white font-mono">342</span>
                  <span className="text-[11px] text-yellow-400 block">Avg turnaround 3.2 minutes</span>
                </div>
              </div>

              {/* Server Nodes & Infrastructure Health */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">TradeShark Core Infrastructure Status</h4>
                  <span className="text-xs text-[#6dff8a] font-mono">ALL SYSTEMS NOMINAL</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Matching Engine (LD4 London)</div>
                      <div className="text-white/40">Latency: 1.4ms • 99.999% uptime</div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6dff8a]" />
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Crypto Cold Vaults (Fireblocks)</div>
                      <div className="text-white/40">Multi-sig HSM active • Insured</div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6dff8a]" />
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">FCA / CySEC MiFID II Feed</div>
                      <div className="text-white/40">Real-time reporting connected</div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6dff8a]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MARKET & ASSET CONTROLS */}
          {activeTab === 'markets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Market Asset Administration</h3>
                  <p className="text-xs text-[#a3a89e]">Halt trading, adjust spreads, or inspect instrument liquidity.</p>
                </div>
                <button
                  onClick={() => showToast('All asset prices synced with Thomson Reuters & Bloomberg feeds.')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#6dff8a]" />
                  <span>Sync Feeds</span>
                </button>
              </div>

              <div className="border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181b11] text-white/50 uppercase border-b border-white/10 font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">Asset</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Live Price</th>
                      <th className="p-3.5">Spread Markup</th>
                      <th className="p-3.5">Trading Status</th>
                      <th className="p-3.5 text-right">Emergency Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-black/20">
                    {marketAssets.map((asset) => (
                      <tr key={asset.symbol} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 font-bold text-white flex items-center gap-2">
                          <span>{asset.symbol}</span>
                          <span className="text-white/40 font-normal">{asset.name}</span>
                        </td>
                        <td className="p-3.5 text-white/70">{asset.category}</td>
                        <td className="p-3.5 font-mono font-bold text-white">${asset.price.toLocaleString()}</td>
                        <td className="p-3.5 font-mono text-[#6dff8a]">{asset.spread}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            asset.halted ? 'bg-[#ff5c5c]/20 text-[#ff5c5c]' : 'bg-[#6dff8a]/20 text-[#6dff8a]'
                          }`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => toggleHalt(asset.symbol)}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                              asset.halted 
                                ? 'bg-[#6dff8a] text-[#15170f]' 
                                : 'bg-[#ff5c5c]/20 hover:bg-[#ff5c5c] text-[#ff5c5c] hover:text-white'
                            }`}
                          >
                            {asset.halted ? 'Resume Trading' : 'Halt Trading'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: USERS & KYC VERIFICATION */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">User Accounts &amp; KYC Verification</h3>
                  <p className="text-xs text-[#a3a89e]">Review identification documents and regulate trader permissions.</p>
                </div>
              </div>

              <div className="border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181b11] text-white/50 uppercase border-b border-white/10 font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">User ID</th>
                      <th className="p-3.5">Trader Name</th>
                      <th className="p-3.5">Balance</th>
                      <th className="p-3.5">KYC Status</th>
                      <th className="p-3.5">Account State</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-black/20">
                    {usersList.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 font-mono text-white/50">{user.id}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-[11px] text-white/40">{user.email}</div>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-white">{user.balance}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.kycStatus === 'Approved' 
                              ? 'bg-[#6dff8a]/20 text-[#6dff8a]' 
                              : 'bg-yellow-400/20 text-yellow-400'
                          }`}>
                            {user.kycStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.active ? 'bg-white/10 text-white' : 'bg-[#ff5c5c]/20 text-[#ff5c5c]'
                          }`}>
                            {user.active ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          {user.kycStatus !== 'Approved' && (
                            <button
                              onClick={() => approveKyc(user.id)}
                              className="px-2.5 py-1 rounded bg-[#6dff8a]/20 hover:bg-[#6dff8a] text-[#6dff8a] hover:text-[#15170f] text-[11px] font-bold transition-colors"
                            >
                              Approve KYC
                            </button>
                          )}
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                              user.active 
                                ? 'bg-white/10 hover:bg-[#ff5c5c]/20 hover:text-[#ff5c5c] text-white/70' 
                                : 'bg-[#6dff8a] text-[#15170f]'
                            }`}
                          >
                            {user.active ? 'Suspend' : 'Reactivate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: COPYTRADER MASTER */}
          {activeTab === 'pro' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Pro Investor Directory Moderation</h3>
                  <p className="text-xs text-[#a3a89e]">Approve and evaluate traders permitted to receive public copier funds.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proCandidates.map((pro) => (
                  <div key={pro.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">{pro.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6dff8a]/20 text-[#6dff8a]">
                        {pro.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs bg-black/40 p-3 rounded-xl">
                      <div>
                        <span className="text-white/40 block text-[10px]">24M Return:</span>
                        <span className="font-bold text-[#6dff8a] font-mono">{pro.return24M}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px]">Risk Score:</span>
                        <span className="font-bold text-white font-mono">{pro.riskScore} / 10</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px]">Pending Copiers:</span>
                        <span className="font-bold text-white font-mono">{pro.copiersRequest}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => showToast(`Audit complete for ${pro.name}. Profile certified.`)}
                        className="px-3 py-1.5 rounded-lg bg-[#6dff8a] text-[#15170f] font-bold text-xs"
                      >
                        Certify Pro Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REGULATORY AUDIT LOGS */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Regulatory Audit Trail &amp; Filings</h3>
                  <p className="text-xs text-[#a3a89e]">FCA, CySEC &amp; ASIC automated daily compliance log exports.</p>
                </div>
                <button
                  onClick={() => showToast('Generated MiFID II RTS 28 Best Execution PDF report.')}
                  className="px-4 py-2 rounded-xl bg-[#6dff8a] text-[#15170f] font-bold text-xs"
                >
                  Export RTS 28 Report
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-white/80 space-y-2 max-h-72 overflow-y-auto">
                <div className="text-[#6dff8a]">[2026-09-10 13:28:40] FCA BEST EXECUTION REPORT #TR-9041 GENERATED</div>
                <div>[2026-09-10 13:22:15] Segregated Client Trust Account Reconciliation: Balanced ($842.6M)</div>
                <div>[2026-09-10 13:15:02] CySEC Investor Compensation Fund (ICF) Assessment: Compliant</div>
                <div>[2026-09-10 12:44:11] Fireblocks Vault Rebalance: 1,400 BTC shifted to cold offline storage</div>
                <div>[2026-09-10 12:01:00] Daily Market Close Settled: Zero client margin deficits reported</div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
