
import { useState } from 'react';
import { AssistantsManagerState } from '../types/AssistantsTypes';

export const useAssistantsManager = () => {
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null);
  const [assistantsModalOpen, setAssistantsModalOpen] = useState(false);
  const [promptsModalOpen, setPromptsModalOpen] = useState(false);
  const [assistantsManagerOpen, setAssistantsManagerOpen] = useState(false);
  const [promptsLibraryOpen, setPromptsLibraryOpen] = useState(false);

  return {
    selectedAssistant,
    setSelectedAssistant,
    assistantsModalOpen,
    setAssistantsModalOpen,
    promptsModalOpen,
    setPromptsModalOpen,
    assistantsManagerOpen,
    setAssistantsManagerOpen,
    promptsLibraryOpen,
    setPromptsLibraryOpen
  };
};
