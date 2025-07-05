
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Edit, 
  Copy, 
  Share, 
  FileText, 
  Save, 
  RefreshCw,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Star,
  StarOff,
  Clock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface GeneratedFile {
  id: string;
  title: string;
  type: 'brief' | 'ideas' | 'names' | 'tone' | 'colors' | 'strategy';
  content: string;
  summary: string;
  createdAt: Date;
  isFavorite?: boolean;
  lastModified?: Date;
  wordCount?: number;
}

interface ModernRightPanelProps {
  selectedFile?: GeneratedFile;
  onClose: () => void;
  onSave?: (fileId: string, updates: Partial<GeneratedFile>) => void;
  onExport?: (fileId: string, format: 'pdf' | 'txt' | 'json') => void;
  onCopy?: (content: string) => void;
  onToggleFavorite?: (fileId: string) => void;
}

const ModernRightPanel: React.FC<ModernRightPanelProps> = ({ 
  selectedFile, 
  onClose, 
  onSave,
  onExport,
  onCopy,
  onToggleFavorite
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const { toast } = useToast();

  React.useEffect(() => {
    if (selectedFile) {
      setEditedTitle(selectedFile.title);
      setEditedContent(selectedFile.content);
      setEditedSummary(selectedFile.summary);
      setIsEditing(false);
      setActiveTab('preview');
    }
  }, [selectedFile]);

  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#ebb650]/20 to-[#d4a574]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#ebb650]" />
          </div>
          <h3 className="text-lg font-medium text-[#2a2a2a] dark:text-white mb-2">
            حدد ملفاً لعرضه
          </h3>
          <p className="text-sm text-[#a9a39b]">
            اختر ملفاً من القائمة الجانبية لعرض تفاصيله وتحريره
          </p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (onSave) {
      onSave(selectedFile.id, {
        title: editedTitle,
        content: editedContent,
        summary: editedSummary,
        lastModified: new Date(),
        wordCount: editedContent.split(/\s+/).length
      });
    }
    setIsEditing(false);
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ التغييرات على الملف",
    });
  };

  const handleCancel = () => {
    if (selectedFile) {
      setEditedTitle(selectedFile.title);
      setEditedContent(selectedFile.content);
      setEditedSummary(selectedFile.summary);
    }
    setIsEditing(false);
  };

  const handleCopy = async () => {
    if (onCopy) {
      onCopy(selectedFile.content);
    } else {
      try {
        await navigator.clipboard.writeText(selectedFile.content);
        toast({
          title: "تم النسخ",
          description: "تم نسخ محتوى الملف إلى الحافظة",
        });
      } catch (error) {
        toast({
          title: "خطأ في النسخ",
          description: "لم يتم نسخ المحتوى. حاول مرة أخرى.",
          variant: "destructive",
        });
      }
    }
  };

  const handleExport = (format: 'pdf' | 'txt' | 'json') => {
    if (onExport) {
      onExport(selectedFile.id, format);
    }
    toast({
      title: "جارِ التصدير",
      description: `جارِ تصدير الملف بصيغة ${format.toUpperCase()}`,
    });
  };

  const wordCount = selectedFile.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <motion.div
      className={`h-full flex flex-col transition-all duration-300 ${
        isExpanded ? 'fixed inset-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl' : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced Panel Header */}
      <div className="p-6 border-b border-[#c9c4bf]/20 bg-white/60 dark:bg-black/20 backdrop-blur-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-xl font-bold bg-transparent border-0 p-0 focus:ring-0"
                dir="rtl"
              />
            ) : (
              <h2 className="text-xl font-bold text-[#2a2a2a] dark:text-white truncate">
                {selectedFile.title}
              </h2>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {selectedFile.type}
              </Badge>
              {selectedFile.isFavorite && (
                <Badge variant="secondary" className="text-xs bg-[#ebb650]/10 text-[#ebb650]">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  مفضل
                </Badge>
              )}
              <span className="text-xs text-[#a9a39b]">
                {wordCount} كلمة • {readingTime} دقيقة قراءة
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#a9a39b] hover:text-[#ebb650] hover:bg-[#ebb650]/10"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            
            {!isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-[#a9a39b] hover:text-[#ebb650] hover:bg-[#ebb650]/10"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-[#ebb650] hover:bg-[#d4a574] text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                حفظ
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
              >
                إلغاء
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="bg-white/40 dark:bg-black/20 border-[#c9c4bf]/20 hover:bg-[#ebb650]/10 hover:border-[#ebb650]/40"
              >
                <Edit className="w-4 h-4 mr-2" />
                تحرير
              </Button>
              
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="bg-white/40 dark:bg-black/20 border-[#c9c4bf]/20 hover:bg-[#ebb650]/10 hover:border-[#ebb650]/40"
              >
                <Copy className="w-4 h-4 mr-2" />
                نسخ
              </Button>

              {onToggleFavorite && (
                <Button
                  onClick={() => onToggleFavorite(selectedFile.id)}
                  variant="outline"
                  size="sm"
                  className="bg-white/40 dark:bg-black/20 border-[#c9c4bf]/20 hover:bg-[#ebb650]/10 hover:border-[#ebb650]/40"
                >
                  {selectedFile.isFavorite ? (
                    <StarOff className="w-4 h-4 mr-2" />
                  ) : (
                    <Star className="w-4 h-4 mr-2" />
                  )}
                  {selectedFile.isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Enhanced Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-6 mt-4">
            <TabsTrigger value="preview" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>معاينة</span>
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>تحرير</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>تفاصيل</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden px-6 pb-6">
            <TabsContent value="preview" className="h-full mt-4">
              <ScrollArea className="h-full">
                <Card className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border-[#c9c4bf]/20">
                  <CardHeader>
                    <CardTitle className="text-base text-[#2a2a2a] dark:text-white">
                      الملخص
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#a9a39b] mb-4" dir="rtl">
                      {selectedFile.summary}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border-[#c9c4bf]/20 mt-4">
                  <CardHeader>
                    <CardTitle className="text-base text-[#2a2a2a] dark:text-white">
                      المحتوى
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="bg-white/40 dark:bg-black/20 p-4 rounded-xl border border-[#c9c4bf]/10">
                        <p className="whitespace-pre-wrap text-sm text-[#2a2a2a] dark:text-white leading-relaxed" dir="rtl">
                          {selectedFile.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="edit" className="h-full mt-4 space-y-4">
              <Card className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border-[#c9c4bf]/20">
                <CardHeader>
                  <CardTitle className="text-base text-[#2a2a2a] dark:text-white">
                    تحرير الملف
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#2a2a2a] dark:text-white block mb-2">
                      العنوان
                    </label>
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#2a2a2a] dark:text-white block mb-2">
                      الملخص
                    </label>
                    <Textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      className="bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20 min-h-[100px]"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#2a2a2a] dark:text-white block mb-2">
                      المحتوى
                    </label>
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20 min-h-[300px]"
                      dir="rtl"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="text-xs text-[#a9a39b]">
                      {editedContent.split(/\s+/).length} كلمة
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        size="sm"
                        className="bg-[#ebb650] hover:bg-[#d4a574] text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        حفظ التغييرات
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info" className="h-full mt-4">
              <ScrollArea className="h-full">
                <Card className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border-[#c9c4bf]/20">
                  <CardHeader>
                    <CardTitle className="text-base text-[#2a2a2a] dark:text-white">
                      معلومات الملف
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#a9a39b]">النوع:</span>
                        <p className="text-[#2a2a2a] dark:text-white font-medium">
                          {selectedFile.type}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#a9a39b]">عدد الكلمات:</span>
                        <p className="text-[#2a2a2a] dark:text-white font-medium">
                          {wordCount}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#a9a39b]">وقت القراءة:</span>
                        <p className="text-[#2a2a2a] dark:text-white font-medium">
                          {readingTime} دقيقة
                        </p>
                      </div>
                      <div>
                        <span className="text-[#a9a39b]">تاريخ الإنشاء:</span>
                        <p className="text-[#2a2a2a] dark:text-white font-medium">
                          {selectedFile.createdAt.toLocaleDateString('ar')}
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="bg-[#c9c4bf]/20" />
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-[#2a2a2a] dark:text-white">
                        إجراءات التصدير
                      </h4>
                      <div className="grid gap-2">
                        <Button
                          onClick={() => handleExport('txt')}
                          variant="outline"
                          size="sm"
                          className="justify-start bg-white/40 dark:bg-black/20 border-[#c9c4bf]/20 hover:bg-[#ebb650]/10 hover:border-[#ebb650]/40"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          تصدير كملف نصي
                        </Button>
                        
                        <Button
                          onClick={() => handleExport('json')}
                          variant="outline"
                          size="sm"
                          className="justify-start bg-white/40 dark:bg-black/20 border-[#c9c4bf]/20 hover:bg-[#ebb650]/10 hover:border-[#ebb650]/40"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          تصدير كـ JSON
                        </Button>
                        
                        <Button
                          onClick={() => handleExport('pdf')}
                          variant="outline"
                          size="sm"
                          className="justify-start bg-white/40 dark:bg-black/20 border-[#c9c4bf]/20 hover:bg-[#ebb650]/10 hover:border-[#ebb650]/40"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          تصدير PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default ModernRightPanel;
