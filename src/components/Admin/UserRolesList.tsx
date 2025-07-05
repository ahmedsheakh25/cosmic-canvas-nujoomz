
import React from 'react';
import { Card } from '@/components/ui/card';
import UserRoleCard from './UserRoleCard';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
  user_email?: string;
}

interface UserRolesListProps {
  userRoles: UserRole[];
  searchTerm: string;
  onRemoveRole: (roleId: string) => void;
}

const UserRolesList: React.FC<UserRolesListProps> = ({ userRoles, searchTerm, onRemoveRole }) => {
  const filteredRoles = userRoles.filter(role =>
    role.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {filteredRoles.map((userRole) => (
        <UserRoleCard
          key={userRole.id}
          userRole={userRole}
          onRemoveRole={onRemoveRole}
        />
      ))}
      {filteredRoles.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            {searchTerm ? 'No roles found matching your search' : 'No user roles assigned yet'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default UserRolesList;
