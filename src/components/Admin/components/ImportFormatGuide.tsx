import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, FileJson, Info, Download, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const ImportFormatGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const assistantSampleJson = {
    name: "Customer Support Assistant",
    description: "Handles customer inquiries with friendly and professional responses",
    instructions: "You are a helpful customer support assistant. Always be polite, professional, and try to resolve customer issues efficiently. If you cannot solve a problem, escalate to a human agent.",
    model: "gpt-4.1-2025-04-14",
    temperature: 0.7,
    top_p: 1.0,
    tools: [
      { type: "code_interpreter" },
      { type: "file_search" }
    ],
    metadata: {
      department: "support",
      created_by: "admin",
      version: "1.0"
    }
  };

  const promptsSampleJson = {
    metadata: {
      version: "1.0",
      created_at: "2025-01-02",
      description: "Marketing campaign prompts collection"
    },
    prompts: [
      {
        title: "Social Media Post Generator",
        description: "Creates engaging social media posts for different platforms",
        content: "Create an engaging social media post for [PLATFORM] about [TOPIC]. The tone should be [TONE] and include relevant hashtags. Target audience: [AUDIENCE].",
        category: "marketing",
        tags: ["social-media", "content", "marketing"],
        is_template: true,
        is_public: false
      },
      {
        title: "Email Subject Line Creator",
        description: "Generates compelling email subject lines",
        content: "Write 5 compelling email subject lines for [EMAIL_TYPE] targeting [AUDIENCE]. The email is about [TOPIC] and should achieve [GOAL].",
        category: "marketing",
        tags: ["email", "subject-lines", "marketing"],
        is_template: true,
        is_public: false
      },
      {
        title: "Product Description Writer",
        description: "Creates detailed product descriptions",
        content: "Write a compelling product description for [PRODUCT_NAME]. Key features: [FEATURES]. Target audience: [AUDIENCE]. Focus on benefits and include a call-to-action.",
        category: "copywriting",
        tags: ["product", "description", "sales"],
        is_template: true,
        is_public: false
      }
    ]
  };

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`${type} sample copied to clipboard`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadSample = (content: object, filename: string) => {
    const jsonString = JSON.stringify(content, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          Format Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            Import Format Guide & Examples
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Assistant Format */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Assistant Configuration Format (.assistant.json)</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(assistantSampleJson, null, 2), 'Assistant')}
                    className="flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadSample(assistantSampleJson, 'sample.assistant.json')}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Required Fields:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li><Badge variant="outline">name</Badge> - Assistant name</li>
                      <li><Badge variant="outline">instructions</Badge> - System prompt</li>
                      <li><Badge variant="outline">model</Badge> - OpenAI model</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Optional Fields:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li><Badge variant="secondary">description</Badge> - Brief description</li>
                      <li><Badge variant="secondary">temperature</Badge> - Response randomness</li>
                      <li><Badge variant="secondary">top_p</Badge> - Nucleus sampling</li>
                      <li><Badge variant="secondary">tools</Badge> - Available tools</li>
                      <li><Badge variant="secondary">metadata</Badge> - Custom metadata</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sample JSON:</h4>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(assistantSampleJson, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prompts Format */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Prompts Format (.prompts.json)
              </CardTitle>
              <div className="text-sm text-gray-500">
                <p>Format for importing prompt collections.</p>
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important Note</AlertTitle>
                  <AlertDescription>
                    Imported prompts are stored in your local database and can be used within the application.
                    However, they will not appear in the OpenAI Playground UI. This is a limitation of OpenAI's API.
                  </AlertDescription>
                </Alert>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Structure:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li><Badge variant="outline">prompts[]</Badge> - Array of prompts</li>
                      <li><Badge variant="secondary">metadata</Badge> - Collection info</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Prompt Fields:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li><Badge variant="outline">title</Badge> - Prompt name</li>
                      <li><Badge variant="outline">content</Badge> - Prompt text</li>
                      <li><Badge variant="secondary">description</Badge> - Brief description</li>
                      <li><Badge variant="secondary">category</Badge> - Prompt category</li>
                      <li><Badge variant="secondary">tags[]</Badge> - Tags array</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sample JSON:</h4>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(promptsSampleJson, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools Format */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">🔧 Tools Format Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-green-800">
              <div>
                <h4 className="font-medium mb-2">Supported Tools:</h4>
                <ul className="space-y-1">
                  <li>• <code className="bg-white px-1 rounded">code_interpreter</code> - Run Python code</li>
                  <li>• <code className="bg-white px-1 rounded">file_search</code> - Search uploaded files</li>
                  <li>• <code className="bg-white px-1 rounded">function</code> - Custom functions (requires definition)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Format Options:</h4>
                <div className="bg-white p-2 rounded text-xs">
                  <div className="text-green-600 mb-1">// String format (auto-converted):</div>
                  <code>"tools": ["code_interpreter", "file_search"]</code>
                  <div className="text-green-600 mt-2 mb-1">// Object format (recommended):</div>
                  <code>"tools": [{"{"}"type": "code_interpreter"{"}"}, {"{"}"type": "file_search"{"}"}]</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">💡 Import Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-800">
              <p>• Use descriptive names and clear instructions for better results</p>
              <p>• Test your JSON files in a validator before importing</p>
              <p>• Include relevant metadata for easier organization</p>
              <p>• Use templates (is_template: true) for reusable prompts</p>
              <p>• Organize prompts with categories and tags</p>
              <p>• Keep file sizes reasonable (under 10MB recommended)</p>
              <p>• Tools can be specified as strings or objects - both formats work</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportFormatGuide;