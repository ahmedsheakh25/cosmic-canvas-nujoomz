
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface RoleAssignmentFormProps {
  onRoleAssigned: () => void;
}

const RoleAssignmentForm: React.FC<RoleAssignmentFormProps> = ({ onRoleAssigned }) => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'moderator' | 'user'>('user');

  const assignRole = async () => {
    if (!newUserEmail.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      // Try to find the user by email using admin API
      const { data: usersResponse, error: findError } = await supabase.auth.admin.listUsers();
      
      if (findError) {
        console.error('Error finding user:', findError);
        toast.error('Unable to verify user. Please check admin permissions.');
        return;
      }

      const users: User[] = usersResponse?.users || [];
      const user = users.find(u => u.email === newUserEmail);
      
      if (!user) {
        toast.error('User not found. Please ensure the user has an account.');
        return;
      }

      // Insert the role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: newUserRole,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('User already has this role assigned');
        } else {
          throw error;
        }
        return;
      }

      toast.success(`${newUserRole} role assigned successfully`);
      setNewUserEmail('');
      setNewUserRole('user');
      onRoleAssigned();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    }
  };

  return (
    <Card className="p-4 bg-gray-50">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <UserPlus className="w-4 h-4" />
        Assign Role to User
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="userEmail">User Email</Label>
          <Input
            id="userEmail"
            type="email"
            placeholder="user@example.com"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="userRole">Role</Label>
          <Select value={newUserRole} onValueChange={(value: 'admin' | 'moderator' | 'user') => setNewUserRole(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={assignRole} className="w-full">
            Assign Role
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RoleAssignmentForm;
