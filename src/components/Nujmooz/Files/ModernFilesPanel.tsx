import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import type { FilesPanelProps, GeneratedFile, SortBy } from './types';
import { SearchFilter } from './SearchFilter';
import { FileListItem } from './FileListItem';

export const ModernFilesPanel: React.FC<FilesPanelProps> = ({
  files,
  onFileAction,
  selectedFileId,
  currentLanguage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  // Filter and sort files
  const filteredFiles = files
    .filter(file => {
      const matchesSearch = file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          file.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || file.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  return (
    <div className="h-full flex flex-col">
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterChange={setFilterType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        currentLanguage={currentLanguage}
        totalFiles={files.length}
        filteredCount={filteredFiles.length}
        favoriteCount={files.filter(f => f.isFavorite).length}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {filteredFiles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#ebb650]/20 to-[#d4a574]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {searchQuery || filterType !== 'all' ? (
                  <Search className="w-8 h-8 text-[#ebb650]" />
                ) : (
                  <Sparkles className="w-8 h-8 text-[#ebb650]" />
                )}
              </div>
              <h3 className="text-lg font-medium text-[#2a2a2a] dark:text-white mb-2">
                {currentLanguage === 'ar' 
                  ? (searchQuery || filterType !== 'all' ? 'لا توجد نتائج' : 'لا توجد ملفات بعد')
                  : (searchQuery || filterType !== 'all' ? 'No results found' : 'No files yet')
                }
              </h3>
              <p className="text-sm text-[#a9a39b]">
                {currentLanguage === 'ar' 
                  ? (searchQuery || filterType !== 'all' 
                      ? 'جرب تغيير معايير البحث أو الفلترة'
                      : 'ابدأ محادثة مع نجموز لإنشاء ملفات إبداعية'
                    )
                  : (searchQuery || filterType !== 'all' 
                      ? 'Try changing your search or filter criteria'
                      : 'Start a conversation with Nujmooz to create files'
                    )
                }
              </p>
            </motion.div>
          ) : (
            filteredFiles.map((file) => (
              <FileListItem
                key={file.id}
                file={file}
                isSelected={selectedFileId === file.id}
                onAction={onFileAction}
                currentLanguage={currentLanguage}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 