import { LucideIcon } from 'lucide-react';

export type FileType = 'brief' | 'ideas' | 'names' | 'tone' | 'colors' | 'strategy';
export type FileAction = 'view' | 'edit' | 'export' | 'copy' | 'duplicate' | 'delete' | 'favorite';
export type SortBy = 'date' | 'name' | 'type';
export type Language = 'en' | 'ar';

export interface GeneratedFile {
  id: string;
  title: string;
  type: FileType;
  content: string;
  summary: string;
  createdAt: Date;
  isFavorite?: boolean;
}

export interface FileTypeConfig {
  icon: LucideIcon;
  label: Record<Language, string>;
  gradientColor: string;
}

export interface FilesPanelProps {
  files: GeneratedFile[];
  onFileAction: (fileId: string, action: FileAction) => void;
  selectedFileId?: string;
  currentLanguage: Language;
}

export interface FileListItemProps {
  file: GeneratedFile;
  isSelected: boolean;
  onAction: (fileId: string, action: FileAction) => void;
  currentLanguage: Language;
}

export interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: string;
  onFilterChange: (type: string) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  currentLanguage: Language;
  totalFiles: number;
  filteredCount: number;
  favoriteCount: number;
} 