'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useCurrency } from '@/context/CurrencyContext';
import { 
  Crown, 
  Gift, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  Search, 
  ArrowRight,
  Send,
  Star
} from 'lucide-react';
import { GiftCard } from '@/types';

const TIERS = [
  {
    name: 'Bronze Foodie',
    points: '0 - 500 pts',
    color: 'from-amber-700 to-amber-900',
    perks: ['Complimentary welcome beverage', 'Birthday artisan dessert on the house', 'Seasonal menu pre-tasting notices']
  },
  {
    name: 'Silver VIP',
    points: '500 - 1,500 pts',
    color: 'from-slate-400 to-slate-600',
    perks: ['Priority table seating during rush hours', '5% cash back in dining credits', 'Invitations to seasonal chef masterclasses']
  },
  {
    name: 'Gold Gastronome',
    points: '1,500 - 3,500 pts',
    color: 'from-amber-400 to-amber-600',
    perks: ['Guaranteed window alcove / garden terrace seating', 'Complimentary sommelier wine flight with dinner', '10% privilege discount on all bills']
  },
  {
    name: 'Black Diamond VIP',
    points: '3,500+ pts',
    color: 'from-stone-900 to-black',
    perks: ['Executive private lounge booking privileges', 'Personal concierge hotline with Executive Chef', 'Zero-wait seating without reservations']
  }
];

export default function LoyaltyPage() {
  const { formatPrice } = useCurrency();
  const [spendSlider, setSpendSlider] = useState(250);
  
  // Gift card state
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [cardAmount, setCardAmount] = useState(100);
  const [giftMessage, setGiftMessage] = useState('Enjoy an exquisite meal at Flavoria!');
  const [issuedCard, setIssuedCard] = useState<GiftCard | null>(null);
  const [issuing, setIssuing] = useState(false);

  // Balance checker
  const [checkCode, setCheckCode] = useState('');
  const [checkedBalance, setCheckedBalance] = useState<{ found: boolean; card?: GiftCard } | null>(null);
  const [checking, setChecking] = useState(false);

  // Estimated points
  const pointsEarned = spendSlider * 10;
  let estimatedTier = TIERS[0];
  if (pointsEarned >= 3500) estimatedTier = TIERS[3];
  else if (pointsEarned >= 1500) estimatedTier = TIERS[2];
  else if (pointsEarned >= 500) estimatedTier = TIERS[1];

  const handleIssueGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !recipientEmail) return;
    setIssuing(true);

    try {
      const res = await fetch('/api/gift-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName,
          recipientEmail,
          senderName: senderName || 'A Food Enthusiast',
          initialBalance: cardAmount,
          message: giftMessage
        })
      });
      const data = await res.json();
      if (res.ok && data.card) {
        setIssuedCard(data.card);
        setRecipientName('');
        setRecipientEmail('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIssuing(false);
    }
  };

  const handleCheckBalance = async () => {
    if (!checkCode.trim()) return;
    setChecking(true);
    setCheckedBalance(null);

    try {
      const res = await fetch('/api/gift-cards');
      const data = await res.json();
      if (res.ok && data.giftCards) {
        const match = data.giftCards.find((c: GiftCard) => c.code.toUpperCase() === checkCode.trim().toUpperCase());
        setCheckedBalance(match ? { found: true, card: match } : { found: false });
      }
    } catch {
      setCheckedBalance({ found: false });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2937] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#ea580c]">Home</Link>
            <span>/</span>
            <span className="text-[#ea580c] font-bold">VIP Loyalty & Gift Cards</span>
          </nav>

          {/* Page Banner */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#ea580c] text-xs font-bold uppercase mb-2">
              <Crown className="w-3.5 h-3.5" />
              <span>THE GOURMET PRIVILEGE CLUB</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight mb-4">
              VIP Loyalty & Digital Gift Cards
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              Earn rewards on every seasonal tasting, unlock exclusive cellar access, and gift loved ones unforgettable Michelin-caliber dining experiences.
            </p>
          </div>

          {/* 4 Tier Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {TIERS.map((tier, idx) => (
              <div
                key={tier.name}
                className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tier.color} text-white flex items-center justify-center mb-4 shadow-md`}>
                    <Crown className="w-6 h-6" />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Tier {idx + 1} • {tier.points}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">
                    {tier.name}
                  </h3>

                  <div className="space-y-2.5 text-xs text-stone-600">
                    {tier.perks.map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-light">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100 mt-6">
                  <Link
                    href="/reservation"
                    className="w-full py-2.5 rounded-xl bg-stone-50 hover:bg-orange-50 hover:text-[#ea580c] border border-stone-200 text-xs font-bold block text-center transition-colors"
                  >
                    Dine & Earn
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Points Calculator */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 sm:p-12 mb-20 max-w-4xl mx-auto">
            <div className="text-center max-w-md mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ea580c] block mb-1">
                REWARDS ESTIMATOR
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Calculate Your VIP Status
              </h2>
              <p className="text-xs text-stone-500 font-light mt-1">
                Drag the spend slider to see how fast your dining turns into luxury rewards.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-stone-800 mb-2">
                  <span>Monthly Dining Spend:</span>
                  <span className="text-xl text-[#ea580c] font-serif">{formatPrice(spendSlider)}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={spendSlider}
                  onChange={(e) => setSpendSlider(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#ea580c]"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono">
                  <span>{formatPrice(50)}</span>
                  <span>{formatPrice(500)}</span>
                  <span>{formatPrice(1000)}</span>
                </div>
              </div>

              {/* Result Box */}
              <div className="p-6 rounded-2xl bg-[#1a4231] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div>
                  <span className="text-xs text-emerald-200 uppercase font-bold block mb-1">
                    Your Projected Tier
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-white">
                    {estimatedTier.name}
                  </h4>
                  <p className="text-xs text-emerald-100 font-light mt-0.5">
                    Earns roughly <strong className="text-white font-bold">{pointsEarned.toLocaleString()} Gourmet Points</strong> annually.
                  </p>
                </div>

                <Link
                  href="/reservation"
                  className="px-6 py-3 rounded-full btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md shrink-0"
                >
                  Book Table & Start Earning
                </Link>
              </div>
            </div>
          </div>

          {/* Digital Gift Card Studio & Balance Checker Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Issue Gift Card (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ea580c]">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    Send a Digital Dining Gift Card
                  </h3>
                  <p className="text-xs text-stone-500 font-light">
                    Sent instantly via email with unique redeemable pass code.
                  </p>
                </div>
              </div>

              {issuedCard ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in my-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-emerald-900">
                    Gift Card Successfully Issued!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1 mb-4">
                    Gift code <strong className="font-mono text-sm text-[#ea580c] bg-white px-2 py-0.5 rounded-lg border border-orange-200">{issuedCard.code}</strong> with balance {formatPrice(issuedCard.currentBalance)} is ready for use.
                  </p>
                  <button
                    onClick={() => setIssuedCard(null)}
                    className="px-5 py-2 rounded-full btn-primary-orange text-xs font-bold uppercase"
                  >
                    Issue Another Gift Card
                  </button>
                </div>
              ) : (
                <form onSubmit={handleIssueGiftCard} className="space-y-4 mt-6">
                  {/* Preset Amount Chips */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-2">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      {[50, 100, 200, 300].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setCardAmount(amt)}
                          className={`py-3 rounded-2xl font-bold transition-all ${
                            cardAmount === amt
                              ? 'bg-[#ea580c] text-white shadow-md'
                              : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-orange-200'
                          }`}
                        >
                          {formatPrice(amt)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                        Recipient Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Eleanor Vance"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                        Recipient Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="eleanor@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Your Name / Sender
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Julian Croft"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
                      Gift Message
                    </label>
                    <textarea
                      rows={3}
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={issuing}
                    className="w-full py-4 rounded-2xl btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                  >
                    {issuing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Gift className="w-4 h-4 text-white" />
                        <span>PURCHASE DIGITAL GIFT CARD ({formatPrice(cardAmount)})</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Check Balance & Redeem (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">
                  Check Gift Card Balance
                </h4>
                <p className="text-xs text-stone-500 font-light mb-4">
                  Already have a Flavoria gift voucher? Check your remaining balance below.
                </p>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="e.g. FLV-GIFT-5001"
                    value={checkCode}
                    onChange={(e) => setCheckCode(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 uppercase focus:outline-none focus:border-[#ea580c]"
                  />
                  <button
                    onClick={handleCheckBalance}
                    disabled={checking}
                    className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1"
                  >
                    {checking ? 'Checking...' : 'Lookup'}
                  </button>
                </div>

                {checkedBalance && (
                  <div className={`p-4 rounded-2xl text-xs ${checkedBalance.found ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
                    {checkedBalance.found && checkedBalance.card ? (
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Active Gift Card</span>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-stone-800">Remaining Balance:</span>
                          <span className="font-serif text-xl font-bold text-[#ea580c]">{formatPrice(checkedBalance.card.currentBalance)}</span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Recipient: {checkedBalance.card.recipientName}
                        </div>
                      </div>
                    ) : (
                      <span className="text-rose-700 font-medium">
                        Gift card not found or has been fully redeemed.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Sample Voucher Visual Preview */}
              <div className="rounded-3xl bg-gradient-to-br from-stone-900 to-black text-white p-7 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Crown className="w-32 h-32 text-orange-400" />
                </div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <span className="font-serif text-2xl font-bold text-white block">Flavoria</span>
                    <span className="text-[9px] tracking-widest text-orange-400 font-bold uppercase">— GOURMET PASS —</span>
                  </div>
                  <Crown className="w-5 h-5 text-orange-400" />
                </div>
                <div className="relative z-10 text-xs text-stone-300 space-y-1 mb-6">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Valid across all services</span>
                  <p className="font-light">Dine-In • Cellar Tastings • Takeaway • Private Dining</p>
                </div>
                <div className="flex justify-between items-end relative z-10 pt-4 border-t border-stone-800 font-mono text-xs">
                  <span className="text-orange-400">FLV-GIFT-LUXE</span>
                  <span className="text-stone-400 text-[10px]">No Expiration Date</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
