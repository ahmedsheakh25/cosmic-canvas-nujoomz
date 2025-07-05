import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardShell } from '@/layouts/DashboardShell';
import { SurveyInsightsCard } from '@/components/Admin/analytics/SurveyInsightsCard';
import { ConversationFunnel } from '@/components/Admin/analytics/ConversationFunnel';
import { EmotionTrendGraph } from '@/components/Admin/analytics/EmotionTrendGraph';
import { AnalyticsEngine } from '@/core/NujmoozEngine/AnalyticsEngine';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ElevenLabsTestPanel } from '@/components/Admin/ElevenLabsTestPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ConversationsViewer from '@/components/Admin/ConversationsViewer';

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
      <ConversationsViewer />
    </div>
  );
}

// Team Page Component
function TeamPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team members and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Active Members</h3>
                  <p className="text-sm text-muted-foreground">Currently active team members</p>
                </div>
                <Button>Add Member</Button>
              </div>
              <div className="divide-y">
                {/* Example team member */}
                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">Admin</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Overview of all ongoing projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Current Projects</h3>
                  <p className="text-sm text-muted-foreground">Projects in progress</p>
                </div>
                <Button>New Project</Button>
              </div>
              <div className="divide-y">
                {/* Example project */}
                <div className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Website Redesign</h4>
                      <p className="text-sm text-muted-foreground">Due in 2 weeks</p>
                    </div>
                    <Badge>In Progress</Badge>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Analytics Reports</CardTitle>
            <CardDescription>View and generate reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Available Reports</h3>
                  <p className="text-sm text-muted-foreground">Select a report to view</p>
                </div>
                <Button>Generate Report</Button>
              </div>
              <div className="divide-y">
                {/* Example report */}
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Monthly Usage Report</h4>
                    <p className="text-sm text-muted-foreground">Last generated: 2 days ago</p>
                  </div>
                  <Button variant="outline">View</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your application settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Application</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">Manage notification preferences</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">API Keys</p>
                      <p className="text-sm text-muted-foreground">Manage API keys and tokens</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
