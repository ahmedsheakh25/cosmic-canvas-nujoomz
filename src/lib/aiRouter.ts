
import { 
  servicesMap, 
  ServiceKey, 
  SERVICES,
  getServiceName,
  getServiceQuestions,
  detectServicesFromText
} from '@/services_instructions';

export type ServiceType = ServiceKey;

/**
 * Detects services from user input by matching keywords
 * @param message - The user's message
 * @param language - The language preference ('en' or 'ar')
 * @returns Array of detected service keys
 */
export const detectServicesFromInput = (message: string, language: 'en' | 'ar'): ServiceType[] => {
  const detectedServices = detectServicesFromText(message);
  
  // If no services detected through keywords, try contextual detection
  if (detectedServices.length === 0) {
    return performContextualDetection(message, language);
  }
  
  // Sort by relevance (for now, return first 3 most relevant)
  return detectedServices.slice(0, 3);
};

/**
 * Performs contextual detection when keyword matching fails
 */
const performContextualDetection = (message: string, language: 'en' | 'ar'): ServiceType[] => {
  const lowerMessage = message.toLowerCase();
  
  // Common business contexts
  const businessContexts = [
    { keywords: ['business', 'company', 'startup', 'شركة', 'عمل', 'مشروع'], services: [SERVICES.BRANDING, SERVICES.WEBSITE] },
    { keywords: ['online', 'digital', 'internet', 'رقمي', 'إلكتروني', 'أونلاين'], services: [SERVICES.WEBSITE, SERVICES.MARKETING_STRATEGY] },
    { keywords: ['sell', 'selling', 'products', 'بيع', 'منتجات', 'تجارة'], services: [SERVICES.WEBSITE, SERVICES.MARKETING_STRATEGY] },
    { keywords: ['design', 'creative', 'visual', 'تصميم', 'إبداعي', 'بصري'], services: [SERVICES.BRANDING, SERVICES.ILLUSTRATION] }
  ];
  
  for (const context of businessContexts) {
    if (context.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return context.services;
    }
  }
  
  // Default fallback
  return [SERVICES.BRANDING, SERVICES.WEBSITE];
};

/**
 * Generates a confirmation message for detected services
 * @param services - Array of detected services
 * @param language - The language preference
 * @returns Confirmation message string
 */
export const generateServiceConfirmationMessage = (services: ServiceType[], language: 'en' | 'ar'): string => {
  if (services.length === 0) {
    return language === 'ar' 
      ? 'دعني أساعدك في تحديد الخدمة المناسبة لمشروعك! 🚀'
      : 'Let me help you identify the right service for your project! 🚀';
  }
  
  if (services.length === 1) {
    const serviceName = getServiceName(services[0], language);
    return language === 'ar'
      ? `رائع! يبدو أنك تحتاج إلى خدمة ${serviceName}. دعنا نبدأ بجمع التفاصيل! ✨`
      : `Great! It looks like you need ${serviceName}. Let's start gathering the details! ✨`;
  }
  
  // Multiple services detected
  const serviceNames = services.map(service => getServiceName(service, language));
  
  if (language === 'ar') {
    const joinedServices = serviceNames.join(' أو ');
    return `اكتشفت عدة خدمات قد تحتاجها: ${joinedServices}. أي منها تريد أن نبدأ به؟ 🎯`;
  } else {
    const joinedServices = services.length > 2 
      ? `${serviceNames.slice(0, -1).join(', ')}, or ${serviceNames[serviceNames.length - 1]}`
      : serviceNames.join(' or ');
    return `I detected several services you might need: ${joinedServices}. Which one would you like to start with? 🎯`;
  }
};

/**
 * Gets the next question for a specific service
 * @param service - The service type
 * @param index - The question index (0-based)
 * @param language - The language preference
 * @returns The question string or empty string if no more questions
 */
export const getNextQuestion = (service: ServiceType, index: number, language: 'en' | 'ar'): string => {
  const questions = getServiceQuestions(service);
  
  if (index >= questions.length || index < 0) {
    return '';
  }
  
  return questions[index].label[language];
};

/**
 * Gets the display name for a service
 * @param service - The service type
 * @param language - The language preference
 * @returns The service display name
 */
export const getServiceDisplayName = (service: ServiceType, language: 'en' | 'ar'): string => {
  return getServiceName(service, language);
};

/**
 * Gets the total number of questions for a service
 * @param service - The service type
 * @returns Number of questions available
 */
export const getServiceQuestionCount = (service: ServiceType): number => {
  return getServiceQuestions(service).length;
};

/**
 * Checks if there are more questions for a service
 * @param service - The service type
 * @param currentIndex - Current question index
 * @returns True if more questions exist
 */
export const hasMoreQuestions = (service: ServiceType, currentIndex: number): boolean => {
  return currentIndex < getServiceQuestionCount(service) - 1;
};

/**
 * Gets a progress indicator for the brief questions
 * @param service - The service type
 * @param currentIndex - Current question index
 * @param language - The language preference
 * @returns Progress string like "2/6" or "٢/٦"
 */
export const getBriefProgress = (service: ServiceType, currentIndex: number, language: 'en' | 'ar'): string => {
  const total = getServiceQuestionCount(service);
  const current = currentIndex + 1;
  
  if (language === 'ar') {
    // Use Arabic-Indic numerals
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const currentAr = current.toString().split('').map(d => arabicNumerals[parseInt(d)]).join('');
    const totalAr = total.toString().split('').map(d => arabicNumerals[parseInt(d)]).join('');
    return `${currentAr}/${totalAr}`;
  }
  
  return `${current}/${total}`;
};

/**
 * Generates a completion message when all questions are answered
 * @param service - The service type
 * @param language - The language preference
 * @returns Completion message
 */
export const generateCompletionMessage = (service: ServiceType, language: 'en' | 'ar'): string => {
  const serviceName = getServiceName(service, language);
  
  return language === 'ar'
    ? `ممتاز! لقد جمعنا كل المعلومات اللازمة لمشروع ${serviceName}. سأقوم الآن بإنشاء موجز مشروعك المخصص! 🎉`
    : `Excellent! We've gathered all the necessary information for your ${serviceName} project. I'll now create your personalized project brief! 🎉`;
};

/**
 * Generates service selection options for quick replies
 * @param services - Array of services to display
 * @param language - The language preference
 * @returns Array of service options with display names
 */
export const generateServiceOptions = (services: ServiceType[], language: 'en' | 'ar') => {
  return services.map(service => ({
    value: service,
    label: getServiceName(service, language)
  }));
};
