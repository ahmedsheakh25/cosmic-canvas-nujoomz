
import { useState } from 'react';

export const useInterfaceState = () => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  const toggleLeftPanel = () => {
    setLeftPanelOpen(prev => !prev);
  };

  const toggleRightPanel = () => {
    setRightPanelOpen(prev => !prev);
  };

  const openRightPanel = () => {
    setRightPanelOpen(true);
  };

  const closeRightPanel = () => {
    setRightPanelOpen(false);
  };

  return {
    leftPanelOpen,
    rightPanelOpen,
    setLeftPanelOpen,
    setRightPanelOpen,
    toggleLeftPanel,
    toggleRightPanel,
    openRightPanel,
    closeRightPanel
  };
};
