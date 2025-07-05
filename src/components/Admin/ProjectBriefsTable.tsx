
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import BriefDetailDialog from './BriefDetailDialog';

interface ProjectBrief {
  id: string;
  brief_data: any;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface ProjectBriefsTableProps {
  onStatsUpdate: () => void;
}

const ProjectBriefsTable: React.FC<ProjectBriefsTableProps> = ({ onStatsUpdate }) => {
  const [briefs, setBriefs] = useState<ProjectBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBrief, setSelectedBrief] = useState<ProjectBrief | null>(null);

  useEffect(() => {
    fetchBriefs();
  }, []);

  const fetchBriefs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_briefs')
        .select('*')
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

  const updateBriefStatus = async (briefId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('project_briefs')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', briefId);

      if (error) throw error;

      // Log the activity
      await supabase
        .from('admin_activity_log')
        .insert({
          action_type: 'Status Update',
          description: `Changed project brief status to ${newStatus}`,
          project_brief_id: briefId,
          created_by: 'Admin'
        });

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'New': { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      'Under Review': { variant: 'default' as const, color: 'bg-yellow-100 text-yellow-800' },
      'Need Clarification': { variant: 'destructive' as const, color: 'bg-orange-100 text-orange-800' },
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
    
    return matchesSearch && matchesStatus;
  });

  const extractProjectTitle = (briefData: any) => {
    if (typeof briefData === 'object' && briefData !== null) {
      return briefData.projectTitle || briefData.title || 'Untitled Project';
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
          <h2 className="text-2xl font-bold text-gray-900">Project Briefs</h2>
          <p className="text-gray-600 mt-1">Manage and review all project submissions</p>
        </div>
        <Button onClick={fetchBriefs} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search briefs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Need Clarification">Need Clarification</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Client Contacted">Client Contacted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredBriefs.length} of {briefs.length} briefs
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBriefs.map((brief) => (
                <TableRow key={brief.id}>
                  <TableCell className="font-medium">
                    {extractProjectTitle(brief.brief_data)}
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
                        <SelectItem value="Need Clarification">Need Clarification</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Client Contacted">Client Contacted</SelectItem>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBrief(brief)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
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

      {/* Brief Detail Dialog */}
      {selectedBrief && (
        <BriefDetailDialog
          brief={selectedBrief}
          isOpen={!!selectedBrief}
          onClose={() => setSelectedBrief(null)}
          onStatusUpdate={(briefId, status) => {
            updateBriefStatus(briefId, status);
            setSelectedBrief(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectBriefsTable;
