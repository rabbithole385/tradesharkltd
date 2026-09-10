export interface Instrument {
  id: string | number;
  symbol: string;
  name: string;
  category: 'stocks' | 'etfs' | 'crypto' | 'commodities' | 'indices' | 'currencies';
  price: number;
  deltaPercent: number;
  currency: string;
  avatarBg: string;
  marketCap?: string;
  volume24h?: string;
}

export interface PopularInvestor {
  id: string | number;
  name: string;
  handle: string;
  avatarUrl: string;
  role: string;
  bio: string;
  return24M: number;
  copiers: number;
  riskScore: number;
  topHoldings: string[];
}

export interface AiSlide {
  id: number;
  headline: string;
  tagline: string;
  bullets: string[];
  ctaText: string;
  ctaAction?: string;
  imageAlt: string;
  previewType: 'chat' | 'agent' | 'custom';
}

export interface NavDropdownItem {
  title: string;
  items: {
    label: string;
    href: string;
    badge?: string;
  }[];
}

export type UserTier = 'Tier 1 - Standard' | 'Tier 2 - Verified Pro' | 'Tier 3 - VIP Institutional';
export type KycStatus = 'Approved' | 'Pending' | 'Under Review' | 'Action Required' | 'Rejected';
export type AccountStatus = 'Active' | 'Suspended' | 'Trading Frozen' | 'AML Flagged';
export type AmlRiskLevel = 'Low' | 'Medium' | 'High';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  tier: UserTier;
  currency: 'USD' | 'EUR' | 'GBP';
  realBalance: number;
  virtualBalance: number;
  kycStatus: KycStatus;
  kycDocType: 'Passport' | 'National ID' | 'Drivers License' | 'Proof of Address';
  kycDocNumber: string;
  kycSubmittedDate: string;
  kycExpiryDate?: string;
  kycNotes?: string;
  facialMatchScore?: number;
  amlRisk: AmlRiskLevel;
  pepWatchlistHit: boolean;
  status: AccountStatus;
  role: 'Trader' | 'Pro Investor' | 'VIP Client';
  leverage: number; // e.g. 30, 100, 400
  allowTrading: boolean;
  allowShorting: boolean;
  allowCrypto: boolean;
  maxPositionLimit: number;
  joinedDate: string;
  lastIp: string;
  accountManager: string;
}

export interface FundingTransaction {
  id: string;
  userId: string;
  userName: string;
  type: 'Deposit' | 'Withdrawal' | 'Admin Credit' | 'Admin Debit' | 'Bonus';
  amount: number;
  method: 'Bank Wire' | 'Crypto (USDT/BTC)' | 'Debit/Credit Card' | 'Faster Payments' | 'SEPA Wire' | 'Internal Transfer';
  status: 'Pending Approval' | 'Approved / Settled' | 'Rejected' | 'Under Review';
  reference: string;
  date: string;
  adminNote?: string;
  destination?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  targetUser?: string;
  details: string;
  type: 'USER_MGMT' | 'FUNDING' | 'KYC' | 'MARKET' | 'COMPLIANCE';
}

export interface UserPosition {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  units: string;
  entryPrice: number;
  currentPrice: number;
  profit: number;
  profitPercent: number;
  category: string;
  openDate: string;
}
