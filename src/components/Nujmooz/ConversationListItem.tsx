
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Edit3, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type SavedConversation } from '@/types/conversation';

interface ConversationListItemProps {
  conversation: SavedConversation;
  currentLanguage: 'en' | 'ar';
  onLoad: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onUpdateTitle: (conversationId: string, newTitle: string) => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  currentLanguage,
  onLoad,
  onDelete,
  onUpdateTitle
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(conversation.title);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdateTitle(conversation.id, editTitle);
      setIsEditing(false);
      setEditTitle('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center space-x-2 mb-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-sm"
              />
              <Button 
                size="sm" 
                onClick={handleSaveEdit}
                disabled={!editTitle.trim()}
              >
                {currentLanguage === 'ar' ? 'حفظ' : 'Save'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleCancelEdit}
              >
                {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          ) : (
            <h3 className="font-medium mb-1">{conversation.title}</h3>
          )}
          
          <div className="flex items-center text-xs text-gray-500 space-x-2">
            <Calendar className="w-3 h-3" />
            <span>{conversation.createdAt.toLocaleDateString()}</span>
            <span>•</span>
            <span>
              {conversation.messages.length} {currentLanguage === 'ar' ? 'رسالة' : 'messages'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onLoad(conversation.id)}
          >
            <FolderOpen className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEdit}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(conversation.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationListItem;
