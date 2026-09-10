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
