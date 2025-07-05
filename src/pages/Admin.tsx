import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardShell } from '@/layouts/DashboardShell';
import { SurveyInsightsCard } from '@/components/Admin/analytics/SurveyInsightsCard';
import { ConversationFunnel } from '@/components/Admin/analytics/ConversationFunnel';
import { EmotionTrendGraph } from '@/components/Admin/analytics/EmotionTrendGraph';
import { AnalyticsEngine } from '@/core/NujmoozEngine/AnalyticsEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ElevenLabsTestPanel } from '@/components/Admin/ElevenLabsTestPanel';

// Dashboard Overview Component
function AdminDashboard() {
  const analyticsEngine = AnalyticsEngine.getInstance();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Real-time analytics and insights from user interactions
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surveys">Survey Insights</TabsTrigger>
          <TabsTrigger value="emotions">Emotional Analysis</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="voice">🎤 Voice Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,350</div>
                <p className="text-xs text-muted-foreground">+180 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">+22 from last hour</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32%</div>
                <p className="text-xs text-muted-foreground">+2% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-muted-foreground">-0.1s from last week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <EmotionTrendGraph />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Activity items */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="surveys" className="space-y-8">
          <SurveyInsightsCard />
        </TabsContent>

        <TabsContent value="emotions" className="space-y-8">
          <EmotionTrendGraph />
        </TabsContent>

        <TabsContent value="funnel" className="space-y-8">
          <ConversationFunnel />
        </TabsContent>

        <TabsContent value="voice" className="space-y-8">
          <div className="grid gap-6">
            <ElevenLabsTestPanel />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Analytics Page Component
function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      <div className="grid gap-6">
        <EmotionTrendGraph />
        <ConversationFunnel />
        <SurveyInsightsCard />
      </div>
    </div>
  );
}

// Conversations Page Component
function ConversationsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Conversations</h2>
      <div className="grid gap-6">
        {/* Add your conversations content here */}
      </div>
    </div>
  );
}

// Team Page Component
function TeamPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
      <div className="grid gap-6">
        {/* Add your team management content here */}
      </div>
    </div>
  );
}

// Projects Page Component
function ProjectsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      <div className="grid gap-6">
        {/* Add your projects content here */}
      </div>
    </div>
  );
}

// Reports Page Component
function ReportsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
      <div className="grid gap-6">
        {/* Add your reports content here */}
      </div>
    </div>
  );
}

// Settings Page Component
function SettingsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <div className="grid gap-6">
        {/* Add your settings content here */}
      </div>
    </div>
  );
}

// Main Admin Component with Routes
export default function Admin() {
  return (
    <DashboardShell>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="conversations" element={<ConversationsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardShell>
  );
}
