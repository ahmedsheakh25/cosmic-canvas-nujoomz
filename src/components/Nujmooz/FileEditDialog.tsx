
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface GeneratedFile {
  id: string;
  title: string;
  type: 'brief' | 'ideas' | 'names' | 'tone' | 'colors' | 'strategy';
  content: string;
  summary: string;
  createdAt: Date;
  lastModified?: Date;
  isFavorite?: boolean;
}

interface FileEditDialogProps {
  file: GeneratedFile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (fileId: string, updates: Partial<GeneratedFile>) => void;
}

const FileEditDialog: React.FC<FileEditDialogProps> = ({
  file,
  isOpen,
  onClose,
  onSave
}) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (file) {
      setEditedTitle(file.title);
      setEditedContent(file.content);
      setEditedSummary(file.summary);
      setHasChanges(false);
      setIsPreviewMode(false);
    }
  }, [file]);

  useEffect(() => {
    if (file) {
      const hasContentChanges = 
        editedTitle !== file.title ||
        editedContent !== file.content ||
        editedSummary !== file.summary;
      setHasChanges(hasContentChanges);
    }
  }, [editedTitle, editedContent, editedSummary, file]);

  const handleSave = () => {
    if (!file) return;

    onSave(file.id, {
      title: editedTitle,
      content: editedContent,
      summary: editedSummary,
      lastModified: new Date()
    });

    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ التغييرات على الملف",
    });

    onClose();
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('هل أنت متأكد من إلغاء التغييرات؟')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleReset = () => {
    if (file && window.confirm('هل تريد إعادة تعيين جميع التغييرات؟')) {
      setEditedTitle(file.title);
      setEditedContent(file.content);
      setEditedSummary(file.summary);
    }
  };

  if (!file) return null;

  const wordCount = editedContent.split(/\s+/).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white/95 dark:bg-black/95 backdrop-blur-xl border-[#c9c4bf]/20">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl text-[#2a2a2a] dark:text-white">
                تحرير الملف
              </DialogTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {file.type}
                </Badge>
                {hasChanges && (
                  <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-600">
                    تغييرات غير محفوظة
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="bg-white/40 dark:bg-black/20 border-[#c9c4bf]/20"
              >
                {isPreviewMode ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    تحرير
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    معاينة
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={!hasChanges}
                className="bg-white/40 dark:bg-black/20 border-[#c9c4bf]/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                إعادة تعيين
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isPreviewMode ? (
            <div className="h-full overflow-y-auto space-y-4">
              <Card className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border-[#c9c4bf]/20">
                <CardHeader>
                  <CardTitle className="text-lg text-[#2a2a2a] dark:text-white">
                    {editedTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#a9a39b] mb-4" dir="rtl">
                    {editedSummary}
                  </p>
                  <div className="bg-white/40 dark:bg-black/20 p-4 rounded-xl border border-[#c9c4bf]/10">
                    <p className="whitespace-pre-wrap text-sm text-[#2a2a2a] dark:text-white leading-relaxed" dir="rtl">
                      {editedContent}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full overflow-y-auto space-y-4">
              <div>
                <label className="text-sm font-medium text-[#2a2a2a] dark:text-white block mb-2">
                  عنوان الملف
                </label>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20"
                  dir="rtl"
                  placeholder="أدخل عنوان الملف..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#2a2a2a] dark:text-white block mb-2">
                  ملخص الملف
                </label>
                <Textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20 min-h-[100px]"
                  dir="rtl"
                  placeholder="أدخل ملخص مختصر للملف..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#2a2a2a] dark:text-white block mb-2">
                  محتوى الملف
                </label>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="bg-white/60 dark:bg-black/20 border-[#c9c4bf]/20 min-h-[300px] resize-none"
                  dir="rtl"
                  placeholder="أدخل محتوى الملف..."
                />
                <div className="flex justify-between items-center mt-2 text-xs text-[#a9a39b]">
                  <span>{wordCount} كلمة</span>
                  <span>Ctrl + Enter للحفظ السريع</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#c9c4bf]/20">
          <div className="text-xs text-[#a9a39b]">
            آخر تعديل: {file.createdAt.toLocaleDateString('ar')}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-white/40 dark:bg-black/20 border-[#c9c4bf]/20"
            >
              إلغاء
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-[#ebb650] hover:bg-[#d4a574] text-white disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileEditDialog;
