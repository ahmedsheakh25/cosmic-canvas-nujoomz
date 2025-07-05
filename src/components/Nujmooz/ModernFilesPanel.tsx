import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Lightbulb, 
  Type, 
  Palette, 
  Eye, 
  Edit, 
  Download, 
  Sparkles, 
  Clock, 
  Copy, 
  Trash2, 
  MoreVertical,
  Search,
  Filter,
  Star,
  StarOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface GeneratedFile {
  id: string;
  title: string;
  type: 'brief' | 'ideas' | 'names' | 'tone' | 'colors' | 'strategy';
  content: string;
  summary: string;
  createdAt: Date;
  isFavorite?: boolean;
}

interface ModernFilesPanelProps {
  files: GeneratedFile[];
  onFileAction: (fileId: string, action: 'view' | 'edit' | 'export' | 'copy' | 'duplicate' | 'delete' | 'favorite') => void;
  selectedFileId?: string;
  currentLanguage: 'en' | 'ar';
}

const fileTypeIcons = {
  brief: FileText,
  ideas: Lightbulb,
  names: Type,
  tone: Sparkles,
  colors: Palette,
  strategy: Eye,
};

const fileTypeLabels = {
  brief: 'موجز إبداعي',
  ideas: 'أفكار',
  names: 'أسماء',
  tone: 'نبرة',
  colors: 'ألوان',
  strategy: 'استراتيجية',
};

const fileTypeColors = {
  brief: 'from-blue-500/20 to-blue-600/20',
  ideas: 'from-yellow-500/20 to-yellow-600/20',
  names: 'from-purple-500/20 to-purple-600/20',
  tone: 'from-green-500/20 to-green-600/20',
  colors: 'from-pink-500/20 to-pink-600/20',
  strategy: 'from-indigo-500/20 to-indigo-600/20',
};

const ModernFilesPanel: React.FC<ModernFilesPanelProps> = ({ 
  files, 
  onFileAction, 
  selectedFileId,
  currentLanguage 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type'>('date');

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

  const handleQuickAction = (fileId: string, action: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onFileAction(fileId, action as any);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Panel Header */}
      <div className="p-6 border-b border-[#c9c4bf]/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2a2a2a] dark:text-white">
              {currentLanguage === 'ar' ? 'الملفات المُنشأة' : 'Generated Files'}
            </h2>
            <p className="text-sm text-[#a9a39b] mt-1">
              {currentLanguage === 'ar' 
                ? `${filteredFiles.length} من ${files.length} ملف`
                : `${filteredFiles.length} of ${files.length} files`
              }
            </p>
          </div>
          <Badge variant="secondary" className="bg-[#ebb650]/10 text-[#ebb650]">
            {files.filter(f => f.isFavorite).length} {currentLanguage === 'ar' ? 'مفضل' : 'favorites'}
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a9a39b]" />
            <Input
              placeholder={currentLanguage === 'ar' ? 'البحث في الملفات...' : 'Search files...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20"
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="flex space-x-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="flex-1 bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={currentLanguage === 'ar' ? 'تصفية النوع' : 'Filter type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {currentLanguage === 'ar' ? 'جميع الأنواع' : 'All types'}
                </SelectItem>
                <SelectItem value="brief">
                  {currentLanguage === 'ar' ? 'موجز إبداعي' : 'Brief'}
                </SelectItem>
                <SelectItem value="ideas">
                  {currentLanguage === 'ar' ? 'أفكار' : 'Ideas'}
                </SelectItem>
                <SelectItem value="names">
                  {currentLanguage === 'ar' ? 'أسماء' : 'Names'}
                </SelectItem>
                <SelectItem value="tone">
                  {currentLanguage === 'ar' ? 'نبرة' : 'Tone'}
                </SelectItem>
                <SelectItem value="colors">
                  {currentLanguage === 'ar' ? 'ألوان' : 'Colors'}
                </SelectItem>
                <SelectItem value="strategy">
                  {currentLanguage === 'ar' ? 'استراتيجية' : 'Strategy'}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
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

      {/* Enhanced Files List */}
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
            filteredFiles.map((file, index) => {
              const IconComponent = fileTypeIcons[file.type];
              const isSelected = selectedFileId === file.id;
              
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isSelected 
                        ? 'bg-[#ebb650]/10 border-[#ebb650]/40 ring-2 ring-[#ebb650]/20' 
                        : 'bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20 hover:border-[#ebb650]/40'
                    }`}
                    onClick={() => onFileAction(file.id, 'view')}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 bg-gradient-to-r ${fileTypeColors[file.type]} rounded-xl flex items-center justify-center relative`}>
                            <IconComponent className="w-5 h-5 text-[#2a2a2a] dark:text-white" />
                            {file.isFavorite && (
                              <Star className="w-3 h-3 text-[#ebb650] absolute -top-1 -right-1 fill-current" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base text-[#2a2a2a] dark:text-white truncate">
                              {file.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {currentLanguage === 'ar' ? fileTypeLabels[file.type] : file.type}
                              </Badge>
                              {file.isFavorite && (
                                <Badge variant="secondary" className="text-xs bg-[#ebb650]/10 text-[#ebb650]">
                                  {currentLanguage === 'ar' ? 'مفضل' : 'Favorite'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#a9a39b] hover:text-[#ebb650] hover:bg-[#ebb650]/10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={(e) => handleQuickAction(file.id, 'view', e)}>
                              <Eye className="w-4 h-4 mr-2" />
                              {currentLanguage === 'ar' ? 'عرض' : 'View'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleQuickAction(file.id, 'edit', e)}>
                              <Edit className="w-4 h-4 mr-2" />
                              {currentLanguage === 'ar' ? 'تحرير' : 'Edit'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleQuickAction(file.id, 'copy', e)}>
                              <Copy className="w-4 h-4 mr-2" />
                              {currentLanguage === 'ar' ? 'نسخ المحتوى' : 'Copy content'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => handleQuickAction(file.id, 'favorite', e)}>
                              {file.isFavorite ? (
                                <>
                                  <StarOff className="w-4 h-4 mr-2" />
                                  {currentLanguage === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites'}
                                </>
                              ) : (
                                <>
                                  <Star className="w-4 h-4 mr-2" />
                                  {currentLanguage === 'ar' ? 'إضافة للمفضلة' : 'Add to favorites'}
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleQuickAction(file.id, 'duplicate', e)}>
                              <Copy className="w-4 h-4 mr-2" />
                              {currentLanguage === 'ar' ? 'تكرار الملف' : 'Duplicate file'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => handleQuickAction(file.id, 'export', e)}>
                              <Download className="w-4 h-4 mr-2" />
                              {currentLanguage === 'ar' ? 'تصدير' : 'Export'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => handleQuickAction(file.id, 'delete', e)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {currentLanguage === 'ar' ? 'حذف' : 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-[#a9a39b] line-clamp-2 mb-4">
                        {file.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-[#a9a39b]">
                          <Clock className="w-3 h-3" />
                          <span>
                            {file.createdAt.toLocaleDateString(currentLanguage === 'ar' ? 'ar' : 'en', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleQuickAction(file.id, 'view', e)}
                            className="h-8 w-8 p-0 text-[#a9a39b] hover:text-[#ebb650] hover:bg-[#ebb650]/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleQuickAction(file.id, 'edit', e)}
                            className="h-8 w-8 p-0 text-[#a9a39b] hover:text-[#ebb650] hover:bg-[#ebb650]/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernFilesPanel;
