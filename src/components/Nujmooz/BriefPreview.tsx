
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Loader2, ExternalLink } from 'lucide-react';
import { generateBriefPDF, type BriefData } from '@/utils/pdfGenerator';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BriefPreviewProps {
  briefData: BriefData;
}

const BriefPreview = ({ briefData }: BriefPreviewProps) => {
  const { language } = briefData;
  const { sessionId } = useSession();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [existingPdfUrl, setExistingPdfUrl] = useState<string | null>(null);

  // Check if PDF already exists for this session
  useEffect(() => {
    const checkExistingPDF = async () => {
      if (!sessionId) return;
      
      try {
        // Get the user first
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('session_id', sessionId)
          .single();
          
        if (user) {
          // Get the latest brief for this user that has a PDF
          const { data: brief } = await supabase
            .from('project_briefs')
            .select('pdf_url')
            .eq('user_id', user.id)
            .not('pdf_url', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (brief?.pdf_url) {
            setExistingPdfUrl(brief.pdf_url);
          }
        }
      } catch (error) {
        console.log('No existing PDF found');
      }
    };
    
    checkExistingPDF();
  }, [sessionId]);

  const handleExportPDF = async () => {
    if (!sessionId) {
      toast.error(language === 'ar' ? 'خطأ في الجلسة' : 'Session error');
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      const pdfUrl = await generateBriefPDF(briefData, sessionId);
      
      if (pdfUrl) {
        // Update the existing PDF URL state
        setExistingPdfUrl(pdfUrl);
        
        // Create a temporary link to download the PDF
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `project-brief-${sessionId}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(
          language === 'ar' 
            ? '✅ تم تصدير الملف بنجاح!' 
            : '✅ PDF exported successfully!'
        );
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(
        language === 'ar' 
          ? '❌ حدث خطأ في تصدير الملف' 
          : '❌ Error exporting PDF'
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleViewPDF = () => {
    if (existingPdfUrl) {
      window.open(existingPdfUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6 shadow-lg"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-[#7EF5A5]" />
          <h3 className="text-xl font-semibold text-white">
            {language === 'ar' ? 'موجز المشروع' : 'Project Brief'}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {existingPdfUrl && (
            <button
              onClick={handleViewPDF}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              <span>
                {language === 'ar' ? 'عرض PDF' : 'View PDF'}
              </span>
            </button>
          )}
          <button
            onClick={handleExportPDF}
            disabled={isGeneratingPDF}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>
              {isGeneratingPDF 
                ? (language === 'ar' ? 'جاري التصدير...' : 'Exporting...')
                : (language === 'ar' ? 'تصدير PDF' : 'Export PDF')
              }
            </span>
          </button>
        </div>
      </div>

      {/* Brief content display */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-[#7EF5A5] font-medium mb-2">
              {language === 'ar' ? 'نوع الخدمة' : 'Service Type'}
            </h4>
            <p className="text-white/90">{briefData.service}</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-[#7EF5A5] font-medium mb-2">
              {language === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'}
            </h4>
            <p className="text-white/90">{briefData.audience}</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-[#7EF5A5] font-medium mb-2">
              {language === 'ar' ? 'الأسلوب المفضل' : 'Preferred Style'}
            </h4>
            <p className="text-white/90">{briefData.style}</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-[#7EF5A5] font-medium mb-2">
              {language === 'ar' ? 'الميزانية' : 'Budget'}
            </h4>
            <p className="text-white/90">{briefData.budget}</p>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="text-[#7EF5A5] font-medium mb-2">
            {language === 'ar' ? 'وصف المشروع' : 'Project Description'}
          </h4>
          <p className="text-white/90 leading-relaxed">{briefData.description}</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="text-[#7EF5A5] font-medium mb-2">
            {language === 'ar' ? 'الجدول الزمني' : 'Timeline'}
          </h4>
          <p className="text-white/90">{briefData.deadline}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-white/60 text-sm text-center">
          {language === 'ar' 
            ? 'تم إنشاء هذا الموجز بواسطة نجموز 👽 - مساعدك الكوني الإبداعي'
            : 'Generated by Nujmooz 👽 - Your Cosmic Creative Assistant'
          }
        </p>
      </div>
    </motion.div>
  );
};

export default BriefPreview;
