
import { getResponse } from '@/lib/responses';

// 🚫 Blocked keyword patterns for message filtering - Creative Guide Focus
const blockedPatterns = [
  // Arabic non-creative keywords
  /كود/i, /برمجة/i, /سكريبت/i, /تطوير برمجي/i, /مطور/i, /كوديلا/i, /خوارزمية/i,
  // Arabic medical keywords
  /دواء/i, /تشخيص/i, /مرض/i, /علاج طبي/i, /طبيب/i, /عملية جراحية/i, /جراحة/i,
  // Arabic religious keywords (specific religious guidance)
  /فتوى/i, /حكم ديني/i, /حرام/i, /حلال/i, /شيخ/i, /إمام/i,
  // Arabic legal keywords
  /قانون/i, /محكمة/i, /جنحة/i, /جريمة/i, /قاضي/i, /محامي/i, /دعوى قضائية/i,
  // Arabic financial advice
  /استثمار/i, /أسهم/i, /بورصة/i, /عملات/i, /تداول/i, /قروض/i,
  
  // English non-creative keywords
  /javascript/i, /python/i, /react/i, /coding/i, /programming/i, /developer/i, /algorithm/i,
  /html/i, /css/i, /sql/i, /database/i, /backend/i, /frontend/i, /framework/i,
  // English medical keywords
  /medical advice/i, /diagnose/i, /doctor/i, /medicine/i, /surgery/i, /treatment/i, /disease/i, /symptoms/i,
  /prescription/i, /hospital/i, /clinic/i, /therapy/i, /health condition/i,
  // English legal keywords
  /legal advice/i, /lawyer/i, /court/i, /lawsuit/i, /judge/i, /crime/i, /attorney/i,
  /contract law/i, /litigation/i, /defendant/i, /plaintiff/i,
  // English financial advice
  /investment/i, /stocks/i, /trading/i, /financial advice/i, /loans/i, /mortgage/i,
  // English religious guidance
  /religious advice/i, /bible interpretation/i, /spiritual guidance/i, /religious ruling/i,
  
  // General restricted topics
  /hack/i, /virus/i, /malware/i, /illegal/i, /drugs/i, /violence/i, /explicit content/i
];

// Creative keywords that should NOT be blocked (allow creative discussions)
const allowedCreativePatterns = [
  // Creative design terms
  /web design/i, /graphic design/i, /ui design/i, /ux design/i, /logo design/i,
  /brand design/i, /creative design/i, /visual design/i, /design thinking/i,
  // Arabic creative terms
  /تصميم/i, /إبداع/i, /فن/i, /جرافيك/i, /هوية بصرية/i, /تصميم مواقع/i,
  // Marketing and content creation
  /content creation/i, /social media/i, /marketing/i, /advertising/i, /branding/i,
  /copywriting/i, /storytelling/i, /visual content/i,
  // Arabic marketing terms
  /تسويق/i, /إعلان/i, /محتوى/i, /علامة تجارية/i, /قصة/i
];

export const isMessageBlocked = (message: string): boolean => {
  // First check if it's clearly creative content - if so, don't block
  const isCreativeContent = allowedCreativePatterns.some(pattern => pattern.test(message));
  if (isCreativeContent) {
    return false;
  }
  
  // Then check if it matches blocked patterns
  return blockedPatterns.some(pattern => pattern.test(message));
};

export const getBlockedResponse = (language: 'en' | 'ar'): string => {
  return getResponse('blocked', language) as string;
};

export const getBlockedSuggestions = (language: 'en' | 'ar'): string[] => {
  return getResponse('service_suggestions', language) as string[];
};
