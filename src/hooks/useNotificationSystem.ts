
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export const useNotificationSystem = (currentLanguage: 'en' | 'ar') => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Show toast notification
    const toastContent = {
      title: notification.title,
      description: notification.message,
      duration: notification.duration || 5000,
    };

    switch (notification.type) {
      case 'success':
        toast.success(toastContent.title, { description: toastContent.description });
        break;
      case 'error':
        toast.error(toastContent.title, { description: toastContent.description });
        break;
      case 'warning':
        toast.warning(toastContent.title, { description: toastContent.description });
        break;
      default:
        toast.info(toastContent.title, { description: toastContent.description });
    }

    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 5000);

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    showNotification({ type: 'success', title, message });
  }, [showNotification]);

  const showError = useCallback((title: string, message?: string) => {
    showNotification({ type: 'error', title, message });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message?: string) => {
    showNotification({ type: 'warning', title, message });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message?: string) => {
    showNotification({ type: 'info', title, message });
  }, [showNotification]);

  // Helper functions with Arabic/English messages
  const notifyConversationSaved = useCallback(() => {
    const title = currentLanguage === 'ar' ? 'تم حفظ المحادثة' : 'Conversation Saved';
    const message = currentLanguage === 'ar' ? 'تم حفظ المحادثة بنجاح' : 'Your conversation has been saved successfully';
    showSuccess(title, message);
  }, [currentLanguage, showSuccess]);

  const notifyConversationLoaded = useCallback(() => {
    const title = currentLanguage === 'ar' ? 'تم تحميل المحادثة' : 'Conversation Loaded';
    const message = currentLanguage === 'ar' ? 'تم استعادة المحادثة السابقة' : 'Previous conversation has been restored';
    showInfo(title, message);
  }, [currentLanguage, showInfo]);

  const notifyVoiceRecognitionStarted = useCallback(() => {
    const title = currentLanguage === 'ar' ? 'بدء تسجيل الصوت' : 'Voice Recording Started';
    showInfo(title);
  }, [currentLanguage, showInfo]);

  const notifyImageUploaded = useCallback(() => {
    const title = currentLanguage === 'ar' ? 'تم رفع الصورة' : 'Image Uploaded';
    const message = currentLanguage === 'ar' ? 'تم رفع الصورة بنجاح للمعالجة' : 'Image uploaded successfully for processing';
    showSuccess(title, message);
  }, [currentLanguage, showSuccess]);

  const notifyError = useCallback((error: string) => {
    const title = currentLanguage === 'ar' ? 'حدث خطأ' : 'Error Occurred';
    showError(title, error);
  }, [currentLanguage, showError]);

  return {
    notifications,
    showNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    // Helper notifications
    notifyConversationSaved,
    notifyConversationLoaded,
    notifyVoiceRecognitionStarted,
    notifyImageUploaded,
    notifyError
  };
};
