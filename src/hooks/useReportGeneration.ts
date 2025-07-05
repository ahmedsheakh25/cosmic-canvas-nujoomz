
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectReport {
  id: string;
  report_type: 'completion' | 'progress' | 'detailed';
  pdf_url?: string;
  thumbnail_url?: string;
  email_sent: boolean;
  generated_at: string;
}

export const useReportGeneration = () => {
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = useCallback(async (
    projectBriefId: string,
    reportType: 'completion' | 'progress' | 'detailed' = 'completion'
  ) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-project-report', {
        body: { 
          projectBriefId, 
          reportType,
          includeAnalytics: true,
          includeTasks: true
        }
      });

      if (error) throw error;

      const newReport = {
        id: data.reportId,
        report_type: reportType,
        pdf_url: data.pdfUrl,
        thumbnail_url: data.thumbnailUrl,
        email_sent: false,
        generated_at: new Date().toISOString()
      };

      setReports(prev => [newReport, ...prev]);
      return newReport;
    } catch (error) {
      console.error('Error generating report:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const sendReportByEmail = useCallback(async (reportId: string, emailAddress: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-report-email', {
        body: { reportId, emailAddress }
      });

      if (error) throw error;

      // Update report status
      await supabase
        .from('project_reports')
        .update({ 
          email_sent: true, 
          email_sent_at: new Date().toISOString() 
        })
        .eq('id', reportId);

      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, email_sent: true } 
          : report
      ));

      return true;
    } catch (error) {
      console.error('Error sending report by email:', error);
      return false;
    }
  }, []);

  const loadProjectReports = useCallback(async (projectBriefId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_reports')
        .select('*')
        .eq('project_brief_id', projectBriefId)
        .order('generated_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        id: item.id,
        report_type: (item.report_type as 'completion' | 'progress' | 'detailed') || 'completion',
        pdf_url: item.pdf_url,
        thumbnail_url: item.thumbnail_url,
        email_sent: item.email_sent || false,
        generated_at: item.generated_at
      })) || [];
      
      setReports(transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error loading reports:', error);
      return [];
    }
  }, []);

  return {
    reports,
    isGenerating,
    generateReport,
    sendReportByEmail,
    loadProjectReports
  };
};
