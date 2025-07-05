
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import CosmicStatsCard from './CosmicStatsCard';
import { StaggerContainer, StaggerItem, adminAnimations } from './animations/AdminAnimations';

interface ProjectStatusMetricsProps {
  totalBriefs: number;
  newBriefs: number;
  inProgress: number;
  completed: number;
}

const ProjectStatusMetrics: React.FC<ProjectStatusMetricsProps> = ({
  totalBriefs,
  newBriefs,
  inProgress,
  completed
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-purple-600" />
        حالة المشاريع
      </h3>
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StaggerItem>
          <motion.div {...adminAnimations.cardHover}>
            <CosmicStatsCard
              title="إجمالي المشاريع"
              value={totalBriefs}
              icon={FileText}
              color="purple"
              trend={{ value: 12, direction: 'up' }}
              description="جميع المشاريع المستلمة"
            />
          </motion.div>
        </StaggerItem>
        
        <StaggerItem>
          <motion.div {...adminAnimations.cardHover}>
            <CosmicStatsCard
              title="طلبات جديدة"
              value={newBriefs}
              icon={AlertCircle}
              color="blue"
              trend={{ value: 8, direction: 'up' }}
              description="في انتظار المراجعة الأولية"
            />
          </motion.div>
        </StaggerItem>
        
        <StaggerItem>
          <motion.div {...adminAnimations.cardHover}>
            <CosmicStatsCard
              title="قيد التنفيذ"
              value={inProgress}
              icon={Clock}
              color="orange"
              trend={{ value: 3, direction: 'down' }}
              description="يتم العمل عليها حاليًا"
            />
          </motion.div>
        </StaggerItem>
        
        <StaggerItem>
          <motion.div {...adminAnimations.cardHover}>
            <CosmicStatsCard
              title="مكتملة"
              value={completed}
              icon={CheckCircle}
              color="green"
              trend={{ value: 15, direction: 'up' }}
              description="تم التسليم بنجاح"
            />
          </motion.div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
};

export default ProjectStatusMetrics;
