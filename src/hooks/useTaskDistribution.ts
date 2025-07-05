
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Task {
  id: string;
  title: string;
  description: string;
  service_type: string;
  status: 'pending' | 'in_progress' | 'done';
  assigned_to?: string;
  priority: number;
  estimated_hours?: number;
}

export const useTaskDistribution = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDistributing, setIsDistributing] = useState(false);

  const distributeTasksAutomatically = useCallback(async (projectBriefId: string) => {
    setIsDistributing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('distribute-tasks', {
        body: { projectBriefId }
      });

      if (error) throw error;

      const newTasks = data.tasks;
      setTasks(newTasks);
      
      return newTasks;
    } catch (error) {
      console.error('Error distributing tasks:', error);
      return null;
    } finally {
      setIsDistributing(false);
    }
  }, []);

  const loadProjectTasks = useCallback(async (projectBriefId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          team_members(name, role)
        `)
        .eq('project_brief_id', projectBriefId)
        .order('priority', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        service_type: item.service_type,
        status: (item.status as 'pending' | 'in_progress' | 'done') || 'pending',
        assigned_to: item.assigned_to,
        priority: item.priority || 1,
        estimated_hours: item.estimated_hours
      })) || [];
      
      setTasks(transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }, []);

  const updateTaskStatus = useCallback(async (taskId: string, status: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }, []);

  return {
    tasks,
    isDistributing,
    distributeTasksAutomatically,
    loadProjectTasks,
    updateTaskStatus
  };
};
