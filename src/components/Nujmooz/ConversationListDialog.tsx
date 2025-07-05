
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type SavedConversation } from '@/types/conversation';
import ConversationListItem from './ConversationListItem';

interface ConversationListDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentLanguage: 'en' | 'ar';
  conversations: SavedConversation[];
  isLoading: boolean;
  sessionId: string;
  onLoadConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onUpdateTitle: (conversationId: string, newTitle: string) => void;
}

const ConversationListDialog: React.FC<ConversationListDialogProps> = ({
  isOpen,
  onOpenChange,
  currentLanguage,
  conversations,
  isLoading,
  sessionId,
  onLoadConversation,
  onDeleteConversation,
  onUpdateTitle
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={!sessionId}>
          <FolderOpen className="w-4 h-4 mr-2" />
          {currentLanguage === 'ar' ? 'تحميل المحادثات' : 'Load Conversations'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {currentLanguage === 'ar' ? 'المحادثات المحفوظة' : 'Saved Conversations'}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh]">
          <div className="space-y-3">
            {isLoading && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                </p>
              </div>
            )}

            <AnimatePresence>
              {conversations.map((conversation) => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  currentLanguage={currentLanguage}
                  onLoad={(id) => {
                    onLoadConversation(id);
                    onOpenChange(false);
                  }}
                  onDelete={onDeleteConversation}
                  onUpdateTitle={onUpdateTitle}
                />
              ))}
            </AnimatePresence>
            
            {conversations.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                {currentLanguage === 'ar' ? 'لا توجد محادثات محفوظة' : 'No saved conversations'}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationListDialog;
