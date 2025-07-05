
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type { BriefData } from '@/types/projectBrief';

export const useEnhancedBriefGeneration = (sessionId: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBriefId, setGeneratedBriefId] = useState<string | null>(null);

  const generateBrief = useCallback(async (briefData: BriefData) => {
    if (!briefData || isGenerating) return null;

    setIsGenerating(true);
    
    try {
      // تحويل البيانات إلى تنسيق JSON متوافق مع Supabase
      const briefDataForDb: Json = {
        service: briefData.service,
        answers: briefData.answers,
        clientInfo: briefData.clientInfo,
        language: briefData.language,
        sessionId: briefData.sessionId || sessionId
      };

      // حفظ البيانات في قاعدة البيانات
      const { data: briefRecord, error: briefError } = await supabase
        .from('project_briefs')
        .insert({
          brief_data: briefDataForDb,
          user_id: sessionId,
          status: 'New'
        })
        .select()
        .single();

      if (briefError) throw briefError;

      // إنشاء ملف PDF
      const { data: pdfData, error: pdfError } = await supabase.functions.invoke('generate-brief-pdf', {
        body: { 
          briefId: briefRecord.id, 
          briefData: briefDataForDb
        }
      });

      if (pdfError) {
        console.error('خطأ في إنشاء PDF:', pdfError);
      } else if (pdfData?.pdfUrl) {
        // تحديث السجل برابط PDF
        await supabase
          .from('project_briefs')
          .update({ pdf_url: pdfData.pdfUrl })
          .eq('id', briefRecord.id);
      }

      setGeneratedBriefId(briefRecord.id);
      return briefRecord;

    } catch (error) {
      console.error('خطأ في إنشاء الموجز:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [sessionId, isGenerating]);

  const saveBriefNote = useCallback(async (briefId: string, note: string) => {
    try {
      await supabase.from('brief_notes').insert({
        project_brief_id: briefId,
        note,
        created_by: 'نجموز'
      });
    } catch (error) {
      console.error('خطأ في حفظ الملاحظة:', error);
    }
  }, []);

  return {
    isGenerating,
    generatedBriefId,
    generateBrief,
    saveBriefNote
  };
};
