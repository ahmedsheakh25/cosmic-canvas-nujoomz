
import React from 'react';
import { motion } from 'framer-motion';
import { Send, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProjectBrief } from '@/types/projectBrief';

interface BriefActionsProps {
  status: ProjectBrief['status'];
  progress: number;
  currentLanguage: 'en' | 'ar';
  onGenerateBrief: () => void;
  onDownloadPDF?: () => void;
  pdfUrl?: string;
}

const BriefActions: React.FC<BriefActionsProps> = ({
  status,
  progress,
  currentLanguage,
  onGenerateBrief,
  onDownloadPDF,
  pdfUrl
}) => {
  const isRTL = currentLanguage === 'ar';

  return (
    <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      {status === 'collecting' && progress >= 50 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1"
        >
          <Button
            onClick={onGenerateBrief}
            disabled={false}
            className={`w-full bg-gradient-to-r from-nujmooz-primary to-nujmooz-primary/90 hover:from-nujmooz-primary/90 hover:to-nujmooz-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
              isRTL ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span className="mixed-text font-semibold">
              {currentLanguage === 'ar' ? 'إنشاء موجز المشروع' : 'Generate Project Brief'}
            </span>
          </Button>
        </motion.div>
      )}

      {status === 'generating' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1"
        >
          <Button
            disabled={true}
            className={`w-full bg-gradient-to-r from-nujmooz-primary to-nujmooz-primary/90 hover:from-nujmooz-primary/90 hover:to-nujmooz-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
              isRTL ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            <span className="mixed-text">
              {currentLanguage === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
            </span>
          </Button>
        </motion.div>
      )}

      {status === 'complete' && pdfUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1"
        >
          <Button
            onClick={onDownloadPDF}
            variant="outline"
            className={`w-full border-nujmooz-primary text-nujmooz-primary hover:bg-nujmooz-primary hover:text-white transition-all duration-300 ${
              isRTL ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span className="mixed-text font-semibold">
              {currentLanguage === 'ar' ? 'تحميل الموجز' : 'Download Brief'}
            </span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default BriefActions;
