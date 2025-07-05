
import React from 'react';

interface PoweredByProps {
  currentLanguage: string;
}

const PoweredBy: React.FC<PoweredByProps> = ({ currentLanguage }) => {
  return (
    <div className="px-6 pb-4">
      <div className="text-center text-white/40 text-xs">
        {currentLanguage === 'ar' 
          ? 'مدعوم بواسطة استوديو الفضاء الذكي'
          : 'Powered by Of Space Studio AI'
        }
      </div>
    </div>
  );
};

export default PoweredBy;
