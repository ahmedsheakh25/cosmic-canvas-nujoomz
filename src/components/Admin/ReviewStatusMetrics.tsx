
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Users, MessageCircle } from 'lucide-react';
import CosmicStatsCard from './CosmicStatsCard';
import { adminAnimations } from './animations/AdminAnimations';

interface ReviewStatusMetricsProps {
  underReview: number;
  needClarification: number;
}

const ReviewStatusMetrics: React.FC<ReviewStatusMetricsProps> = ({
  underReview,
  needClarification
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Eye className="w-5 h-5 text-purple-600" />
        حالة المراجعة
      </h3>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.div {...adminAnimations.cardHover}>
          <CosmicStatsCard
            title="تحت المراجعة"
            value={underReview}
            icon={Users}
            color="purple"
            description="يتم تقييمها من قبل الفريق"
          />
        </motion.div>
        
        <motion.div {...adminAnimations.cardHover}>
          <CosmicStatsCard
            title="تحتاج توضيح"
            value={needClarification}
            icon={MessageCircle}
            color="red"
            description="في انتظار رد العميل"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReviewStatusMetrics;
