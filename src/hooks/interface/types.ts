import { Dispatch, SetStateAction } from 'react';

export interface PanelState {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface PanelActions {
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export interface InterfaceState {
  // Left Panel
  leftPanelOpen: boolean;
  setLeftPanelOpen: Dispatch<SetStateAction<boolean>>;
  toggleLeftPanel: () => void;

  // Right Panel
  rightPanelOpen: boolean;
  setRightPanelOpen: Dispatch<SetStateAction<boolean>>;
  toggleRightPanel: () => void;
  openRightPanel: () => void;
  closeRightPanel: () => void;
} 