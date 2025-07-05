
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, TestTube, Settings, ExternalLink, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeveloperTools = () => {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'api-test',
      title: 'API Tester',
      description: 'Test Nujmooz API endpoints and validate responses',
      icon: <Code className="w-5 h-5" />,
      route: '/api-test',
      status: 'active',
      category: 'Testing'
    },
    {
      id: 'models',
      title: 'AI Models Manager',
      description: 'View and manage OpenAI models and their configurations',
      icon: <Settings className="w-5 h-5" />,
      route: '/models',
      status: 'active',
      category: 'AI Management'
    },
    {
      id: 'workflow-test',
      title: 'Workflow Tester',
      description: 'Test complete Nujmooz workflow and conversation flows',
      icon: <TestTube className="w-5 h-5" />,
      route: '/workflow-test',
      status: 'active',
      category: 'Testing'
    }
  ];

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'deprecated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-600" />
            Developer Tools
          </h2>
          <p className="text-gray-600 mt-1">
            Advanced tools for testing and managing Nujmooz functionality
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    {tool.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 text-xs ${getStatusColor(tool.status)}`}
                    >
                      {tool.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{tool.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className={getStatusColor(tool.status)}
                >
                  {tool.status}
                </Badge>
                
                <Button
                  onClick={() => handleNavigate(tool.route)}
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <span>Open Tool</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-blue-100 rounded">
              <Terminal className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Developer Note</h4>
              <p className="text-sm text-blue-700 mt-1">
                These tools are designed for development and testing purposes. 
                Use them to validate API responses, test conversation flows, and manage AI model configurations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperTools;
