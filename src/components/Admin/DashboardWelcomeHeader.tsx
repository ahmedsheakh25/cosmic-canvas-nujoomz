
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DashboardWelcomeHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

const DashboardWelcomeHeader: React.FC<DashboardWelcomeHeaderProps> = ({
  loading,
  onRefresh
}) => {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <motion.h2 
          className="text-3xl font-bold cosmic-gradient bg-clip-text text-transparent mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          لوحة تحكم الإدارة
        </motion.h2>
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          راقب مشاريع OfSpace Studio وأداء الفريق
        </motion.p>
      </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={onRefresh} 
          className="cosmic-button text-white border-none hover:shadow-lg"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          تحديث البيانات
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardWelcomeHeader;
