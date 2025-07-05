
import { useState } from 'react';
import { DeveloperToolsState, ToolStatus } from '../types/DeveloperToolsTypes';

export const useDeveloperToolsState = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [apiTesterOpen, setApiTesterOpen] = useState(false);
  const [modelsManagerOpen, setModelsManagerOpen] = useState(false);
  const [workflowTesterOpen, setWorkflowTesterOpen] = useState(false);
  
  const [toolStatuses] = useState<ToolStatus[]>([
    { name: 'API Tester', status: 'online', lastCheck: '2 mins ago', responseTime: '245ms' },
    { name: 'Models Manager', status: 'online', lastCheck: '1 min ago', responseTime: '180ms' },
    { name: 'Workflow Tester', status: 'testing', lastCheck: 'Now', responseTime: '320ms' },
  ]);

  return {
    selectedTool,
    setSelectedTool,
    apiTesterOpen,
    setApiTesterOpen,
    modelsManagerOpen,
    setModelsManagerOpen,
    workflowTesterOpen,
    setWorkflowTesterOpen,
    toolStatuses
  };
};
