
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Calendar, User, FileText, MessageSquare, Plus, Download, Users, Activity, ExternalLink } from 'lucide-react';
import { generateBriefPDF } from '@/utils/pdfGenerator';

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

interface BriefNote {
  id: string;
  note: string;
  created_by: string;
  created_at: string;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: any;
}

interface EnhancedBriefDetailDialogProps {
  brief: ProjectBrief;
  teamMembers: TeamMember[];
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (briefId: string, status: string) => void;
  onAssignmentUpdate: (briefId: string, designerId: string) => void;
  onRefresh: () => void;
}

const EnhancedBriefDetailDialog: React.FC<EnhancedBriefDetailDialogProps> = ({
  brief,
  teamMembers,
  isOpen,
  onClose,
  onStatusUpdate,
  onAssignmentUpdate,
  onRefresh
}) => {
  const [notes, setNotes] = useState<BriefNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [internalNotes, setInternalNotes] = useState(brief.internal_notes || '');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && brief) {
      fetchNotes();
      fetchActivityLogs();
      setInternalNotes(brief.internal_notes || '');
    }
  }, [isOpen, brief]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('brief_notes')
        .select('*')
        .eq('project_brief_id', brief.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('brief_id', brief.id)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('brief_notes')
        .insert({
          project_brief_id: brief.id,
          note: newNote,
          created_by: 'Admin'
        });

      if (error) throw error;

      await logActivity('Note Added', `Added note: ${newNote.substring(0, 50)}...`);

      setNewNote('');
      fetchNotes();
      toast.success('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const updateInternalNotes = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('project_briefs')
        .update({ 
          internal_notes: internalNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', brief.id);

      if (error) throw error;

      await logActivity('Internal Notes Updated', 'Updated internal notes');
      
      toast.success('Internal notes updated successfully');
      onRefresh();
    } catch (error) {
      console.error('Error updating internal notes:', error);
      toast.error('Failed to update internal notes');
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (action: string, details: string) => {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          brief_id: brief.id,
          action,
          details: { description: details }
        });

      await supabase
        .from('admin_activity_log')
        .insert({
          action_type: action,
          description: details,
          project_brief_id: brief.id,
          created_by: 'Admin'
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const exportToPDF = async () => {
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
        projectTitle: brief.brief_data?.projectTitle || brief.brief_data?.title || 'Project Brief'
      };

      const pdfUrl = await generateBriefPDF(briefData, brief.id);
      
      if (pdfUrl) {
        await logActivity('PDF Export', 'Project brief exported to PDF successfully');
        
        // Open the PDF in a new tab
        window.open(pdfUrl, '_blank');
        
        toast.success('PDF generated and saved successfully!');
        onRefresh(); // Refresh the parent table to show PDF status
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const renderBriefData = (data: any) => {
    if (!data || typeof data !== 'object') {
      return <p className="text-gray-500">No data available</p>;
    }

    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => {
          if (value === null || value === undefined || value === '') return null;
          
          const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          
          return (
            <div key={key}>
              <dt className="font-semibold text-gray-900 mb-1">{formattedKey}:</dt>
              <dd className="text-gray-700">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </dd>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Enhanced Project Brief Management</span>
          </DialogTitle>
          <DialogDescription>
            Complete project brief management with assignment and tracking
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brief Information */}
            <Card>
              <CardHeader>
                <CardTitle>Brief Information</CardTitle>
              </CardHeader>
              <CardContent>
                {renderBriefData(brief.brief_data)}
              </CardContent>
            </Card>

            {/* Internal Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Internal Notes</span>
                </CardTitle>
                <CardDescription>
                  Private notes for internal team use
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add internal notes..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={4}
                />
                <Button 
                  onClick={updateInternalNotes} 
                  disabled={loading}
                  className="w-full"
                >
                  Update Internal Notes
                </Button>
              </CardContent>
            </Card>

            {/* Team Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Team Collaboration Notes</span>
                </CardTitle>
                <CardDescription>
                  Add notes for team collaboration and communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Add a team note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button onClick={addNote} disabled={loading || !newNote.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-800 mb-2">{note.note}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{note.created_by}</span>
                        <Calendar className="w-3 h-3 ml-2" />
                        <span>{new Date(note.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <p className="text-gray-500 text-sm">No team notes yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Activity Timeline</span>
                </CardTitle>
                <CardDescription>
                  Recent activities and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{log.action}</div>
                        {log.details?.description && (
                          <div className="text-sm text-gray-600">{log.details.description}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {activityLogs.length === 0 && (
                    <p className="text-gray-500 text-sm">No activity recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={exportToPDF} className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </Button>
                {brief.pdf_url && (
                  <Button 
                    onClick={() => window.open(brief.pdf_url, '_blank')} 
                    className="w-full" 
                    variant="outline"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Existing PDF
                  </Button>
                )}
                <Button onClick={onRefresh} className="w-full" variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>

            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Current Status</label>
                  <div className="mt-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {brief.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Update Status</label>
                  <Select onValueChange={(value) => onStatusUpdate(brief.id, value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Change status..." />
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
                </div>
              </CardContent>
            </Card>

            {/* Assignment Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Assignment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Currently Assigned To</label>
                  <div className="mt-2">
                    {brief.team_members ? (
                      <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">
                            {brief.team_members.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{brief.team_members.name}</div>
                          <div className="text-xs text-gray-500">{brief.team_members.role}</div>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-600">
                        Unassigned
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Assign Designer</label>
                  <Select onValueChange={(value) => onAssignmentUpdate(brief.id, value === 'unassigned' ? '' : value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose designer..." />
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
                </div>
              </CardContent>
            </Card>

            {/* Brief Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Brief Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-600">Brief ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{brief.id}</dd>
                </div>
                <Separator />
                <div>
                  <dt className="text-sm font-medium text-gray-600">User ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{brief.user_id}</dd>
                </div>
                <Separator />
                <div>
                  <dt className="text-sm font-medium text-gray-600">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(brief.created_at).toLocaleString()}
                  </dd>
                </div>
                <Separator />
                <div>
                  <dt className="text-sm font-medium text-gray-600">Last Updated</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(brief.updated_at).toLocaleString()}
                  </dd>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedBriefDetailDialog;
