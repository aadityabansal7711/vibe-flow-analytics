
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BuyHeader from './buy/components/BuyHeader';
import BuyFooter from './buy/components/BuyFooter';
import PricingCard from './buy/components/PricingCard';
import FeatureShowcase from './buy/components/FeatureShowcase';
import FAQ from './buy/components/FAQ';
import { detectUserRegion, getPricingForRegion } from '@/utils/pricing';
import { MapPin } from 'lucide-react';

const Buy = () => {
  const { user, isUnlocked } = useAuth();
  const [pricing, setPricing] = useState(getPricingForRegion('OTHER'));
  const [region, setRegion] = useState('OTHER');

  useEffect(() => {
    const detectedRegion = detectUserRegion();
    setRegion(detectedRegion);
    setPricing(getPricingForRegion(detectedRegion));
  }, []);

  const features = [
    { name: 'Top Tracks & Artists', included: true, icon: <span className="icon"><svg width="16" height="16"><circle cx="8" cy="8" r="8" fill="#6366f1" /></svg></span> },
    { name: 'Top Albums', included: true, icon: <span className="icon"><svg width="16" height="16"><rect x="2" y="2" width="12" height="12" fill="#8b5cf6" /></svg></span> },
    { name: 'Most Played Song of All Time', included: false, icon: <span className="icon"><svg width="16" height="16"><circle cx="8" cy="8" r="5" fill="#f87171" /></svg></span> },
    { name: 'Your Year in Music', included: false, icon: <span className="icon"><svg width="16" height="16"><path d="M2 14l7-12 7 12H2z" fill="#facc15" /></svg></span> },
    { name: 'AI Playlist Generation', included: false, icon: <span className="icon"><svg width="16" height="16"><polygon points="2,2 14,8 2,14" fill="#10b981" /></svg></span> },
    { name: 'Time Preference Analysis', included: false, icon: <span className="icon"><svg width="16" height="16"><ellipse cx="8" cy="8" rx="7" ry="4" fill="#fb923c" /></svg></span> },
    { name: 'Monthly Listening Trends', included: false, icon: <span className="icon"><svg width="16" height="16"><rect x="2" y="10" width="3" height="4" fill="#60a5fa" /><rect x="7" y="6" width="3" height="8" fill="#6366f1" /><rect x="12" y="2" width="3" height="12" fill="#8b5cf6" /></svg></span> },
    { name: 'Music Personality Profile', included: false, icon: <span className="icon"><svg width="16" height="16"><circle cx="8" cy="8" r="7" stroke="#fbbf24" strokeWidth="2" fill="none" /></svg></span> },
    { name: 'Mood Analysis', included: false, icon: <span className="icon"><svg width="16" height="16"><path d="M4 8a4 4 0 1 1 8 0" stroke="#ec4899" strokeWidth="2" fill="none" /></svg></span> },
    { name: 'Listening Streaks & Milestones', included: false, icon: <span className="icon"><svg width="16" height="16"><circle cx="8" cy="8" r="7" fill="none" stroke="#8b5cf6" strokeWidth="2" /><rect x="6" y="6" width="4" height="4" fill="#f59e42" /></svg></span> },
    { name: 'Advanced Analytics Dashboard', included: false, icon: <span className="icon"><svg width="16" height="16"><rect x="1" y="1" width="14" height="14" stroke="#3b82f6" fill="none" /></svg></span> },
    { name: 'Hidden Gems Discovery', included: false, icon: <span className="icon"><svg width="16" height="16"><polygon points="8,2 2,14 14,14" fill="#22d3ee" /></svg></span> },
  ];

  const handlePurchase = () => {
    console.log('Redirecting to Stripe payment...');
    alert('This would redirect to Stripe payment processing!');
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <BuyHeader user={user} />

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="relative px-6 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6 leading-tight">
                Unlock Your Music DNA
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                Get deep insights into your Spotify listening habits with premium analytics
              </p>

              {/* Region Indicator */}
              <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-8">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  Pricing for {region === 'IN' ? 'India' : region === 'US' ? 'United States' : region === 'EU' ? 'Europe' : 'your region'}
                </span>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <PricingCard
                plan="Free"
                pricing={{ symbol: pricing.symbol, price: 0, period: pricing.period }}
                features={features.slice(0, 3)}
                isUnlocked={isUnlocked}
                onPurchase={() => {}}
              />
              <PricingCard
                plan="Premium"
                pricing={pricing}
                features={features}
                isUnlocked={isUnlocked}
                onPurchase={handlePurchase}
              />
            </div>

            <FeatureShowcase />

            <FAQ />
          </div>
        </div>
      </div>

      <BuyFooter />
    </div>
  );
};

export default Buy;
