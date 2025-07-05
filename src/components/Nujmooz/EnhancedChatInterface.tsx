
import React, { useState } from 'react';
import FloatingActionButtons from './FloatingActionButtons';
import SyncStatusIndicator from './SyncStatusIndicator';
import LearningIndicator from './LearningIndicator';
import { useDataManager } from '@/hooks/useDataManager';
import { useInteractiveMemory } from '@/hooks/useInteractiveMemory';

interface EnhancedChatInterfaceProps {
  sessionId: string;
  currentLanguage: 'en' | 'ar';
  children: React.ReactNode;
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  sessionId,
  currentLanguage,
  children
}) => {
  const [showInsights, setShowInsights] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  
  const dataManager = useDataManager(sessionId, currentLanguage);
  const interactiveMemory = useInteractiveMemory(sessionId, currentLanguage);
  
  // Create mock insights object for now since getSessionInsights doesn't exist
  const insights = {
    totalMessages: 0,
    userEngagement: 0,
    preferredLanguage: currentLanguage,
    projectProgress: 0
  };

  // Create mock sync status with valid value
  const syncStatus = 'idle' as const;

  return (
    <div className="relative">
      {/* Main Chat Interface */}
      {children}

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        showInsights={showInsights}
        setShowInsights={setShowInsights}
        showProgress={showProgress}
        setShowProgress={setShowProgress}
        insights={insights}
        currentLanguage={currentLanguage}
      />

      {/* Sync Status Indicator */}
      <SyncStatusIndicator
        syncStatus={syncStatus}
        currentLanguage={currentLanguage}
      />

      {/* Learning Indicator */}
      <LearningIndicator
        isLearning={interactiveMemory.isLearning}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default EnhancedChatInterface;
