
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Globe, Smartphone, Camera } from 'lucide-react';

interface ModernWelcomeScreenProps {
  currentLanguage: 'en' | 'ar';
  onSuggestionClick: (suggestion: string) => void;
}

const ModernWelcomeScreen: React.FC<ModernWelcomeScreenProps> = ({
  currentLanguage,
  onSuggestionClick
}) => {
  const serviceSuggestions = {
    en: [
      {
        title: "Brand Identity Design",
        description: "Create a complete visual identity for your business",
        icon: Palette,
        prompt: "I need a complete brand identity design for my business including logo, colors, and visual guidelines"
      },
      {
        title: "Website Development", 
        description: "Professional websites that represent your brand",
        icon: Globe,
        prompt: "I want to develop a professional website for my business"
      },
      {
        title: "Mobile App Development",
        description: "Custom mobile applications for iOS and Android",
        icon: Smartphone,
        prompt: "I need to develop a mobile application for my business idea"
      },
      {
        title: "Photography & Content Creation",
        description: "Professional photography and visual content",
        icon: Camera,
        prompt: "I need professional photography and content creation services"
      }
    ],
    ar: [
      {
        title: "تصميم الهوية التجارية",
        description: "إنشاء هوية بصرية متكاملة لعملك التجاري",
        icon: Palette,
        prompt: "أحتاج تصميم هوية تجارية متكاملة لشركتي تشمل الشعار والألوان والدليل البصري"
      },
      {
        title: "تطوير المواقع الإلكترونية",
        description: "مواقع إلكترونية احترافية تمثل علامتك التجارية",
        icon: Globe,
        prompt: "أريد تطوير موقع إلكتروني احترافي لعملي"
      },
      {
        title: "تطوير التطبيقات",
        description: "تطبيقات جوال مخصصة لأنظمة iOS و Android",
        icon: Smartphone,
        prompt: "أحتاج تطوير تطبيق جوال لفكرة مشروعي"
      },
      {
        title: "التصوير وإنتاج المحتوى",
        description: "تصوير احترافي وإنتاج محتوى بصري متميز",
        icon: Camera,
        prompt: "أحتاج خدمات التصوير الاحترافي وإنتاج المحتوى البصري"
      }
    ]
  };

  // RTL-aware classes
  const rtlClasses = {
    container: currentLanguage === 'ar' ? 'arabic-text' : '',
    flexRow: currentLanguage === 'ar' ? 'flex-row-reverse' : 'flex-row',
    textAlign: currentLanguage === 'ar' ? 'text-right' : 'text-left',
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center min-h-[60vh] px-6 ${rtlClasses.container}`}
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-center mb-8 ${rtlClasses.textAlign}`}
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 mixed-text">
          <span className="text-nujmooz-text-primary">
            {currentLanguage === 'ar' ? 'أهلاً وسهلاً، ' : 'Hi there, '}
          </span>
          <span className="gradient-text">
            {currentLanguage === 'ar' ? 'صديقي' : 'Friend'}
          </span>
        </h1>
        <h2 className="text-3xl lg:text-4xl font-semibold gradient-text mixed-text">
          {currentLanguage === 'ar' 
            ? 'كيف يمكننا مساعدتك اليوم؟'
            : 'How can we help you today?'
          }
        </h2>
        <p className="text-nujmooz-text-secondary mt-4 text-lg mixed-text">
          {currentLanguage === 'ar'
            ? 'اختر إحدى خدماتنا أدناه أو أخبرنا عن مشروعك'
            : 'Choose one of our services below or tell us about your project'
          }
        </p>
      </motion.div>

      {/* Service Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-6"
      >
        {serviceSuggestions[currentLanguage].map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 15px 40px rgba(126, 245, 165, 0.15)",
                y: -3
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick(service.prompt)}
              className={`
                group p-8 bg-gradient-to-br from-nujmooz-surface/80 to-nujmooz-surface/40 
                border border-nujmooz-border/50 rounded-2xl backdrop-blur-sm
                hover:border-nujmooz-primary/40 hover:bg-gradient-to-br hover:from-nujmooz-surface hover:to-nujmooz-surface-dark
                transition-all duration-300 shadow-lg hover:shadow-xl
                ${rtlClasses.textAlign}
              `}
            >
              <div className={`flex items-start gap-6 ${rtlClasses.flexRow}`}>
                <div className="flex-shrink-0 p-4 bg-gradient-to-br from-nujmooz-primary/20 to-nujmooz-primary/10 rounded-xl group-hover:from-nujmooz-primary/30 group-hover:to-nujmooz-primary/20 transition-all duration-300">
                  <Icon className="w-8 h-8 text-nujmooz-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-nujmooz-text-primary group-hover:text-nujmooz-primary transition-colors mixed-text">
                    {service.title}
                  </h3>
                  <p className="text-nujmooz-text-secondary leading-relaxed mixed-text">
                    {service.description}
                  </p>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="mt-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-0.5 bg-gradient-to-r from-nujmooz-primary to-transparent rounded-full"></div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <p className="text-nujmooz-text-secondary text-sm mixed-text">
          {currentLanguage === 'ar' 
            ? 'أو ابدأ بكتابة رسالتك مباشرة في الأسفل 👇'
            : 'Or start typing your message directly below 👇'
          }
        </p>
      </motion.div>
    </div>
  );
};

export default ModernWelcomeScreen;
