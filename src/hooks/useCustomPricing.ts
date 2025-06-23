
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CustomPricingData {
  id: string;
  custom_price: number;
  currency: string;
  discount_percentage?: number;
  reason?: string;
  valid_until?: string;
  is_active: boolean;
}

export const useCustomPricing = () => {
  const { user, customPricing, getCustomPrice } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasCustomPricing = () => {
    return customPricing && customPricing.is_active;
  };

  const getDiscountPercentage = () => {
    if (!hasCustomPricing()) return 0;
    return customPricing?.discount_percentage || 0;
  };

  const getFormattedPrice = () => {
    const price = getCustomPrice();
    const currency = customPricing?.currency || 'inr';
    
    if (currency === 'inr') {
      return `₹${(price / 100).toFixed(0)}`;
    } else if (currency === 'usd') {
      return `$${(price / 100).toFixed(2)}`;
    }
    return `${price / 100}`;
  };

  const getOriginalPrice = () => {
    return 99900; // Default price in paise
  };

  const getFormattedOriginalPrice = () => {
    const currency = customPricing?.currency || 'inr';
    const price = getOriginalPrice();
    
    if (currency === 'inr') {
      return `₹${(price / 100).toFixed(0)}`;
    } else if (currency === 'usd') {
      return `$${(price / 100).toFixed(2)}`;
    }
    return `${price / 100}`;
  };

  const getSavingsAmount = () => {
    if (!hasCustomPricing()) return 0;
    return getOriginalPrice() - getCustomPrice();
  };

  const getFormattedSavings = () => {
    const savings = getSavingsAmount();
    const currency = customPricing?.currency || 'inr';
    
    if (currency === 'inr') {
      return `₹${(savings / 100).toFixed(0)}`;
    } else if (currency === 'usd') {
      return `$${(savings / 100).toFixed(2)}`;
    }
    return `${savings / 100}`;
  };

  const isValidOffer = () => {
    if (!hasCustomPricing()) return false;
    
    const validUntil = customPricing?.valid_until;
    if (!validUntil) return true;
    
    const now = new Date();
    const expiryDate = new Date(validUntil);
    return now <= expiryDate;
  };

  const getTimeUntilExpiry = () => {
    if (!hasCustomPricing() || !customPricing?.valid_until) return null;
    
    const now = new Date();
    const expiryDate = new Date(customPricing.valid_until);
    const timeDiff = expiryDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return 'Expired';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    } else {
      return 'Less than 1 hour remaining';
    }
  };

  return {
    customPricing,
    loading,
    error,
    hasCustomPricing,
    getCustomPrice,
    getDiscountPercentage,
    getFormattedPrice,
    getOriginalPrice,
    getFormattedOriginalPrice,
    getSavingsAmount,
    getFormattedSavings,
    isValidOffer,
    getTimeUntilExpiry,
  };
};
