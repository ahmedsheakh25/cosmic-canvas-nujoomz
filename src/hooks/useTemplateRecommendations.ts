
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectTemplate {
  id: string;
  service_type: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  template_data: any;
  usage_count: number;
}

export const useTemplateRecommendations = () => {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [recommendedTemplates, setRecommendedTemplates] = useState<ProjectTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAllTemplates = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) throw error;
      
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRecommendedTemplates = useCallback(async (
    serviceType: string,
    userPreferences?: any
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('recommend-templates', {
        body: { 
          serviceType, 
          userPreferences,
          limit: 6
        }
      });

      if (error) throw error;
      
      setRecommendedTemplates(data.templates || []);
      return data.templates;
    } catch (error) {
      console.error('Error getting template recommendations:', error);
      return [];
    }
  }, []);

  const useTemplate = useCallback(async (templateId: string) => {
    try {
      // First, get current usage count
      const { data: currentTemplate, error: fetchError } = await supabase
        .from('project_templates')
        .select('usage_count')
        .eq('id', templateId)
        .single();

      if (fetchError) throw fetchError;

      // Increment usage count
      const { error: updateError } = await supabase
        .from('project_templates')
        .update({ 
          usage_count: (currentTemplate.usage_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', templateId);

      if (updateError) throw updateError;

      // Get updated template data
      const { data, error } = await supabase
        .from('project_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error using template:', error);
      return null;
    }
  }, []);

  const searchTemplates = useCallback(async (query: string, serviceType?: string) => {
    try {
      let queryBuilder = supabase
        .from('project_templates')
        .select('*')
        .textSearch('title', query);

      if (serviceType) {
        queryBuilder = queryBuilder.eq('service_type', serviceType);
      }

      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error searching templates:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    loadAllTemplates();
  }, [loadAllTemplates]);

  return {
    templates,
    recommendedTemplates,
    isLoading,
    loadAllTemplates,
    getRecommendedTemplates,
    useTemplate,
    searchTemplates
  };
};
