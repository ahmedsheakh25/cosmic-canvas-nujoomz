
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Trash2, Bug, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { DiagnosticLog } from '@/hooks/useDiagnosticLogs';

interface DiagnosticLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logs: DiagnosticLog[];
  onClearLogs: () => void;
  title?: string;
}

export const DiagnosticLogsDialog: React.FC<DiagnosticLogsDialogProps> = ({
  open,
  onOpenChange,
  logs,
  onClearLogs,
  title = 'Diagnostic Logs'
}) => {
  const copyAllLogs = async () => {
    try {
      const logsText = logs.map(log => 
        `[${log.timestamp}] ${log.step}: ${JSON.stringify(log.data, null, 2)}`
      ).join('\n\n');
      
      await navigator.clipboard.writeText(logsText);
      toast.success('Diagnostic logs copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy logs');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatData = (data: any) => {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-purple-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {logs.length} entries
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllLogs}
              disabled={logs.length === 0}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearLogs}
              disabled={logs.length === 0}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[50vh] border rounded-lg">
          <div className="p-4 space-y-3">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bug className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No diagnostic logs available</p>
              </div>
            ) : (
              logs.map((log, index) => (
                <Card key={index} className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{log.step}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {formatTimestamp(log.timestamp)}
                      </Badge>
                    </div>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                      {formatData(log.data)}
                    </pre>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
