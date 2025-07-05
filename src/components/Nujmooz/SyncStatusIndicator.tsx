
import React from 'react';
import { motion } from 'framer-motion';

interface SyncStatusIndicatorProps {
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  currentLanguage: 'en' | 'ar';
}

const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  syncStatus,
  currentLanguage
}) => {
  const isArabic = currentLanguage === 'ar';

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'bg-yellow-500';
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing': return isArabic ? 'جاري الحفظ...' : 'Syncing...';
      case 'success': return isArabic ? 'محفوظ' : 'Saved';
      case 'error': return isArabic ? 'خطأ' : 'Error';
      default: return isArabic ? 'جاهز' : 'Ready';
    }
  };

  return (
    <motion.div
      className="fixed top-4 right-4 z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2">
        <div className="flex items-center space-x-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${getStatusColor()}`}
            animate={syncStatus === 'syncing' ? {
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-white/70 text-xs">
            {getStatusText()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SyncStatusIndicator;
