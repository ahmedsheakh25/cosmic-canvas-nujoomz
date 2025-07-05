import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, MoreVertical, Calendar, Users } from 'lucide-react';
import { CreateProjectDialog } from './CreateProjectDialog';
import { useProjectsState } from '@/hooks/useProjectsState';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from 'sonner';

const statusColors = {
  planned: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
};

export function ProjectList() {
  const { t } = useTranslations('admin');
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const { projects, isLoading, deleteProject } = useProjectsState();

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
      toast.success(t('projects.delete_success'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-4" />
                <div className="h-3 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                  <div className="h-3 w-1/4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('projects.title')}</CardTitle>
              <CardDescription>
                {t('projects.description')}
              </CardDescription>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('projects.create')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects?.map((project) => (
              <div
                key={project.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium">{project.name}</h3>
                    <Badge
                      variant="secondary"
                      className={statusColors[project.status]}
                    >
                      {t(`projects.status_options.${project.status}`)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {project.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      {format(new Date(project.deadline), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-gray-500" />
                      <div className="flex -space-x-2">
                        {project.team_members.slice(0, 3).map((member) => (
                          <Avatar
                            key={member.id}
                            className="border-2 border-white"
                          >
                            <AvatarImage src={member.avatar_url || undefined} />
                            <AvatarFallback>
                              {member.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.team_members.length > 3 && (
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white">
                            <span className="text-xs text-gray-600">
                              +{project.team_members.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {t('common.actions')}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {t('common.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {t('projects.view_details')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      {t('common.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
} 