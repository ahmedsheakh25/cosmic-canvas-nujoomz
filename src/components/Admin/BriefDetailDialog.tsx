
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
import { Calendar, User, FileText, MessageSquare, Plus } from 'lucide-react';

interface ProjectBrief {
  id: string;
  brief_data: any;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface BriefNote {
  id: string;
  note: string;
  created_by: string;
  created_at: string;
}

interface BriefDetailDialogProps {
  brief: ProjectBrief;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (briefId: string, status: string) => void;
}

const BriefDetailDialog: React.FC<BriefDetailDialogProps> = ({
  brief,
  isOpen,
  onClose,
  onStatusUpdate
}) => {
  const [notes, setNotes] = useState<BriefNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && brief) {
      fetchNotes();
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

      // Log the activity
      await supabase
        .from('admin_activity_log')
        .insert({
          action_type: 'Note Added',
          description: `Added note to project brief`,
          project_brief_id: brief.id,
          created_by: 'Admin'
        });

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Project Brief Details</span>
          </DialogTitle>
          <DialogDescription>
            View and manage project brief information
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Brief Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brief Information</CardTitle>
              </CardHeader>
              <CardContent>
                {renderBriefData(brief.brief_data)}
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Internal Notes</span>
                </CardTitle>
                <CardDescription>
                  Add internal notes for team collaboration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addNote} disabled={loading || !newNote.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
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
                    <p className="text-gray-500 text-sm">No notes yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                      <SelectItem value="Need Clarification">Need Clarification</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Client Contacted">Client Contacted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

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

export default BriefDetailDialog;
