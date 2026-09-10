/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { PricingSection } from './components/PricingSection';
import { ProductRange } from './components/ProductRange';
import { PopularInvestors } from './components/PopularInvestors';
import { AiProducts } from './components/AiProducts';
import { TrustSafety } from './components/TrustSafety';
import { SponsorshipStrip } from './components/SponsorshipStrip';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';

// Modals
import { SearchModal } from './components/SearchModal';
import { TradeModal } from './components/TradeModal';
import { CopyModal } from './components/CopyModal';
import { AuthModal } from './components/AuthModal';
import { AiChatDrawer } from './components/AiChatDrawer';
import { UserDashboardModal } from './components/UserDashboardModal';
import { AdminPortalModal } from './components/AdminPortalModal';

import { Instrument, PopularInvestor } from './types';
import { INSTRUMENTS } from './data/mockData';
import { MessageSquare, ArrowUp, ArrowRight, ShieldCheck, Users } from 'lucide-react';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [tradeInstrument, setTradeInstrument] = useState<Instrument | null>(null);
  const [copyInvestor, setCopyInvestor] = useState<PopularInvestor | null>(null);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'signup'
  });
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMobileStickyCta, setShowMobileStickyCta] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      setShowMobileStickyCta(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenTradeForSymbol = (symbol: string) => {
    const found = INSTRUMENTS.find(i => i.symbol.toLowerCase() === symbol.toLowerCase()) || INSTRUMENTS[0];
    setIsAiChatOpen(false);
    setTradeInstrument(found);
  };

  const handleUserAuthSuccess = (user: { name: string; email: string }) => {
    setCurrentUser(user);
    setNotification(`Signed in as ${user.name}`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#15170f] text-[#f4f4f0] flex flex-col selection:bg-[#6dff8a] selection:text-[#15170f]">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 bg-[#1e2715] border border-[#6dff8a]/40 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6dff8a] animate-pulse" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        currentUser={currentUser}
      />

      {/* Quick Environment Bar for testing Admin and User Functions */}
      <div className="bg-[#12140c] border-b border-white/10 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-white/70">
          <span className="w-2 h-2 rounded-full bg-[#6dff8a] animate-pulse" />
          <span>TradeShark Ltd Portal Access:</span>
          {currentUser ? (
            <span className="text-white font-semibold">Active User: {currentUser.name}</span>
          ) : (
            <span className="text-white/50">Simulated Environment</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUserDashboardOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-[#6dff8a]/20 text-white hover:text-[#6dff8a] border border-white/10 text-xs font-semibold transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-[#6dff8a]" />
            <span>Open User Portal</span>
          </button>

          <button
            onClick={() => setIsAdminPortalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-yellow-400/20 text-white hover:text-yellow-400 border border-white/10 text-xs font-semibold transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
            <span>Open Admin Console</span>
          </button>
        </div>
      </div>

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero 
          onStartInvesting={() => setAuthModal({ isOpen: true, mode: 'signup' })} 
          onSelectInstrumentSymbol={handleOpenTradeForSymbol}
        />

        {/* 2. Trust Bar */}
        <TrustBar />

        {/* 3. Pricing Reassurance */}
        <PricingSection 
          onLearnMore={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        />

        {/* 4. Product Range Screener */}
        <ProductRange
          onSelectInstrument={(inst) => setTradeInstrument(inst)}
          onStartInvesting={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        />

        {/* 5. Popular Investors / CopyTrader™ */}
        <PopularInvestors
          onCopyInvestor={(inv) => setCopyInvestor(inv)}
          onExploreAll={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        />

        {/* 6. AI Products */}
        <AiProducts
          onOpenAiChat={() => setIsAiChatOpen(true)}
        />

        {/* 7. Trust & Safety Compliance */}
        <TrustSafety />

        {/* 8. Sponsorship Strip */}
        <SponsorshipStrip />

        {/* 9. Final Call to Action */}
        <FinalCta
          onSignUp={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        />
      </main>

      {/* Footer */}
      <Footer 
        onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
      />

      {/* Floating AI Assistant Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 rounded-full bg-[#1b1e15] border border-white/15 text-white/80 hover:text-white hover:border-[#6dff8a] shadow-xl transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        <button
          id="floating-shark-ai-btn"
          onClick={() => setIsAiChatOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#6dff8a] text-[#15170f] font-bold shadow-[0_0_25px_rgba(109,255,138,0.4)] hover:bg-[#5ce077] transition-all transform hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15170f] opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#15170f]"></span>
          </span>
          <span className="text-xs sm:text-sm font-bold">Ask Shark AI</span>
        </button>
      </div>

      {/* Mobile Sticky CTA Bar */}
      {showMobileStickyCta && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-30 p-3 bg-[#15170f]/95 border-t border-white/10 backdrop-blur-md animate-slideUp">
          <button
            onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
            className="w-full py-3.5 rounded-full bg-[#6dff8a] text-[#15170f] font-bold text-sm shadow-[0_0_20px_rgba(109,255,138,0.3)] flex items-center justify-center gap-2"
          >
            <span>Start Investing with TradeShark Ltd</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectInstrument={(inst) => setTradeInstrument(inst)}
      />

      <TradeModal
        instrument={tradeInstrument}
        onClose={() => setTradeInstrument(null)}
      />

      <CopyModal
        investor={copyInvestor}
        onClose={() => setCopyInvestor(null)}
      />

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onSuccess={handleUserAuthSuccess}
      />

      <AiChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onOpenTrade={handleOpenTradeForSymbol}
      />

      {/* User Dashboard & Client Portal */}
      <UserDashboardModal
        isOpen={isUserDashboardOpen}
        onClose={() => setIsUserDashboardOpen(false)}
        user={currentUser}
        onOpenTrade={handleOpenTradeForSymbol}
      />

      {/* Administrative Console */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />

    </div>
  );
}

