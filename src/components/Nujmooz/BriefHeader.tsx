
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle } from 'lucide-react';

interface BriefHeaderProps {
  service: string;
  status: 'collecting' | 'generating' | 'complete';
  currentLanguage: 'en' | 'ar';
}

const BriefHeader: React.FC<BriefHeaderProps> = ({
  service,
  status,
  currentLanguage
}) => {
  const isRTL = currentLanguage === 'ar';

  const serviceNames = {
    ar: {
      branding: 'الهوية التجارية والعلامة التجارية',
      website: 'تطوير المواقع الإلكترونية',
      ecommerce: 'المتاجر الإلكترونية',
      marketing: 'التسويق الرقمي والحملات',
      motion: 'الموشن جرافيك والرسوم المتحركة',
      photography: 'التصوير الفوتوغرافي',
      ui_ux: 'تصميم تجربة وواجهة المستخدم'
    },
    en: {
      branding: 'Brand Identity & Logo Design',
      website: 'Website Development',
      ecommerce: 'E-commerce Solutions',
      marketing: 'Digital Marketing Campaigns',
      motion: 'Motion Graphics & Animation',
      photography: 'Photography Services',
      ui_ux: 'UI/UX Design'
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'collecting':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'generating':
        return <div className="w-5 h-5 border-2 border-nujmooz-primary border-t-transparent rounded-full animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'collecting':
        return currentLanguage === 'ar' ? 'جمع المعلومات' : 'Collecting Information';
      case 'generating':
        return currentLanguage === 'ar' ? 'إنشاء الموجز' : 'Generating Brief';
      case 'complete':
        return currentLanguage === 'ar' ? 'مكتمل' : 'Complete';
      default:
        return currentLanguage === 'ar' ? 'جديد' : 'New';
    }
  };

  return (
    <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="w-12 h-12 bg-gradient-to-br from-nujmooz-primary to-nujmooz-primary/80 rounded-xl flex items-center justify-center shadow-md">
        <FileText className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-nujmooz-text-primary mb-1 mixed-text">
          {currentLanguage === 'ar' ? 'موجز المشروع الإبداعي' : 'Creative Project Brief'}
        </h3>
        <p className="text-nujmooz-text-secondary mixed-text font-medium">
          {serviceNames[currentLanguage][service as keyof typeof serviceNames['en']] || service}
        </p>
      </div>
      
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 shadow-sm ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium mixed-text">
          {getStatusText()}
        </span>
      </div>
    </div>
  );
};

export default BriefHeader;
