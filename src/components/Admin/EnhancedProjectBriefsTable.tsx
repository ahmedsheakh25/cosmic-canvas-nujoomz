import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Eye, RefreshCw, Download, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';
import EnhancedBriefDetailDialog from './EnhancedBriefDetailDialog';
import { generateBriefPDF } from '@/utils/pdfGenerator';
import { sendUpdatedBriefNotification } from '@/utils/emailNotifications';

interface ProjectBrief {
  id: string;
  brief_data: any;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  internal_notes?: string;
  assigned_to?: string;
  pdf_url?: string;
  team_members?: {
    id: string;
    name: string;
    role: string;
  };
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface EnhancedProjectBriefsTableProps {
  onStatsUpdate: () => void;
}

const EnhancedProjectBriefsTable: React.FC<EnhancedProjectBriefsTableProps> = ({ onStatsUpdate }) => {
  const [briefs, setBriefs] = useState<ProjectBrief[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [selectedBrief, setSelectedBrief] = useState<ProjectBrief | null>(null);

  useEffect(() => {
    fetchBriefs();
    fetchTeamMembers();
  }, []);

  const fetchBriefs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_briefs')
        .select(`
          *,
          team_members (
            id,
            name,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBriefs(data || []);
    } catch (error) {
      console.error('Error fetching briefs:', error);
      toast.error('Failed to fetch project briefs');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const updateBriefStatus = async (briefId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('project_briefs')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', briefId);

      if (error) throw error;

      // Get the updated brief for email notification
      const updatedBrief = briefs.find(brief => brief.id === briefId);
      if (updatedBrief) {
        const briefWithUpdatedStatus = {
          ...updatedBrief,
          status: newStatus,
          updated_at: new Date().toISOString()
        };

        // Send email notification for status update
        try {
          await sendUpdatedBriefNotification(briefWithUpdatedStatus);
          console.log('Email notification sent for status update');
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          // Don't fail the main operation if email fails
        }
      }

      // Log the activity
      await logActivity(briefId, 'Status Update', `Changed status to ${newStatus}`);

      setBriefs(prev => prev.map(brief => 
        brief.id === briefId 
          ? { ...brief, status: newStatus, updated_at: new Date().toISOString() }
          : brief
      ));

      onStatsUpdate();
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const assignDesigner = async (briefId: string, designerId: string) => {
    try {
      const { error } = await supabase
        .from('project_briefs')
        .update({ assigned_to: designerId || null, updated_at: new Date().toISOString() })
        .eq('id', briefId);

      if (error) throw error;

      const designer = teamMembers.find(tm => tm.id === designerId);
      const action = designerId ? `Assigned to ${designer?.name}` : 'Unassigned designer';
      
      // Get the updated brief for email notification
      const updatedBrief = briefs.find(brief => brief.id === briefId);
      if (updatedBrief) {
        const briefWithUpdatedAssignment = {
          ...updatedBrief,
          assigned_to: designerId || null,
          updated_at: new Date().toISOString()
        };

        // Send email notification for assignment update
        try {
          await sendUpdatedBriefNotification(briefWithUpdatedAssignment);
          console.log('Email notification sent for assignment update');
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          // Don't fail the main operation if email fails
        }
      }
      
      await logActivity(briefId, 'Assignment', action);

      setBriefs(prev => prev.map(brief => 
        brief.id === briefId 
          ? { 
              ...brief, 
              assigned_to: designerId || null, 
              updated_at: new Date().toISOString(),
              team_members: designer || null
            }
          : brief
      ));

      toast.success(designerId ? 'Designer assigned successfully' : 'Designer unassigned');
    } catch (error) {
      console.error('Error assigning designer:', error);
      toast.error('Failed to assign designer');
    }
  };

  const logActivity = async (briefId: string, action: string, details: string) => {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          brief_id: briefId,
          action,
          details: { description: details }
        });

      await supabase
        .from('admin_activity_log')
        .insert({
          action_type: action,
          description: details,
          project_brief_id: briefId,
          created_by: 'Admin'
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const exportToPDF = async (brief: ProjectBrief) => {
    try {
      toast.info('Generating PDF, please wait...');
      
      // Convert brief_data to the expected format
      const briefData = {
        service: brief.brief_data?.service || 'Not specified',
        description: brief.brief_data?.description || brief.brief_data?.projectDescription || 'No description provided',
        audience: brief.brief_data?.audience || brief.brief_data?.targetAudience || 'Not specified',
        style: brief.brief_data?.style || brief.brief_data?.preferredStyle || 'Not specified',
        budget: brief.brief_data?.budget || 'Not specified',
        deadline: brief.brief_data?.deadline || brief.brief_data?.timeline || 'Not specified',
        language: brief.brief_data?.language || 'en',
        projectTitle: brief.brief_data?.projectTitle || brief.brief_data?.title || extractProjectTitle(brief.brief_data)
      };

      const pdfUrl = await generateBriefPDF(briefData, brief.id);
      
      if (pdfUrl) {
        // Update the brief in local state
        setBriefs(prev => prev.map(b => 
          b.id === brief.id 
            ? { ...b, pdf_url: pdfUrl, updated_at: new Date().toISOString() }
            : b
        ));

        await logActivity(brief.id, 'PDF Export', 'Project brief exported to PDF successfully');
        
        // Open the PDF in a new tab
        window.open(pdfUrl, '_blank');
        
        toast.success('PDF generated and saved successfully!');
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'New': { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      'Under Review': { variant: 'default' as const, color: 'bg-yellow-100 text-yellow-800' },
      'In Progress': { variant: 'default' as const, color: 'bg-orange-100 text-orange-800' },
      'Need Clarification': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      'Completed': { variant: 'outline' as const, color: 'bg-green-100 text-green-800' },
      'Client Contacted': { variant: 'outline' as const, color: 'bg-purple-100 text-purple-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['New'];
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {status}
      </Badge>
    );
  };

  const filteredBriefs = briefs.filter(brief => {
    const matchesSearch = searchTerm === '' || 
      JSON.stringify(brief.brief_data).toLowerCase().includes(searchTerm.toLowerCase()) ||
      brief.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || brief.status === statusFilter;
    const matchesAssignee = assigneeFilter === 'all' || 
      (assigneeFilter === 'unassigned' && !brief.assigned_to) ||
      brief.assigned_to === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const extractProjectTitle = (briefData: any) => {
    if (typeof briefData === 'object' && briefData !== null) {
      return briefData.projectTitle || briefData.title || briefData.service || 'Untitled Project';
    }
    return 'Untitled Project';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Project Briefs</h2>
          <p className="text-gray-600 mt-1">Advanced management with assignment and tracking</p>
        </div>
        <Button onClick={fetchBriefs} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Advanced Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search briefs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Need Clarification">Need Clarification</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Client Contacted">Client Contacted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger>
                <Users className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredBriefs.length} of {briefs.length} briefs
      </div>

      {/* Enhanced Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBriefs.map((brief) => (
                <TableRow key={brief.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{extractProjectTitle(brief.brief_data)}</div>
                      <div className="text-xs text-gray-500">ID: {brief.id.slice(0, 8)}...</div>
                      {brief.pdf_url && (
                        <div className="text-xs text-green-600 flex items-center mt-1">
                          <FileText className="w-3 h-3 mr-1" />
                          PDF Available
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={brief.status}
                      onValueChange={(value) => updateBriefStatus(brief.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        {getStatusBadge(brief.status)}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Need Clarification">Need Clarification</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Client Contacted">Client Contacted</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={brief.assigned_to || 'unassigned'}
                      onValueChange={(value) => assignDesigner(brief.id, value === 'unassigned' ? '' : value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {brief.team_members ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-purple-600">
                                  {brief.team_members.name.charAt(0)}
                                </span>
                              </div>
                              <span className="text-sm">{brief.team_members.name}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500">Unassigned</span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-purple-600">
                                  {member.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-xs text-gray-500">{member.role}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(brief.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(brief.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBrief(brief)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => exportToPDF(brief)}
                        title="Generate PDF"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {brief.pdf_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(brief.pdf_url, '_blank')}
                          title="View existing PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredBriefs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No project briefs found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Brief Detail Dialog */}
      {selectedBrief && (
        <EnhancedBriefDetailDialog
          brief={selectedBrief}
          teamMembers={teamMembers}
          isOpen={!!selectedBrief}
          onClose={() => setSelectedBrief(null)}
          onStatusUpdate={(briefId, status) => {
            updateBriefStatus(briefId, status);
            setSelectedBrief(null);
          }}
          onAssignmentUpdate={(briefId, designerId) => {
            assignDesigner(briefId, designerId);
            // Update the selected brief to reflect the change
            const designer = teamMembers.find(tm => tm.id === designerId);
            setSelectedBrief(prev => prev ? {
              ...prev,
              assigned_to: designerId || null,
              team_members: designer || null
            } : null);
          }}
          onRefresh={fetchBriefs}
        />
      )}
    </div>
  );
};

export default EnhancedProjectBriefsTable;
