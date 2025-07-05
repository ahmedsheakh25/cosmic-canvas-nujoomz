import React from 'react';
import { DashboardShell } from '@/layouts/DashboardShell';
import { ProjectList } from '@/components/Admin/Projects/ProjectList';
import { useTranslations } from '@/hooks/useTranslations';

export default function ProjectsPage() {
  const { t } = useTranslations('admin');

  return (
    <DashboardShell
      title={t('projects.title')}
      description={t('projects.description')}
    >
      <div className="space-y-6">
        <ProjectList />
      </div>
    </DashboardShell>
  );
} 