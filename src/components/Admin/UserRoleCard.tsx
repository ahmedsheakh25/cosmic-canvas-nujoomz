
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
  user_email?: string;
}

interface UserRoleCardProps {
  userRole: UserRole;
  onRemoveRole: (roleId: string) => void;
}

const UserRoleCard: React.FC<UserRoleCardProps> = ({ userRole, onRemoveRole }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">{userRole.user_email}</div>
            <div className="text-sm text-gray-500">
              Assigned: {new Date(userRole.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getRoleColor(userRole.role)}>
            {userRole.role.charAt(0).toUpperCase() + userRole.role.slice(1)}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveRole(userRole.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserRoleCard;
