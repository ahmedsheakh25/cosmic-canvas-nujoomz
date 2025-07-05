
import { useState, useCallback } from 'react';

export interface DiagnosticLog {
  timestamp: string;
  step: string;
  data: any;
}

export const useDiagnosticLogs = () => {
  const [diagnosticLogs, setDiagnosticLogs] = useState<DiagnosticLog[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const addDiagnosticLog = useCallback((step: string, data: any) => {
    const logEntry: DiagnosticLog = {
      timestamp: new Date().toISOString(),
      step,
      data
    };
    setDiagnosticLogs(prev => [...prev, logEntry]);
  }, []);

  const clearDiagnosticLogs = useCallback(() => {
    setDiagnosticLogs([]);
  }, []);

  const toggleDiagnostics = useCallback(() => {
    setShowDiagnostics(prev => !prev);
  }, []);

  return {
    diagnosticLogs,
    showDiagnostics,
    addDiagnosticLog,
    clearDiagnosticLogs,
    toggleDiagnostics,
    setShowDiagnostics
  };
};
