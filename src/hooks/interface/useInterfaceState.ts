import type { InterfaceState } from './types';
import { usePanelState } from './usePanelState';

export const useInterfaceState = (): InterfaceState => {
  const leftPanel = usePanelState(true);
  const rightPanel = usePanelState(false);

  return {
    // Left Panel
    leftPanelOpen: leftPanel.isOpen,
    setLeftPanelOpen: leftPanel.setIsOpen,
    toggleLeftPanel: leftPanel.toggle,

    // Right Panel
    rightPanelOpen: rightPanel.isOpen,
    setRightPanelOpen: rightPanel.setIsOpen,
    toggleRightPanel: rightPanel.toggle,
    openRightPanel: rightPanel.open,
    closeRightPanel: rightPanel.close
  };
}; 