
import React from 'react';
import { Code, TestTube, Settings, Bot, FileText, ExternalLink, Layers, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EnhancedAssistantsManager } from './components/EnhancedAssistantsManager';
import { PromptsLibrary } from './components/PromptsLibrary';
import { AnimatedPage, StaggerContainer, StaggerItem } from './animations/AdminAnimations';
import { DeveloperToolCard } from './components/DeveloperToolCard';
import { SystemStatusDashboard } from './components/SystemStatusDashboard';
import { QuickActionsBar } from './components/QuickActionsBar';
import { DeveloperToolsHeader } from './components/DeveloperToolsHeader';
import { ImportFormatGuide } from './components/ImportFormatGuide';
import { useDeveloperToolsState } from './hooks/useDeveloperToolsState';
import { useAssistantsManager } from './hooks/useAssistantsManager';
import { DeveloperTool, ToolStatus } from './types/DeveloperToolsTypes';
import APITesterModal from './modals/APITesterModal';
import ModelsManagerModal from './modals/ModelsManagerModal';
import WorkflowTesterModal from './modals/WorkflowTesterModal';
import AssistantsManagerModal from './modals/AssistantsManagerModal';
import PromptsLibraryModal from './modals/PromptsLibraryModal';

interface IntegratedDeveloperToolsProps {
  className?: string;
}

const IntegratedDeveloperTools: React.FC<IntegratedDeveloperToolsProps> = ({ className = "" }) => {
  const {
    selectedTool,
    setSelectedTool,
    apiTesterOpen,
    setApiTesterOpen,
    modelsManagerOpen,
    setModelsManagerOpen,
    workflowTesterOpen,
    setWorkflowTesterOpen,
    toolStatuses
  } = useDeveloperToolsState();

  const {
    assistantsModalOpen,
    setAssistantsModalOpen,
    promptsModalOpen,
    setPromptsModalOpen,
    assistantsManagerOpen,
    setAssistantsManagerOpen,
    promptsLibraryOpen,
    setPromptsLibraryOpen
  } = useAssistantsManager();

  const tools: DeveloperTool[] = [
    {
      id: 'api-test',
      title: 'Enhanced API Tester',
      description: 'Test all 13 Supabase Edge Functions with comprehensive coverage',
      icon: Code,
      action: () => setApiTesterOpen(true),
      status: 'active',
      category: 'Testing',
      features: ['13 Edge Functions', 'Real-time Testing', 'Response Validation', 'Arabic Support']
    },
    {
      id: 'models',
      title: 'AI Models Manager',
      description: 'View and manage OpenAI models with usage analytics',
      icon: Settings,
      action: () => setModelsManagerOpen(true),
      status: 'active',
      category: 'AI Management',
      features: ['Model Selection', 'Usage Analytics', 'Performance Metrics', 'Fine-tuned Models']
    },
    {
      id: 'workflow-test',
      title: 'Workflow Tester',
      description: 'Test complete Nujmooz workflow with conversation flows',
      icon: TestTube,
      action: () => setWorkflowTesterOpen(true),
      status: 'active',
      category: 'Testing',
      features: ['End-to-End Testing', 'Flow Validation', 'Performance Monitoring', 'Arabic Workflow']
    },
    {
      id: 'assistants',
      title: 'Import Assistant Configuration',
      description: 'Drag & drop .assistant.json files to automatically create OpenAI assistants',
      icon: Bot,
      action: () => setAssistantsModalOpen(true),
      status: 'active',
      category: 'AI Management',
      features: ['Drag & Drop Import', 'JSON Validation', 'Auto-sync to OpenAI', 'Configuration Preview']
    },
    {
      id: 'prompts',
      title: 'Import Prompts Collection',
      description: 'Drag & drop .prompts.json files to bulk import prompt collections',
      icon: FileText,
      action: () => setPromptsModalOpen(true),
      status: 'active',
      category: 'AI Management',
      features: ['Bulk Import', 'JSON Validation', 'Collection Preview', 'Batch Processing']
    }
  ];

  // Update tool statuses to include enhanced features
  const enhancedToolStatuses: ToolStatus[] = [
    ...toolStatuses,
    { name: 'Import Assistant Configuration', status: 'online' as const, lastCheck: '30 sec ago', responseTime: '120ms' },
    { name: 'Import Prompts Collection', status: 'online' as const, lastCheck: '45 sec ago', responseTime: '95ms' }
  ];

  return (
    <>
      <AnimatedPage className={`space-y-6 ${className}`}>
        <DeveloperToolsHeader />

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <StaggerItem key={tool.id}>
              <DeveloperToolCard
                tool={tool}
                toolStatus={enhancedToolStatuses[index]}
                isSelected={selectedTool === tool.id}
                onHover={setSelectedTool}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <SystemStatusDashboard toolStatuses={enhancedToolStatuses} />

        <QuickActionsBar />

        {/* Enhanced Management Access Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Assistants Manager Access */}
          <Card className="border-dashed border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-purple-900">Full Assistants Management</CardTitle>
                    <p className="text-sm text-purple-700 mt-1">Complete CRUD operations, OpenAI sync, and system diagnostics</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1 text-purple-600">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  Create & Edit
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  OpenAI Sync
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  Diagnostics
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImportFormatGuide />
                </div>
                <Button
                  onClick={() => setAssistantsManagerOpen(true)}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Layers className="w-4 h-4" />
                  <span>Open Manager</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Full Prompts Library Access */}
          <Card className="border-dashed border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-indigo-900">Full Prompts Library</CardTitle>
                    <p className="text-sm text-indigo-700 mt-1">Advanced prompts management with OpenAI integration</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1 text-indigo-600">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                  Library Management
                </div>
                <div className="flex items-center gap-1 text-indigo-600">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                  Bulk Operations
                </div>
                <div className="flex items-center gap-1 text-indigo-600">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                  Category Filters
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImportFormatGuide />
                </div>
                <Button
                  onClick={() => setPromptsLibraryOpen(true)}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Layers className="w-4 h-4" />
                  <span>Open Library</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedPage>

      {/* Enhanced Modals with OpenAI Integration */}
      <APITesterModal 
        isOpen={apiTesterOpen} 
        onClose={() => setApiTesterOpen(false)} 
      />
      
      <ModelsManagerModal 
        isOpen={modelsManagerOpen} 
        onClose={() => setModelsManagerOpen(false)} 
      />
      
      <WorkflowTesterModal 
        isOpen={workflowTesterOpen} 
        onClose={() => setWorkflowTesterOpen(false)} 
      />

      {/* Enhanced AI Management Modals */}
      <AssistantsManagerModal 
        isOpen={assistantsModalOpen} 
        onClose={() => setAssistantsModalOpen(false)} 
      />
      
      <PromptsLibraryModal 
        isOpen={promptsModalOpen} 
        onClose={() => setPromptsModalOpen(false)} 
      />

      {/* Full Management Interface Modals */}
      <Dialog open={assistantsManagerOpen} onOpenChange={setAssistantsManagerOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-6">
          <EnhancedAssistantsManager />
        </DialogContent>
      </Dialog>

      <Dialog open={promptsLibraryOpen} onOpenChange={setPromptsLibraryOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-6">
          <PromptsLibrary />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntegratedDeveloperTools;
