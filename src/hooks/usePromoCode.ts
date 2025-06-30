
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PromoCodeValidation {
  valid: boolean;
  discount_percentage: number;
  message: string;
}

export const usePromoCode = () => {
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  const validatePromoCode = async (code: string): Promise<PromoCodeValidation> => {
    if (!code.trim()) {
      return { valid: false, discount_percentage: 0, message: 'Please enter a promo code' };
    }

    setValidatingPromo(true);
    
    try {
      const { data, error } = await supabase.rpc('validate_promo_code', {
        promo_code: code.toUpperCase()
      });

      if (error) {
        console.error('Error validating promo code:', error);
        return { valid: false, discount_percentage: 0, message: 'Error validating code' };
      }

      if (data && data.length > 0) {
        const result = data[0];
        setPromoDiscount(result.valid ? result.discount_percentage : 0);
        setPromoMessage(result.message);
        return result;
      }

      return { valid: false, discount_percentage: 0, message: 'Invalid promo code' };
    } catch (error) {
      console.error('Error validating promo code:', error);
      return { valid: false, discount_percentage: 0, message: 'Error validating code' };
    } finally {
      setValidatingPromo(false);
    }
  };

  const applyPromoCode = async (code: string) => {
    const result = await validatePromoCode(code);
    if (result.valid) {
      setPromoCode(code.toUpperCase());
    }
    return result;
  };

  const clearPromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoMessage('');
  };

  const calculateDiscountedPrice = (originalPrice: number) => {
    if (promoDiscount > 0) {
      return Math.round(originalPrice * (1 - promoDiscount / 100));
    }
    return originalPrice;
  };

  return {
    promoCode,
    promoDiscount,
    promoMessage,
    validatingPromo,
    validatePromoCode,
    applyPromoCode,
    clearPromoCode,
    calculateDiscountedPrice
  };
};
