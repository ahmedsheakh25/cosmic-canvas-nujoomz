import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Row'] & {
  owner: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  team_members: Array<{
    id: string;
    full_name: string;
    avatar_url: string | null;
  }>;
};

export function useProjectsState() {
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          description,
          status,
          deadline,
          owner:owner_id(id, full_name, avatar_url),
          team_members:team_members(user_profiles(id, full_name, avatar_url))
        `)
        .order('deadline', { ascending: true });

      if (error) throw error;

      // Transform the nested team members data structure
      return (data as any[]).map(project => ({
        ...project,
        team_members: project.team_members.map((tm: any) => tm.user_profiles),
      })) as Project[];
    },
  });

  const createProject = useMutation({
    mutationFn: async (values: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'owner' | 'team_members'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...values,
          owner_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, ...values }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(values)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const addTeamMember = useMutation({
    mutationFn: async ({
      projectId,
      userId,
      role,
    }: {
      projectId: string;
      userId: string;
      role: 'admin' | 'manager' | 'editor' | 'viewer';
    }) => {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          project_id: projectId,
          user_id: userId,
          role,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const removeTeamMember = useMutation({
    mutationFn: async ({ projectId, userId }: { projectId: string; userId: string }) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
  };
} 