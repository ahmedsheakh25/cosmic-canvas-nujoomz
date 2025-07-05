import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { FILE_TYPE_CONFIG } from './config';
import type { SearchFilterProps } from './types';

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  sortBy,
  onSortChange,
  currentLanguage,
  totalFiles,
  filteredCount,
  favoriteCount
}) => {
  return (
    <div className="p-6 border-b border-[#c9c4bf]/20 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2a2a2a] dark:text-white">
            {currentLanguage === 'ar' ? 'الملفات المُنشأة' : 'Generated Files'}
          </h2>
          <p className="text-sm text-[#a9a39b] mt-1">
            {currentLanguage === 'ar' 
              ? `${filteredCount} من ${totalFiles} ملف`
              : `${filteredCount} of ${totalFiles} files`
            }
          </p>
        </div>
        <Badge variant="secondary" className="bg-[#ebb650]/10 text-[#ebb650]">
          {favoriteCount} {currentLanguage === 'ar' ? 'مفضل' : 'favorites'}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a9a39b]" />
          <Input
            placeholder={currentLanguage === 'ar' ? 'البحث في الملفات...' : 'Search files...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20"
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="flex space-x-2">
          <Select value={filterType} onValueChange={onFilterChange}>
            <SelectTrigger className="flex-1 bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={currentLanguage === 'ar' ? 'تصفية النوع' : 'Filter type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {currentLanguage === 'ar' ? 'جميع الأنواع' : 'All types'}
              </SelectItem>
              {Object.entries(FILE_TYPE_CONFIG).map(([type, config]) => (
                <SelectItem key={type} value={type}>
                  {config.label[currentLanguage]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="flex-1 bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">
                {currentLanguage === 'ar' ? 'التاريخ' : 'Date'}
              </SelectItem>
              <SelectItem value="name">
                {currentLanguage === 'ar' ? 'الاسم' : 'Name'}
              </SelectItem>
              <SelectItem value="type">
                {currentLanguage === 'ar' ? 'النوع' : 'Type'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}; 