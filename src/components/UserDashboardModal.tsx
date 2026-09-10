import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  User, 
  Settings, 
  DollarSign,
  PlusCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { TradeSharkLogo } from './TradeSharkLogo';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string } | null;
  onOpenTrade: (symbol: string) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenTrade
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'portfolio' | 'positions' | 'copy' | 'deposit' | 'settings'>('portfolio');
  const [accountType, setAccountType] = useState<'virtual' | 'real'>('virtual');
  const [balance, setBalance] = useState(104850.25);
  const [depositAmount, setDepositAmount] = useState('5000');
  const [depositSuccess, setDepositSuccess] = useState(false);

  // Mock active user positions
  const [positions, setPositions] = useState([
    {
      id: 'p1',
      symbol: 'NVDA',
      name: 'NVIDIA Corp',
      type: 'BUY',
      units: '45.8',
      entryPrice: 195.40,
      currentPrice: 218.15,
      profit: 1042.25,
      profitPercent: 11.64,
      category: 'stocks'
    },
    {
      id: 'p2',
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'BUY',
      units: '0.42',
      entryPrice: 88200.00,
      currentPrice: 91420.00,
      profit: 1352.40,
      profitPercent: 3.65,
      category: 'crypto'
    },
    {
      id: 'p3',
      symbol: 'SPY',
      name: 'SPDR S&P 500 ETF',
      type: 'BUY',
      units: '30.0',
      entryPrice: 535.00,
      currentPrice: 546.80,
      profit: 354.00,
      profitPercent: 2.20,
      category: 'etfs'
    }
  ]);

  // Mock copied investors
  const [copiedInvestors, setCopiedInvestors] = useState([
    {
      id: 'c1',
      name: 'Rhys Adams',
      handle: '@rhys_adams',
      allocated: 4500,
      currentValue: 5642.10,
      profit: 1142.10,
      profitPercent: 25.38,
      riskScore: 4,
      status: 'Active'
    },
    {
      id: 'c2',
      name: 'Stefan Uleia',
      handle: '@stefan_uleia',
      allocated: 3000,
      currentValue: 3492.00,
      profit: 492.00,
      profitPercent: 16.40,
      riskScore: 5,
      status: 'Active'
    }
  ]);

  const handleClosePosition = (id: string) => {
    const pos = positions.find(p => p.id === id);
    if (!pos) return;
    setBalance(prev => prev + pos.profit);
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;
    setBalance(prev => prev + amt);
    setDepositSuccess(true);
    setTimeout(() => setDepositSuccess(false), 2500);
  };

  const totalPositionsProfit = positions.reduce((acc, p) => acc + p.profit, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-5xl h-[90vh] bg-[#14170e] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#191d12] flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <TradeSharkLogo size="sm" showLtd={true} />
            <div className="h-5 w-px bg-white/15" />
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white">Client Portal</span>
              <span className="text-[10px] bg-[#6dff8a]/15 text-[#6dff8a] border border-[#6dff8a]/30 px-2 py-0.5 rounded-full font-bold">
                USER DASHBOARD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Account Switcher: Real vs Virtual */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setAccountType('virtual')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  accountType === 'virtual' 
                    ? 'bg-[#6dff8a] text-[#15170f] shadow-sm' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                $100k Virtual
              </button>
              <button
                onClick={() => setAccountType('real')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  accountType === 'real' 
                    ? 'bg-[#6dff8a] text-[#15170f] shadow-sm' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Real Account
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Summary Subheader */}
        <div className="px-6 py-4 bg-[#171a10] border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6dff8a]/20 border border-[#6dff8a]/40 flex items-center justify-center text-[#6dff8a] font-bold text-sm">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'TS'}
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{user?.name || 'Verified Trader'}</span>
                <span className="flex items-center gap-1 text-[10px] text-[#6dff8a] bg-[#6dff8a]/10 px-2 py-0.5 rounded-full font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  Tier 2 Verified
                </span>
              </div>
              <div className="text-xs text-[#a3a89e]">{user?.email || 'trader@tradeshark.com'} • ID: #TS-948210</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] text-white/50 block">Net Portfolio Equity</span>
              <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                ${(balance + positions.reduce((a, b) => a + (b.units ? parseFloat(b.units) * b.currentPrice : 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-l border-white/10 pl-6 hidden sm:block">
              <span className="text-[11px] text-white/50 block">Total Unrealized P&amp;L</span>
              <span className="text-xl sm:text-2xl font-bold text-[#6dff8a] font-mono flex items-center gap-1">
                +${totalPositionsProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                <span className="text-xs bg-[#6dff8a]/15 px-1.5 py-0.5 rounded font-bold">+4.12%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#16180f] px-6 gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'portfolio'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Overview &amp; Wallet
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'positions'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <span>Open Positions</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-bold text-white">
              {positions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('copy')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'copy'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <span>CopyTrader™ Active</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#6dff8a]/20 text-[10px] font-bold text-[#6dff8a]">
              {copiedInvestors.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('deposit')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'deposit'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Deposit &amp; Transfer
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'border-[#6dff8a] text-[#6dff8a]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Account &amp; Security
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: PORTFOLIO OVERVIEW */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              {/* Asset Allocation Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-xs text-white/50 block">Available Cash</span>
                  <span className="text-2xl font-bold text-white font-mono">
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-[11px] text-[#6dff8a]">Earning 4.85% APY interest</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-xs text-white/50 block">Allocated in Positions</span>
                  <span className="text-2xl font-bold text-white font-mono">
                    ${positions.reduce((a, b) => a + (parseFloat(b.units) * b.entryPrice), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-[11px] text-white/60">{positions.length} active market orders</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-xs text-white/50 block">Allocated to CopyTrader™</span>
                  <span className="text-2xl font-bold text-[#6dff8a] font-mono">
                    ${copiedInvestors.reduce((a, b) => a + b.currentValue, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-[11px] text-[#6dff8a]">+$1,634.10 combined profit</div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onOpenTrade('NVDA')}
                  className="px-5 py-2.5 rounded-full bg-[#6dff8a] text-[#15170f] font-bold text-xs flex items-center gap-2 hover:bg-[#5ce077] transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Trade Stocks &amp; Crypto</span>
                </button>
                <button
                  onClick={() => setActiveTab('deposit')}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 border border-white/15 transition-colors"
                >
                  <ArrowDownLeft className="w-4 h-4 text-[#6dff8a]" />
                  <span>Add Funds</span>
                </button>
                <button
                  onClick={() => setActiveTab('copy')}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 border border-white/15 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#6dff8a]" />
                  <span>Manage CopyTrader</span>
                </button>
              </div>

              {/* Recent Orders Overview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Recent Open Positions</h4>
                  <button 
                    onClick={() => setActiveTab('positions')} 
                    className="text-xs text-[#6dff8a] hover:underline"
                  >
                    View all positions ({positions.length})
                  </button>
                </div>

                <div className="border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/10">
                  {positions.map((pos) => (
                    <div key={pos.id} className="p-4 bg-black/30 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                          {pos.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{pos.symbol}</span>
                            <span className="text-[10px] bg-[#6dff8a]/10 text-[#6dff8a] px-2 py-0.2 rounded font-bold">
                              {pos.type}
                            </span>
                          </div>
                          <span className="text-xs text-white/50">{pos.name} • {pos.units} units</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm font-bold text-white font-mono">
                            ${(parseFloat(pos.units) * pos.currentPrice).toFixed(2)}
                          </div>
                          <div className="text-xs font-semibold text-[#6dff8a]">
                            +${pos.profit.toFixed(2)} (+{pos.profitPercent}%)
                          </div>
                        </div>

                        <button
                          onClick={() => handleClosePosition(pos.id)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#ff5c5c]/20 hover:text-[#ff5c5c] text-xs font-semibold text-white/80 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL OPEN POSITIONS */}
          {activeTab === 'positions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Open Market Positions</h3>
                  <p className="text-xs text-[#a3a89e]">Manage active trades, take profits, or adjust stop-loss limits.</p>
                </div>
                <button
                  onClick={() => onOpenTrade('NVDA')}
                  className="px-4 py-2 rounded-xl bg-[#6dff8a] text-[#15170f] font-bold text-xs"
                >
                  + Open New Trade
                </button>
              </div>

              {positions.length === 0 ? (
                <div className="py-12 text-center text-white/60 space-y-3">
                  <Layers className="w-10 h-10 mx-auto text-white/30" />
                  <p className="text-sm">No open positions currently active.</p>
                  <button
                    onClick={() => onOpenTrade('BTC')}
                    className="px-4 py-2 rounded-full bg-[#6dff8a] text-[#15170f] font-bold text-xs"
                  >
                    Start Trading
                  </button>
                </div>
              ) : (
                <div className="border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#1a1d13] text-white/50 uppercase border-b border-white/10 font-mono text-[10px]">
                        <tr>
                          <th className="p-3.5">Asset</th>
                          <th className="p-3.5">Side</th>
                          <th className="p-3.5">Units</th>
                          <th className="p-3.5">Entry Price</th>
                          <th className="p-3.5">Current Price</th>
                          <th className="p-3.5">Total Value</th>
                          <th className="p-3.5">Profit / Loss</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 bg-black/20">
                        {positions.map((pos) => (
                          <tr key={pos.id} className="hover:bg-white/[0.02]">
                            <td className="p-3.5 font-bold text-white flex items-center gap-2">
                              <span>{pos.symbol}</span>
                              <span className="text-white/40 font-normal truncate max-w-[90px]">{pos.name}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="text-[10px] font-bold bg-[#6dff8a]/20 text-[#6dff8a] px-2 py-0.5 rounded">
                                {pos.type}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono">{pos.units}</td>
                            <td className="p-3.5 font-mono">${pos.entryPrice.toFixed(2)}</td>
                            <td className="p-3.5 font-mono font-bold">${pos.currentPrice.toFixed(2)}</td>
                            <td className="p-3.5 font-mono">${(parseFloat(pos.units) * pos.currentPrice).toFixed(2)}</td>
                            <td className="p-3.5 font-mono font-bold text-[#6dff8a]">
                              +${pos.profit.toFixed(2)} (+{pos.profitPercent}%)
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleClosePosition(pos.id)}
                                className="px-3 py-1 rounded bg-[#ff5c5c]/20 hover:bg-[#ff5c5c] text-[#ff5c5c] hover:text-white font-bold text-[11px] transition-colors"
                              >
                                Close Trade
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COPYTRADER ALLOCATIONS */}
          {activeTab === 'copy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">CopyTrader™ Portfolio</h3>
                  <p className="text-xs text-[#a3a89e]">Real-time Pro Investors mirrored in your TradeShark account.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {copiedInvestors.map((inv) => (
                  <div key={inv.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#6dff8a]/20 border border-[#6dff8a]/40 flex items-center justify-center font-bold text-white text-sm">
                          {inv.name.slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{inv.name}</h4>
                          <span className="text-xs text-white/50">{inv.handle}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#6dff8a]/20 text-[#6dff8a] text-[10px] font-bold">
                        {inv.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 text-xs">
                      <div>
                        <span className="text-white/40 block text-[10px]">Allocated:</span>
                        <span className="font-bold text-white font-mono">${inv.allocated.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px]">Current Value:</span>
                        <span className="font-bold text-white font-mono">${inv.currentValue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px]">Profit:</span>
                        <span className="font-bold text-[#6dff8a] font-mono">+{inv.profitPercent}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-white/50">Risk Score: <strong>{inv.riskScore} / 10</strong></span>
                      <button
                        onClick={() => {
                          setBalance(prev => prev + inv.currentValue);
                          setCopiedInvestors(prev => prev.filter(c => c.id !== inv.id));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#ff5c5c]/20 hover:text-[#ff5c5c] text-xs font-bold transition-colors"
                      >
                        Stop Copying
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DEPOSIT & TRANSFER */}
          {activeTab === 'deposit' && (
            <div className="max-w-md mx-auto space-y-6 py-4">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">Fund your TradeShark Account</h3>
                <p className="text-xs text-[#a3a89e]">Instant zero-fee deposits via Bank Transfer, Card, or Apple Pay.</p>
              </div>

              {depositSuccess ? (
                <div className="p-6 rounded-2xl bg-[#6dff8a]/15 border border-[#6dff8a]/40 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#6dff8a] mx-auto" />
                  <h4 className="text-lg font-bold text-white">Deposit Successful!</h4>
                  <p className="text-xs text-white/80">
                    Added <strong>${depositAmount}</strong> to your account balance. Your updated balance is <strong>${balance.toLocaleString()}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDeposit} className="space-y-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/70">Deposit Amount ($USD)</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-[#6dff8a] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        required
                        min="50"
                        step="50"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-4 py-3 text-white font-bold text-base focus:outline-none focus:border-[#6dff8a]"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      {['500', '1000', '5000', '10000'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDepositAmount(amt)}
                          className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 border border-white/5"
                        >
                          +${amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs text-white/70 block">Payment Method</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl border border-[#6dff8a] bg-[#6dff8a]/10 text-xs font-bold text-white flex items-center justify-between">
                        <span>Instant Bank Wire</span>
                        <CheckCircle2 className="w-4 h-4 text-[#6dff8a]" />
                      </div>
                      <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white/70 flex items-center justify-between">
                        <span>Debit / Visa / MC</span>
                        <span className="text-[10px] text-white/40">0% fee</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#6dff8a] hover:bg-[#5ce077] text-[#15170f] font-bold text-sm shadow-[0_0_20px_rgba(109,255,138,0.25)] transition-all"
                  >
                    Confirm Deposit of ${depositAmount}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: ACCOUNT & SECURITY */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <h4 className="font-bold text-white text-sm">Regulatory &amp; Identity Status</h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40">
                    <div>
                      <div className="font-bold text-white">Tier 2 KYC Identity Verification</div>
                      <div className="text-white/50">Passport &amp; Proof of Address Approved</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#6dff8a]/20 text-[#6dff8a] font-bold text-[11px]">
                      PASSED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40">
                    <div>
                      <div className="font-bold text-white">Two-Factor Authentication (2FA)</div>
                      <div className="text-white/50">Authenticator App enabled</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#6dff8a]/20 text-[#6dff8a] font-bold text-[11px]">
                      ENABLED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40">
                    <div>
                      <div className="font-bold text-white">Investor Protection Guarantee</div>
                      <div className="text-white/50">FSCS insured up to £85,000 + Lloyd's $1,000,000 policy</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#6dff8a]/20 text-[#6dff8a] font-bold text-[11px]">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
