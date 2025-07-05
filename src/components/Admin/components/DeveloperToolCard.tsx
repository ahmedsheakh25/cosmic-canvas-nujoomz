
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ChevronRight } from 'lucide-react';
import { DeveloperTool, ToolStatus } from '../types/DeveloperToolsTypes';
import { adminAnimations } from '../animations/AdminAnimations';

interface DeveloperToolCardProps {
  tool: DeveloperTool;
  toolStatus: ToolStatus;
  isSelected: boolean;
  onHover: (toolId: string | null) => void;
}

export const DeveloperToolCard: React.FC<DeveloperToolCardProps> = ({
  tool,
  toolStatus,
  isSelected,
  onHover
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      {...adminAnimations.cardHover}
      onHoverStart={() => onHover(tool.id)}
      onHoverEnd={() => onHover(null)}
    >
      <Card className="cursor-pointer group relative overflow-hidden h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <tool.icon className="w-5 h-5 text-purple-600" />
              </motion.div>
              <div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <Badge 
                  variant="outline" 
                  className={`mt-1 text-xs ${getStatusColor(toolStatus?.status || 'offline')}`}
                >
                  {tool.category}
                </Badge>
              </div>
            </div>
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ x: 5 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 flex-1 flex flex-col">
          <p className="text-gray-600 text-sm flex-1">{tool.description}</p>
          
          {/* Features list */}
          <div className="space-y-1">
            {tool.features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-2 text-xs text-gray-500"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                {feature}
              </motion.div>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-2 mt-auto">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                toolStatus?.status === 'online' ? 'bg-green-500' : 
                toolStatus?.status === 'testing' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-500">
                {toolStatus?.responseTime}
              </span>
            </div>
            
            <motion.div {...adminAnimations.buttonPress}>
              <Button
                onClick={tool.action}
                size="sm"
                className="flex items-center space-x-1 cosmic-button text-white border-none"
              >
                <Play className="w-3 h-3" />
                <span>Launch</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>

        {/* Hover overlay effect */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
