
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Brain, MapPin, Lightbulb, Wand2 } from 'lucide-react';

interface InteractiveCreativeSkillsProps {
  onSkillSelect: (skillType: string) => void;
  currentLanguage: string;
  show: boolean;
}

const InteractiveCreativeSkills: React.FC<InteractiveCreativeSkillsProps> = ({ 
  onSkillSelect, 
  currentLanguage,
  show 
}) => {
  const skills = [
    {
      type: 'rewrite',
      icon: Edit3,
      label: currentLanguage === 'ar' ? 'أعد صياغة' : 'Rewrite',
      color: 'from-blue-500 to-blue-600',
      description: currentLanguage === 'ar' ? 'أعد صياغة النص بأسلوب أفضل' : 'Rewrite text with better style'
    },
    {
      type: 'analyze',
      icon: Brain,
      label: currentLanguage === 'ar' ? 'حلل الفكرة' : 'Analyze',
      color: 'from-purple-500 to-purple-600',
      description: currentLanguage === 'ar' ? 'احصل على تحليل عميق للفكرة' : 'Get deep analysis of your idea'
    },
    {
      type: 'plan',
      icon: MapPin,
      label: currentLanguage === 'ar' ? 'خطة تنفيذ' : 'Plan',
      color: 'from-green-500 to-green-600',
      description: currentLanguage === 'ar' ? 'اقتراح خطة تنفيذ مفصلة' : 'Suggest detailed execution plan'
    },
    {
      type: 'naming',
      icon: Lightbulb,
      label: currentLanguage === 'ar' ? 'اقتراح اسم' : 'Brand Name',
      color: 'from-yellow-500 to-yellow-600',
      description: currentLanguage === 'ar' ? 'اقتراح أسماء إبداعية للعلامة التجارية' : 'Creative brand name suggestions'
    }
  ];

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
      >
        <motion.div 
          className="flex items-center space-x-2 mb-3 text-sm text-white/60"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Wand2 className="w-4 h-4 text-[#7EF5A5]" />
          <span>
            {currentLanguage === 'ar' ? 'مهارات إبداعية' : 'Creative Skills'}
          </span>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-3">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.button
                key={skill.type}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                onClick={() => onSkillSelect(skill.type)}
                className={`group relative overflow-hidden p-4 bg-gradient-to-r ${skill.color} text-white rounded-xl hover:shadow-xl transition-all duration-300`}
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background effect */}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative flex items-center space-x-3">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{skill.label}</div>
                    <div className="text-xs opacity-80 mt-1 group-hover:opacity-100 transition-opacity">
                      {skill.description}
                    </div>
                  </div>
                </div>

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  initial={{ boxShadow: "0 0 0 rgba(255,255,255,0)" }}
                  whileHover={{ boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InteractiveCreativeSkills;
