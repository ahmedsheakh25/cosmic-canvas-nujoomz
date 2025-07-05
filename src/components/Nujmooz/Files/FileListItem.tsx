import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Download, Copy, Trash2, MoreVertical, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { FILE_TYPE_CONFIG } from './config';
import type { FileListItemProps, FileAction } from './types';

export const FileListItem: React.FC<FileListItemProps> = ({
  file,
  isSelected,
  onAction,
  currentLanguage
}) => {
  const config = FILE_TYPE_CONFIG[file.type];
  const IconComponent = config.icon;

  const handleQuickAction = (action: FileAction, event: React.MouseEvent) => {
    event.stopPropagation();
    onAction(file.id, action);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        relative p-4 rounded-xl bg-gradient-to-r ${config.gradientColor} 
        hover:shadow-lg transition-all cursor-pointer
        ${isSelected ? 'ring-2 ring-[#ebb650]' : ''}
      `}
      onClick={() => onAction(file.id, 'view')}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/90 dark:bg-black/20 rounded-lg">
            <IconComponent className="w-5 h-5 text-[#2a2a2a] dark:text-white" />
          </div>
          <div>
            <h3 className="font-medium text-[#2a2a2a] dark:text-white">{file.title}</h3>
            <p className="text-sm text-[#a9a39b] mt-1">{file.summary}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/20"
            onClick={(e) => handleQuickAction('favorite', e)}
          >
            {file.isFavorite ? (
              <Star className="w-4 h-4 text-[#ebb650]" />
            ) : (
              <StarOff className="w-4 h-4 text-[#a9a39b]" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-white/20">
                <MoreVertical className="w-4 h-4 text-[#a9a39b]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => handleQuickAction('edit', e)}>
                <Edit className="w-4 h-4 mr-2" />
                {currentLanguage === 'ar' ? 'تعديل' : 'Edit'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleQuickAction('export', e)}>
                <Download className="w-4 h-4 mr-2" />
                {currentLanguage === 'ar' ? 'تصدير' : 'Export'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleQuickAction('copy', e)}>
                <Copy className="w-4 h-4 mr-2" />
                {currentLanguage === 'ar' ? 'نسخ' : 'Copy'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={(e) => handleQuickAction('delete', e)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {currentLanguage === 'ar' ? 'حذف' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}; 