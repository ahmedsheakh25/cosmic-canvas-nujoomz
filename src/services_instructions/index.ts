import { brandingIdentityService } from './branding_identity';
import { socialMediaDesignService } from './social_media_design';
import { motionGraphicsService } from './motion_graphics';
import { marketingStrategyService } from './marketing_strategy';
import { namingBrandVoiceService } from './naming_brand_voice';
import { copywritingService } from './copywriting';
import { illustrationDesignService } from './illustration_design';
import { customProjectService } from './custom_project';
import { uiUxDesignService } from './ui_ux_design';
import type { ServiceData, Question, QuestionType, Language } from './types';

// Service map combining all services
export const servicesMap = {
  branding_identity: brandingIdentityService,
  social_media_design: socialMediaDesignService,
  motion_graphics: motionGraphicsService,
  marketing_strategy: marketingStrategyService,
  naming_brand_voice: namingBrandVoiceService,
  copywriting: copywritingService,
  illustration_design: illustrationDesignService,
  custom_project: customProjectService,
  ui_ux_design: uiUxDesignService
};

// Service types and utilities
export type ServiceKey = keyof typeof servicesMap;

// Re-export types for external use
export type { ServiceData, Question, QuestionType, Language } from './types';

// Service constants for easy access
export const SERVICES = {
  BRANDING: 'branding_identity' as const,
  SOCIAL_MEDIA: 'social_media_design' as const,
  MOTION_GRAPHICS: 'motion_graphics' as const,
  MARKETING_STRATEGY: 'marketing_strategy' as const,
  NAMING: 'naming_brand_voice' as const,
  COPYWRITING: 'copywriting' as const,
  ILLUSTRATION: 'illustration_design' as const,
  CUSTOM_PROJECT: 'custom_project' as const,
  UI_UX: 'ui_ux_design' as const,
  WEBSITE: 'ui_ux_design' as const // alias for backward compatibility
} as const;

// Utility functions
export const getServiceName = (serviceKey: ServiceKey, language: Language): string => {
  return servicesMap[serviceKey]?.label[language] || serviceKey;
};

export const getServiceQuestions = (serviceKey: ServiceKey): Question[] => {
  const service = servicesMap[serviceKey];
  if (!service?.subServices) return [];
  
  // Get questions from the first subservice for now
  const firstSubService = Object.values(service.subServices)[0];
  return firstSubService?.questions || [];
};

export const detectServicesFromText = (text: string): ServiceKey[] => {
  const lowerText = text.toLowerCase();
  const detected: ServiceKey[] = [];
  
  // Keywords mapping for service detection
  const serviceKeywords = {
    branding_identity: ['logo', 'brand', 'identity', 'branding', 'شعار', 'هوية', 'براند'],
    social_media_design: ['social', 'instagram', 'facebook', 'twitter', 'سوشيال', 'انستقرام'],
    motion_graphics: ['video', 'animation', 'motion', 'فيديو', 'تحريك', 'موشن'],
    marketing_strategy: ['marketing', 'strategy', 'campaign', 'تسويق', 'استراتيجية', 'حملة'],
    naming_brand_voice: ['naming', 'name', 'voice', 'tone', 'اسم', 'تسمية', 'نبرة'],
    copywriting: ['copy', 'content', 'writing', 'text', 'محتوى', 'كتابة', 'نص'],
    illustration_design: ['illustration', 'character', 'infographic', 'رسم', 'شخصية', 'انفوجرافيك'],
    custom_project: ['custom', 'project', 'help', 'consultation', 'مساعدة', 'استشارة', 'مشروع'],
    ui_ux_design: ['website', 'ui', 'ux', 'app', 'design', 'موقع', 'تطبيق', 'واجهة']
  };
  
  Object.entries(serviceKeywords).forEach(([service, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      detected.push(service as ServiceKey);
    }
  });
  
  return detected;
};

// Re-export individual services for direct imports
export {
  brandingIdentityService,
  socialMediaDesignService,
  motionGraphicsService,
  marketingStrategyService,
  namingBrandVoiceService,
  copywritingService,
  illustrationDesignService,
  customProjectService,
  uiUxDesignService
};