
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Activity, Database, Globe } from 'lucide-react';
import { adminAnimations } from '../animations/AdminAnimations';

export const QuickActionsBar: React.FC = () => {
  return (
    <motion.div
      className="flex gap-3 justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <motion.div {...adminAnimations.buttonPress}>
        <Button variant="outline" className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          View All Logs
        </Button>
      </motion.div>
      <motion.div {...adminAnimations.buttonPress}>
        <Button variant="outline" className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          Database Status
        </Button>
      </motion.div>
      <motion.div {...adminAnimations.buttonPress}>
        <Button variant="outline" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          API Health
        </Button>
      </motion.div>
    </motion.div>
  );
};
