import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserAccount, 
  FundingTransaction, 
  AuditLog, 
  UserPosition,
  UserTier,
  KycStatus,
  AccountStatus
} from '../types';

interface BrokerageContextType {
  users: UserAccount[];
  currentUser: UserAccount;
  setCurrentUserId: (id: string) => void;
  transactions: FundingTransaction[];
  auditLogs: AuditLog[];
  positions: UserPosition[];
  
  // User Management & Setup
  createUser: (userData: Omit<UserAccount, 'id' | 'joinedDate' | 'lastIp'>) => UserAccount;
  updateUser: (id: string, updates: Partial<UserAccount>) => void;
  setUserStatus: (id: string, status: AccountStatus, reason?: string) => void;
  toggleTradingPermission: (id: string, permission: 'allowTrading' | 'allowShorting' | 'allowCrypto') => void;
  updateUserTier: (id: string, tier: UserTier) => void;
  updateUserLeverage: (id: string, leverage: number) => void;
  
  // KYC & Compliance
  approveKyc: (id: string, promotedTier?: UserTier) => void;
  rejectKyc: (id: string, reason: string) => void;
  requestKycResubmit: (id: string, note: string) => void;
  updateAmlRisk: (id: string, risk: 'Low' | 'Medium' | 'High') => void;
  
  // Funding & Cashier
  approveFunding: (txId: string) => void;
  rejectFunding: (txId: string, reason: string) => void;
  manualBalanceAdjustment: (
    userId: string, 
    amount: number, 
    type: 'Admin Credit' | 'Admin Debit' | 'Bonus', 
    note: string
  ) => void;
  submitDeposit: (amount: number, method: FundingTransaction['method']) => void;
  submitWithdrawal: (amount: number, method: FundingTransaction['method'], destination: string) => boolean;
  
  // Positions
  closePosition: (posId: string) => void;
  openPosition: (symbol: string, name: string, type: 'BUY' | 'SELL', units: string, price: number, category: string) => void;
}

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'USR-891',
    name: 'Alex Mercer',
    email: 'alex.m@gmail.com',
    phone: '+44 7700 900142',
    country: 'United Kingdom',
    tier: 'Tier 2 - Verified Pro',
    currency: 'USD',
    realBalance: 104850.25,
    virtualBalance: 100000.00,
    kycStatus: 'Approved',
    kycDocType: 'Passport',
    kycDocNumber: 'GB-94821039',
    kycSubmittedDate: '2026-08-14 10:20',
    kycExpiryDate: '2032-05-11',
    facialMatchScore: 99.2,
    amlRisk: 'Low',
    pepWatchlistHit: false,
    status: 'Active',
    role: 'Trader',
    leverage: 100,
    allowTrading: true,
    allowShorting: true,
    allowCrypto: true,
    maxPositionLimit: 250000,
    joinedDate: '2026-07-10',
    lastIp: '185.122.4.92 (London, UK)',
    accountManager: 'David Sterling'
  },
  {
    id: 'USR-892',
    name: 'Sarah Jenkins',
    email: 'sjenkins@techcorp.io',
    phone: '+1 415 555 0198',
    country: 'United States',
    tier: 'Tier 3 - VIP Institutional',
    currency: 'USD',
    realBalance: 423000.00,
    virtualBalance: 250000.00,
    kycStatus: 'Approved',
    kycDocType: 'National ID',
    kycDocNumber: 'US-ID-992014',
    kycSubmittedDate: '2026-06-22 14:40',
    kycExpiryDate: '2030-10-18',
    facialMatchScore: 98.6,
    amlRisk: 'Low',
    pepWatchlistHit: false,
    status: 'Active',
    role: 'Pro Investor',
    leverage: 400,
    allowTrading: true,
    allowShorting: true,
    allowCrypto: true,
    maxPositionLimit: 1000000,
    joinedDate: '2026-05-15',
    lastIp: '64.104.22.10 (San Francisco, US)',
    accountManager: 'Victoria Sterling (VIP Desk)'
  },
  {
    id: 'USR-893',
    name: 'Liam Chen',
    email: 'liam.chen@outlook.com',
    phone: '+65 6789 0123',
    country: 'Singapore',
    tier: 'Tier 1 - Standard',
    currency: 'USD',
    realBalance: 15820.00,
    virtualBalance: 50000.00,
    kycStatus: 'Pending',
    kycDocType: 'Drivers License',
    kycDocNumber: 'SG-DL-882910',
    kycSubmittedDate: '2026-09-09 14:15',
    kycExpiryDate: '2029-01-30',
    facialMatchScore: 97.4,
    amlRisk: 'Low',
    pepWatchlistHit: false,
    status: 'Active',
    role: 'Trader',
    leverage: 30,
    allowTrading: true,
    allowShorting: false,
    allowCrypto: true,
    maxPositionLimit: 50000,
    joinedDate: '2026-09-08',
    lastIp: '118.189.34.12 (Singapore)',
    accountManager: 'Michael Wong'
  },
  {
    id: 'USR-894',
    name: 'Elena Rostov',
    email: 'e.rostov@proton.me',
    phone: '+49 151 2345678',
    country: 'Germany',
    tier: 'Tier 1 - Standard',
    currency: 'EUR',
    realBalance: 8450.00,
    virtualBalance: 10000.00,
    kycStatus: 'Under Review',
    kycDocType: 'Proof of Address',
    kycDocNumber: 'DE-POA-98124',
    kycSubmittedDate: '2026-09-08 09:30',
    facialMatchScore: 94.1,
    amlRisk: 'Medium',
    pepWatchlistHit: false,
    status: 'Trading Frozen',
    role: 'Trader',
    leverage: 30,
    allowTrading: false,
    allowShorting: false,
    allowCrypto: false,
    maxPositionLimit: 25000,
    joinedDate: '2026-09-07',
    lastIp: '194.12.88.5 (Berlin, Germany)',
    accountManager: 'David Sterling',
    kycNotes: 'Proof of residence utility bill older than 90 days. Awaiting refreshed copy.'
  },
  {
    id: 'USR-895',
    name: 'Tariq Al-Mansoor',
    email: 't.mansoor@gulfcap.ae',
    phone: '+971 4 888 9012',
    country: 'United Arab Emirates',
    tier: 'Tier 3 - VIP Institutional',
    currency: 'USD',
    realBalance: 850000.00,
    virtualBalance: 500000.00,
    kycStatus: 'Approved',
    kycDocType: 'Passport',
    kycDocNumber: 'AE-P-440192',
    kycSubmittedDate: '2026-04-10 11:00',
    kycExpiryDate: '2031-12-04',
    facialMatchScore: 99.8,
    amlRisk: 'Low',
    pepWatchlistHit: false,
    status: 'Active',
    role: 'VIP Client',
    leverage: 400,
    allowTrading: true,
    allowShorting: true,
    allowCrypto: true,
    maxPositionLimit: 2500000,
    joinedDate: '2026-04-01',
    lastIp: '86.96.229.1 (Dubai, UAE)',
    accountManager: 'Victoria Sterling (VIP Desk)'
  }
];

const INITIAL_TRANSACTIONS: FundingTransaction[] = [
  {
    id: 'TX-901',
    userId: 'USR-893',
    userName: 'Liam Chen',
    type: 'Deposit',
    amount: 25000,
    method: 'Bank Wire',
    status: 'Pending Approval',
    reference: 'WIRE-SG-99214',
    date: '2026-09-10 11:20',
    adminNote: 'Incoming SWIFT MT103 from DBS Bank Singapore. Client requested tier upgrade.'
  },
  {
    id: 'TX-902',
    userId: 'USR-892',
    userName: 'Sarah Jenkins',
    type: 'Deposit',
    amount: 50000,
    method: 'Crypto (USDT/BTC)',
    status: 'Pending Approval',
    reference: 'TX-USDT-0x89fa41c9',
    date: '2026-09-10 12:45',
    adminNote: 'USDT ERC20 on-chain deposit confirmed 24 blocks. Awaiting AML sanction scan.'
  },
  {
    id: 'TX-903',
    userId: 'USR-894',
    userName: 'Elena Rostov',
    type: 'Withdrawal',
    amount: 5000,
    method: 'SEPA Wire',
    status: 'Pending Approval',
    reference: 'WD-SEPA-81092',
    date: '2026-09-10 13:02',
    destination: 'IBAN: DE89 3704 0044 0532 0130 00 (Deutsche Bank)',
    adminNote: 'User trading is frozen; withdrawal requested to original source of funds.'
  },
  {
    id: 'TX-904',
    userId: 'USR-891',
    userName: 'Alex Mercer',
    type: 'Deposit',
    amount: 10000,
    method: 'Faster Payments',
    status: 'Approved / Settled',
    reference: 'FPS-UK-28471',
    date: '2026-09-09 16:30',
    adminNote: 'Auto-cleared through Modulr UK clearing rails.'
  },
  {
    id: 'TX-905',
    userId: 'USR-891',
    userName: 'Alex Mercer',
    type: 'Withdrawal',
    amount: 5000,
    method: 'Bank Wire',
    status: 'Approved / Settled',
    reference: 'WD-BARC-1948',
    date: '2026-09-08 10:14',
    destination: 'Barclays Bank UK Sort 20-00-00 Acc 84729103',
    adminNote: 'Cleared & authorized by David Sterling.'
  },
  {
    id: 'TX-906',
    userId: 'USR-895',
    userName: 'Tariq Al-Mansoor',
    type: 'Deposit',
    amount: 250000,
    method: 'Bank Wire',
    status: 'Approved / Settled',
    reference: 'WIRE-ENBD-7718',
    date: '2026-09-05 15:10',
    adminNote: 'Emirates NBD wire cleared. Tier 3 Institutional VIP credit.'
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-101',
    timestamp: '2026-09-10 13:28:40',
    adminUser: 'SuperAdmin (system)',
    action: 'Compliance Report',
    details: 'MiFID II RTS 28 Best Execution quarterly audit successfully compiled.',
    type: 'COMPLIANCE'
  },
  {
    id: 'LOG-102',
    timestamp: '2026-09-10 13:15:02',
    adminUser: 'Compliance Officer (J. Miller)',
    action: 'KYC Document Review',
    targetUser: 'USR-893 (Liam Chen)',
    details: 'Drivers license document queued for biometric and MRZ validation.',
    type: 'KYC'
  },
  {
    id: 'LOG-103',
    timestamp: '2026-09-10 12:48:15',
    adminUser: 'Treasury Desk (R. Thorne)',
    action: 'Crypto Deposit Flag',
    targetUser: 'USR-892 (Sarah Jenkins)',
    details: 'Crypto deposit $50,000.00 USDT received on cold address, awaiting 2-eye authorization.',
    type: 'FUNDING'
  },
  {
    id: 'LOG-104',
    timestamp: '2026-09-10 09:30:11',
    adminUser: 'Risk Officer (D. Sterling)',
    action: 'Account Restriction',
    targetUser: 'USR-894 (Elena Rostov)',
    details: 'Account status switched to Trading Frozen due to expired proof of address.',
    type: 'USER_MGMT'
  }
];

const INITIAL_POSITIONS: UserPosition[] = [
  {
    id: 'pos-1',
    userId: 'USR-891',
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    type: 'BUY',
    units: '45.8',
    entryPrice: 195.40,
    currentPrice: 218.15,
    profit: 1042.25,
    profitPercent: 11.64,
    category: 'stocks',
    openDate: '2026-09-02'
  },
  {
    id: 'pos-2',
    userId: 'USR-891',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'BUY',
    units: '0.42',
    entryPrice: 88200.00,
    currentPrice: 91420.00,
    profit: 1352.40,
    profitPercent: 3.65,
    category: 'crypto',
    openDate: '2026-09-04'
  },
  {
    id: 'pos-3',
    userId: 'USR-891',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    type: 'BUY',
    units: '30.0',
    entryPrice: 535.00,
    currentPrice: 546.80,
    profit: 354.00,
    profitPercent: 2.20,
    category: 'etfs',
    openDate: '2026-09-08'
  }
];

const BrokerageContext = createContext<BrokerageContextType | undefined>(undefined);

export const BrokerageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('USR-891');
  const [transactions, setTransactions] = useState<FundingTransaction[]>(INITIAL_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [positions, setPositions] = useState<UserPosition[]>(INITIAL_POSITIONS);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const addAuditLog = (action: string, details: string, type: AuditLog['type'], targetUser?: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      adminUser: 'SuperAdmin (Desk 01)',
      action,
      details,
      type,
      targetUser
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 1. Create User
  const createUser = (userData: Omit<UserAccount, 'id' | 'joinedDate' | 'lastIp'>): UserAccount => {
    const newId = `USR-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 10);
    const newUser: UserAccount = {
      ...userData,
      id: newId,
      joinedDate: nowStr,
      lastIp: '192.168.1.1 (Admin Provisioned)'
    };

    setUsers(prev => [newUser, ...prev]);

    addAuditLog(
      'User Provisioning', 
      `Created new account for ${newUser.name} (${newUser.email}) with ${newUser.tier}, Leverage 1:${newUser.leverage}, Balance $${newUser.realBalance.toLocaleString()}`, 
      'USER_MGMT', 
      `${newUser.id} (${newUser.name})`
    );

    // If initial deposit credited, create funding record
    if (newUser.realBalance > 0) {
      const tx: FundingTransaction = {
        id: `TX-${Date.now()}`,
        userId: newUser.id,
        userName: newUser.name,
        type: 'Admin Credit',
        amount: newUser.realBalance,
        method: 'Internal Transfer',
        status: 'Approved / Settled',
        reference: `INIT-${newId}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        adminNote: 'Initial account funding upon administrative setup.'
      };
      setTransactions(prev => [tx, ...prev]);
    }

    return newUser;
  };

  // 2. Update User
  const updateUser = (id: string, updates: Partial<UserAccount>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, ...updates };
        return updated;
      }
      return u;
    }));

    addAuditLog(
      'Account Update', 
      `Modified attributes for account: ${Object.keys(updates).join(', ')}`, 
      'USER_MGMT', 
      id
    );
  };

  // 3. Set User Status (Active, Suspended, Trading Frozen, AML Flagged)
  const setUserStatus = (id: string, status: AccountStatus, reason?: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status };
      }
      return u;
    }));

    addAuditLog(
      'Status Change', 
      `Account state updated to [${status}]. ${reason ? `Reason: ${reason}` : ''}`, 
      'USER_MGMT', 
      id
    );
  };

  // 4. Toggle Trading Permissions
  const toggleTradingPermission = (id: string, permission: 'allowTrading' | 'allowShorting' | 'allowCrypto') => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextVal = !u[permission];
        addAuditLog(
          'Trading Permissions', 
          `Permission [${permission}] changed to ${nextVal ? 'ENABLED' : 'RESTRICTED'}`, 
          'USER_MGMT', 
          u.name
        );
        return { ...u, [permission]: nextVal };
      }
      return u;
    }));
  };

  // 5. Update Tier
  const updateUserTier = (id: string, tier: UserTier) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog('Tier Escalation', `Upgraded trader to ${tier}`, 'USER_MGMT', u.name);
        return { ...u, tier };
      }
      return u;
    }));
  };

  // 6. Update Leverage
  const updateUserLeverage = (id: string, leverage: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog('Margin & Leverage', `Adjusted maximum account leverage to 1:${leverage}`, 'USER_MGMT', u.name);
        return { ...u, leverage };
      }
      return u;
    }));
  };

  // 7. KYC Approvals
  const approveKyc = (id: string, promotedTier?: UserTier) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextTier = promotedTier || (u.tier === 'Tier 1 - Standard' ? 'Tier 2 - Verified Pro' : u.tier);
        addAuditLog(
          'KYC Certified', 
          `Document identity verified. KYC status set to APPROVED. Account tier promoted to ${nextTier}.`, 
          'KYC', 
          u.name
        );
        return { 
          ...u, 
          kycStatus: 'Approved',
          tier: nextTier,
          allowTrading: true,
          status: u.status === 'Trading Frozen' ? 'Active' : u.status
        };
      }
      return u;
    }));
  };

  const rejectKyc = (id: string, reason: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog(
          'KYC Rejected', 
          `Verification documents declined. Reason: ${reason}`, 
          'KYC', 
          u.name
        );
        return { ...u, kycStatus: 'Rejected', kycNotes: reason };
      }
      return u;
    }));
  };

  const requestKycResubmit = (id: string, note: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog(
          'KYC Action Required', 
          `Requested resubmission from client: ${note}`, 
          'KYC', 
          u.name
        );
        return { ...u, kycStatus: 'Action Required', kycNotes: note };
      }
      return u;
    }));
  };

  const updateAmlRisk = (id: string, amlRisk: 'Low' | 'Medium' | 'High') => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addAuditLog('AML Risk Rating', `Client AML profile adjusted to ${amlRisk} risk`, 'COMPLIANCE', u.name);
        return { ...u, amlRisk };
      }
      return u;
    }));
  };

  // 8. Funding Approvals
  const approveFunding = (txId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'Pending Approval') {
        // Apply balance changes
        if (tx.type === 'Deposit') {
          setUsers(uList => uList.map(u => {
            if (u.id === tx.userId) {
              return { ...u, realBalance: u.realBalance + tx.amount };
            }
            return u;
          }));
          addAuditLog(
            'Deposit Cleared', 
            `Approved deposit of $${tx.amount.toLocaleString()} via ${tx.method} for ${tx.userName}. Funds credited to balance.`, 
            'FUNDING', 
            tx.userName
          );
        } else if (tx.type === 'Withdrawal') {
          // If withdrawal, funds are officially released and settled
          addAuditLog(
            'Withdrawal Authorized', 
            `Released wire disbursement of $${tx.amount.toLocaleString()} to destination [${tx.destination || tx.method}] for ${tx.userName}.`, 
            'FUNDING', 
            tx.userName
          );
        }
        return { ...tx, status: 'Approved / Settled' };
      }
      return tx;
    }));
  };

  const rejectFunding = (txId: string, reason: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId && tx.status === 'Pending Approval') {
        // If a withdrawal was rejected, return reserved balance back to user
        if (tx.type === 'Withdrawal') {
          setUsers(uList => uList.map(u => {
            if (u.id === tx.userId) {
              return { ...u, realBalance: u.realBalance + tx.amount };
            }
            return u;
          }));
        }

        addAuditLog(
          'Funding Rejected', 
          `Declined ${tx.type} request of $${tx.amount.toLocaleString()}. Reason: ${reason}`, 
          'FUNDING', 
          tx.userName
        );

        return { ...tx, status: 'Rejected', adminNote: reason };
      }
      return tx;
    }));
  };

  // 9. Manual Balance Adjustments (Admin Direct Credit/Debit/Bonus)
  const manualBalanceAdjustment = (
    userId: string, 
    amount: number, 
    type: 'Admin Credit' | 'Admin Debit' | 'Bonus', 
    note: string
  ) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const delta = type === 'Admin Debit' ? -amount : amount;
    const newBalance = Math.max(0, user.realBalance + delta);

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, realBalance: newBalance };
      }
      return u;
    }));

    const tx: FundingTransaction = {
      id: `TX-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      type,
      amount,
      method: 'Internal Transfer',
      status: 'Approved / Settled',
      reference: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminNote: note
    };

    setTransactions(prev => [tx, ...prev]);

    addAuditLog(
      `Balance ${type}`, 
      `Applied ${type} of $${amount.toLocaleString()} to ${user.name}. Previous: $${user.realBalance.toLocaleString()}, New: $${newBalance.toLocaleString()}. Reason: ${note}`, 
      'FUNDING', 
      user.name
    );
  };

  // 10. User Side: Submit Deposit
  const submitDeposit = (amount: number, method: FundingTransaction['method']) => {
    const tx: FundingTransaction = {
      id: `TX-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'Deposit',
      amount,
      method,
      status: 'Pending Approval', // Awaiting Admin Approval!
      reference: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adminNote: 'User initiated online deposit request. Awaiting compliance and funds clearance.'
    };

    setTransactions(prev => [tx, ...prev]);
    addAuditLog(
      'Deposit Submitted', 
      `Client requested deposit of $${amount.toLocaleString()} via ${method}. Added to admin approval queue.`, 
      'FUNDING', 
      currentUser.name
    );
  };

  // 11. User Side: Submit Withdrawal
  const submitWithdrawal = (amount: number, method: FundingTransaction['method'], destination: string): boolean => {
    if (amount > currentUser.realBalance) {
      return false;
    }

    // Deduct immediately into escrow
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, realBalance: u.realBalance - amount };
      }
      return u;
    }));

    const tx: FundingTransaction = {
      id: `TX-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'Withdrawal',
      amount,
      method,
      status: 'Pending Approval', // Awaiting Admin Approval!
      reference: `WD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      destination,
      adminNote: 'Client requested withdrawal. Escrow balance reserved.'
    };

    setTransactions(prev => [tx, ...prev]);
    addAuditLog(
      'Withdrawal Requested', 
      `Client submitted withdrawal of $${amount.toLocaleString()} to ${destination}. Funds locked in escrow pending admin release.`, 
      'FUNDING', 
      currentUser.name
    );

    return true;
  };

  // 12. Positions
  const closePosition = (posId: string) => {
    const pos = positions.find(p => p.id === posId);
    if (!pos) return;

    setPositions(prev => prev.filter(p => p.id !== posId));
    setUsers(prev => prev.map(u => {
      if (u.id === pos.userId) {
        return { ...u, realBalance: u.realBalance + pos.profit };
      }
      return u;
    }));

    addAuditLog(
      'Position Closed', 
      `Closed ${pos.units} ${pos.symbol} at $${pos.currentPrice}. Realized P&L: $${pos.profit.toFixed(2)}.`, 
      'MARKET', 
      pos.userId
    );
  };

  const openPosition = (symbol: string, name: string, type: 'BUY' | 'SELL', units: string, price: number, category: string) => {
    const newPos: UserPosition = {
      id: `pos-${Date.now()}`,
      userId: currentUser.id,
      symbol,
      name,
      type,
      units,
      entryPrice: price,
      currentPrice: price,
      profit: 0,
      profitPercent: 0,
      category,
      openDate: new Date().toISOString().substring(0, 10)
    };
    setPositions(prev => [newPos, ...prev]);
  };

  return (
    <BrokerageContext.Provider value={{
      users,
      currentUser,
      setCurrentUserId,
      transactions,
      auditLogs,
      positions,
      createUser,
      updateUser,
      setUserStatus,
      toggleTradingPermission,
      updateUserTier,
      updateUserLeverage,
      approveKyc,
      rejectKyc,
      requestKycResubmit,
      updateAmlRisk,
      approveFunding,
      rejectFunding,
      manualBalanceAdjustment,
      submitDeposit,
      submitWithdrawal,
      closePosition,
      openPosition
    }}>
      {children}
    </BrokerageContext.Provider>
  );
};

export const useBrokerage = (): BrokerageContextType => {
  const context = useContext(BrokerageContext);
  if (!context) {
    throw new Error('useBrokerage must be used within a BrokerageProvider');
  }
  return context;
};
