import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  fullScreen = false,
  className
}) => {
  const containerClasses = cn(
    'flex flex-col items-center justify-center space-y-4',
    fullScreen && 'min-h-screen bg-gray-50',
    className
  );

  return (
    <div className={containerClasses}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-green-600" />
        </motion.div>
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-sm text-gray-600 animate-pulse"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingState; 