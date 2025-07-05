
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import RoleAssignmentForm from './RoleAssignmentForm';
import RoleSearchFilter from './RoleSearchFilter';
import UserRolesList from './UserRolesList';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
  user_email?: string;
}

const RoleManagement: React.FC = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get the current user to check if they have admin access
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        console.error('No authenticated user found');
        setUserRoles([]);
        return;
      }

      // Try to fetch users via admin API (this may fail if user doesn't have admin access)
      try {
        const { data: usersResponse, error: usersError } = await supabase.auth.admin.listUsers();
        
        if (usersError) {
          console.error('Error fetching user emails:', usersError);
          // If we can't fetch users, just show the roles without email addresses
          const rolesWithoutEmails = data?.map(role => ({
            ...role,
            user_email: 'Email not available'
          })) || [];
          setUserRoles(rolesWithoutEmails);
          return;
        }

        const users: User[] = usersResponse?.users || [];
        const rolesWithEmails = data?.map(role => ({
          ...role,
          user_email: users.find(user => user.id === role.user_id)?.email || 'Unknown'
        })) || [];

        setUserRoles(rolesWithEmails);
      } catch (adminError) {
        console.error('Admin API error:', adminError);
        // Fallback: show roles without email addresses
        const rolesWithoutEmails = data?.map(role => ({
          ...role,
          user_email: 'Email not available'
        })) || [];
        setUserRoles(rolesWithoutEmails);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast.error('Failed to load user roles');
    } finally {
      setLoading(false);
    }
  };

  const removeRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast.success('Role removed successfully');
      fetchUserRoles();
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Role Management
        </CardTitle>
        <CardDescription>
          Manage user roles and permissions for the OfSpace Studio platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RoleAssignmentForm onRoleAssigned={fetchUserRoles} />
        <RoleSearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <UserRolesList 
          userRoles={userRoles} 
          searchTerm={searchTerm} 
          onRemoveRole={removeRole} 
        />
      </CardContent>
    </Card>
  );
};

export default RoleManagement;
