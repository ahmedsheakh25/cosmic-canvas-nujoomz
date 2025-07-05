
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface QuickInsightsPanelProps {
  totalBriefs: number;
  completed: number;
  newBriefs: number;
  inProgress: number;
  needClarification: number;
  underReview: number;
  activeConversations: number;
  totalUsers: number;
}

const QuickInsightsPanel: React.FC<QuickInsightsPanelProps> = ({
  totalBriefs,
  completed,
  newBriefs,
  inProgress,
  needClarification,
  underReview,
  activeConversations,
  totalUsers
}) => {
  const completionRate = totalBriefs > 0 ? Math.round((completed / totalBriefs) * 100) : 0;
  const activeProjects = newBriefs + inProgress;
  const needAttention = needClarification + underReview;
  const engagementRate = activeConversations > 0 ? Math.round((activeConversations / Math.max(totalUsers, 1)) * 100) : 0;

  return (
    <motion.div 
      className="dashboard-card rounded-xl p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-purple-600" />
        إحصائيات سريعة
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl font-bold cosmic-gradient bg-clip-text text-transparent">
            {completionRate}%
          </div>
          <div className="text-sm text-gray-600">معدل الإنجاز</div>
        </motion.div>
        
        <motion.div 
          className="text-center p-4 bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl font-bold cosmic-gradient bg-clip-text text-transparent">
            {activeProjects}
          </div>
          <div className="text-sm text-gray-600">المشاريع النشطة</div>
        </motion.div>
        
        <motion.div 
          className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl font-bold cosmic-gradient bg-clip-text text-transparent">
            {needAttention}
          </div>
          <div className="text-sm text-gray-600">تحتاج انتباه</div>
        </motion.div>
        
        <motion.div 
          className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl font-bold cosmic-gradient bg-clip-text text-transparent">
            {engagementRate}%
          </div>
          <div className="text-sm text-gray-600">معدل التفاعل</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuickInsightsPanel;
