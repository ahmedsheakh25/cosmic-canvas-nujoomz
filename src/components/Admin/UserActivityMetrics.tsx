
import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle } from 'lucide-react';
import CosmicStatsCard from './CosmicStatsCard';
import { adminAnimations } from './animations/AdminAnimations';

interface UserActivityMetricsProps {
  totalUsers: number;
  activeConversations: number;
}

const UserActivityMetrics: React.FC<UserActivityMetricsProps> = ({
  totalUsers,
  activeConversations
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-600" />
        نشاط المستخدمين
      </h3>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.div {...adminAnimations.cardHover}>
          <CosmicStatsCard
            title="إجمالي المستخدمين"
            value={totalUsers}
            icon={Users}
            color="blue"
            description="العدد الكلي للمستخدمين المسجلين"
          />
        </motion.div>
        
        <motion.div {...adminAnimations.cardHover}>
          <CosmicStatsCard
            title="المحادثات النشطة"
            value={activeConversations}
            icon={MessageCircle}
            color="green"
            description="المحادثات خلال آخر 24 ساعة"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserActivityMetrics;
