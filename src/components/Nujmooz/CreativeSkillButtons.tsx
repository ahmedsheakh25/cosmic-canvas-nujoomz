
import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Brain, MapPin, Lightbulb } from 'lucide-react';

interface CreativeSkillButtonsProps {
  onSkillSelect: (skillType: string) => void;
  currentLanguage: string;
  show: boolean;
}

const CreativeSkillButtons: React.FC<CreativeSkillButtonsProps> = ({ 
  onSkillSelect, 
  currentLanguage,
  show 
}) => {
  if (!show) return null;

  const skills = [
    {
      type: 'rewrite',
      icon: Edit3,
      label: currentLanguage === 'ar' ? 'أعد صياغة' : 'Rewrite',
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'analyze',
      icon: Brain,
      label: currentLanguage === 'ar' ? 'حلل الفكرة' : 'Analyze',
      color: 'from-purple-500 to-purple-600'
    },
    {
      type: 'plan',
      icon: MapPin,
      label: currentLanguage === 'ar' ? 'خطة تنفيذ' : 'Plan',
      color: 'from-green-500 to-green-600'
    },
    {
      type: 'naming',
      icon: Lightbulb,
      label: currentLanguage === 'ar' ? 'اقتراح اسم' : 'Brand Name',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {skills.map((skill, index) => {
        const Icon = skill.icon;
        return (
          <motion.button
            key={skill.type}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSkillSelect(skill.type)}
            className={`px-4 py-2 text-sm font-medium bg-gradient-to-r ${skill.color} text-white rounded-full hover:shadow-lg transition-all duration-200 flex items-center space-x-2`}
          >
            <Icon className="w-4 h-4" />
            <span>{skill.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default CreativeSkillButtons;
