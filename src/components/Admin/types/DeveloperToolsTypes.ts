
export interface ToolStatus {
  name: string;
  status: 'online' | 'offline' | 'testing';
  lastCheck: string;
  responseTime: string;
}

export interface DeveloperTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  status: string;
  category: string;
  features: string[];
}

export interface DeveloperToolsState {
  selectedTool: string | null;
  apiTesterOpen: boolean;
  modelsManagerOpen: boolean;
  workflowTesterOpen: boolean;
  toolStatuses: ToolStatus[];
}
