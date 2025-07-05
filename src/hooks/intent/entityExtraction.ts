
export const extractEntities = (message: string, language: 'en' | 'ar'): Record<string, string> => {
  const entities: Record<string, string> = {};
  
  // Service entities
  const servicePatterns = language === 'ar' ? 
    ['هوية تجارية', 'موقع', 'تصميم', 'تسويق'] :
    ['branding', 'website', 'design', 'marketing'];
  
  servicePatterns.forEach(service => {
    if (message.toLowerCase().includes(service.toLowerCase())) {
      entities.service = service;
    }
  });

  // Budget entities
  const budgetRegex = language === 'ar' ? 
    /(\d+)\s*(ريال|درهم|دولار)/ :
    /\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/;
  
  const budgetMatch = message.match(budgetRegex);
  if (budgetMatch) {
    entities.budget = budgetMatch[0];
  }

  // Timeline entities
  const timelinePatterns = language === 'ar' ?
    ['أسبوع', 'شهر', 'يوم'] :
    ['week', 'month', 'day'];
  
  timelinePatterns.forEach(time => {
    if (message.toLowerCase().includes(time)) {
      entities.timeline = time;
    }
  });

  return entities;
};
