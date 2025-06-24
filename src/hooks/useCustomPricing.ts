
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CustomPricing {
  id: string;
  custom_price: number;
  currency: string;
  discount_percentage?: number;
  valid_until?: string;
  is_active: boolean;
}

export const useCustomPricing = () => {
  const { user, profile } = useAuth();
  const [customPricing, setCustomPricing] = useState<CustomPricing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomPricing = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('custom_pricing')
          .select('*')
          .or(`email.eq.${user.email},user_id.eq.${user.id}`)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching custom pricing:', error);
          return;
        }

        if (data) {
          // Check if still valid
          if (data.valid_until && new Date(data.valid_until) < new Date()) {
            setCustomPricing(null);
          } else {
            setCustomPricing(data);
          }
        }
      } catch (error) {
        console.error('Error fetching custom pricing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomPricing();
  }, [user]);

  const getPrice = () => {
    const basePrice = 499; // Default price in INR
    
    if (customPricing) {
      return customPricing.custom_price;
    }
    
    return basePrice;
  };

  const getDiscount = () => {
    if (customPricing?.discount_percentage) {
      return customPricing.discount_percentage;
    }
    return 0;
  };

  return {
    customPricing,
    loading,
    getPrice,
    getDiscount,
    hasCustomPricing: !!customPricing
  };
};
