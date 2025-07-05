
import React from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import RequestHelpButton from './RequestHelpButton';

interface ChatDialogsProps {
  showConfirmationDialog: boolean;
  currentLanguage: 'en' | 'ar';
  onConfirmationContinue: () => void;
  onConfirmationEdit: () => void;
  onConfirmationRequestHelp: () => void;
  sessionId: string | null;
}

const ChatDialogs: React.FC<ChatDialogsProps> = ({
  showConfirmationDialog,
  currentLanguage,
  onConfirmationContinue,
  onConfirmationEdit,
  onConfirmationRequestHelp,
  sessionId
}) => {
  return (
    <>
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmationDialog}
        currentLanguage={currentLanguage}
        onContinue={onConfirmationContinue}
        onEdit={onConfirmationEdit}
        onRequestHelp={onConfirmationRequestHelp}
      />

      {/* Request Help Button */}
      {sessionId && (
        <RequestHelpButton
          sessionId={sessionId}
          currentLanguage={currentLanguage}
        />
      )}
    </>
  );
};

export default ChatDialogs;
