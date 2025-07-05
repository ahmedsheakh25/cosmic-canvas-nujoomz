import { useState, useCallback } from 'react';
import type { PanelState, PanelActions } from './types';

export const usePanelState = (initialState: boolean = false): PanelState & PanelActions => {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    setIsOpen,
    toggle,
    open,
    close
  };
}; 