
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface RoleSearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const RoleSearchFilter: React.FC<RoleSearchFilterProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Search users or roles..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default RoleSearchFilter;
