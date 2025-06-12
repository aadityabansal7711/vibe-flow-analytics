
export const detectUserRegion = () => {
  const language = navigator.language.toLowerCase();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // India detection
  if (language.includes('hi') || language.includes('bn') || language.includes('te') || 
      language.includes('mr') || language.includes('ta') || language.includes('gu') ||
      timezone.includes('Kolkata') || timezone.includes('Asia/Calcutta')) {
    return 'IN';
  }
  
  // US detection
  if (language.includes('en-us') || timezone.includes('America/')) {
    return 'US';
  }
  
  // Europe detection
  if (timezone.includes('Europe/')) {
    return 'EU';
  }
  
  return 'OTHER';
};

export const getPricingForRegion = (region: string) => {
  switch (region) {
    case 'IN':
      return {
        currency: 'INR',
        symbol: '₹',
        price: 499,
        period: 'year'
      };
    case 'US':
      return {
        currency: 'USD',
        symbol: '$',
        price: 12,
        period: 'year'
      };
    case 'EU':
      return {
        currency: 'EUR',
        symbol: '€',
        price: 11,
        period: 'year'
      };
    default:
      return {
        currency: 'INR',
        symbol: '₹',
        price: 799,
        period: 'year'
      };
  }
};
