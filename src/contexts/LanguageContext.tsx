import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface Translations {
  [language: string]: {
    [namespace: string]: {
      [key: string]: any;
    };
  };
}

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  t: (namespace: string, key: string) => string;
  translations: Translations;
  setTranslations: (translations: Translations) => void;
}

const translations = {
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التتحكم',
    'nav.projects': 'المشاريع',
    'nav.analytics': 'التحليلات',
    'nav.team': 'الفريق',
    'nav.users': 'المستخدمون',
    'nav.settings': 'الإعدادات',
    'nav.reports': 'التقارير',
    'nav.audit': 'سجل المراجعة',
    
    // Dashboard
    'dashboard.title': 'لوحة تحكم الإدارة',
    'dashboard.subtitle': 'إدارة شاملة لمنصة OfSpace Studio',
    'dashboard.welcome': 'مرحباً بك',
    'dashboard.overview': 'نظرة عامة',
    
    // Metrics
    'metrics.totalProjects': 'إجمالي المشاريع',
    'metrics.activeProjects': 'المشاريع النشطة',
    'metrics.completedProjects': 'المشاريع المكتملة',
    'metrics.pendingReview': 'في انتظار المراجعة',
    'metrics.totalUsers': 'إجمالي المستخدمين',
    'metrics.activeUsers': 'المستخدمون النشطون',
    'metrics.newUsers': 'مستخدمون جدد',
    'metrics.systemHealth': 'صحة النظام',
    
    // Actions
    'actions.add': 'إضافة',
    'actions.edit': 'تعديل',
    'actions.delete': 'حذف',
    'actions.save': 'حفظ',
    'actions.cancel': 'إلغاء',
    'actions.search': 'بحث',
    'actions.filter': 'فلترة',
    'actions.export': 'تصدير',
    'actions.import': 'استيراد',
    'actions.refresh': 'تحديث',
    
    // Status
    'status.active': 'نشط',
    'status.inactive': 'غير نشط',
    'status.pending': 'في الانتظار',
    'status.completed': 'مكتمل',
    'status.inProgress': 'قيد التنفيذ',
    'status.cancelled': 'ملغي',
    
    // Time
    'time.today': 'اليوم',
    'time.yesterday': 'أمس',
    'time.thisWeek': 'هذا الأسبوع',
    'time.thisMonth': 'هذا الشهر',
    'time.lastMonth': 'الشهر الماضي',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projects',
    'nav.analytics': 'Analytics',
    'nav.team': 'Team',
    'nav.users': 'Users',
    'nav.settings': 'Settings',
    'nav.reports': 'Reports',
    'nav.audit': 'Audit Log',
    
    // Dashboard
    'dashboard.title': 'Admin Dashboard',
    'dashboard.subtitle': 'Comprehensive OfSpace Studio Platform Management',
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    
    // Metrics
    'metrics.totalProjects': 'Total Projects',
    'metrics.activeProjects': 'Active Projects',
    'metrics.completedProjects': 'Completed Projects',
    'metrics.pendingReview': 'Pending Review',
    'metrics.totalUsers': 'Total Users',
    'metrics.activeUsers': 'Active Users',
    'metrics.newUsers': 'New Users',
    'metrics.systemHealth': 'System Health',
    
    // Actions
    'actions.add': 'Add',
    'actions.edit': 'Edit',
    'actions.delete': 'Delete',
    'actions.save': 'Save',
    'actions.cancel': 'Cancel',
    'actions.search': 'Search',
    'actions.filter': 'Filter',
    'actions.export': 'Export',
    'actions.import': 'Import',
    'actions.refresh': 'Refresh',
    
    // Status
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    'status.inProgress': 'In Progress',
    'status.cancelled': 'Cancelled',
    
    // Time
    'time.today': 'Today',
    'time.yesterday': 'Yesterday',
    'time.thisWeek': 'This Week',
    'time.thisMonth': 'This Month',
    'time.lastMonth': 'Last Month',
  }
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  direction: 'ltr',
  toggleLanguage: () => {},
  t: (namespace: string, key: string) => key,
  translations: {},
  setTranslations: () => {},
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>({});

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
  };

  const t = (namespace: string, key: string): string => {
    const keys = key.split('.');
    let value = translations[language]?.[namespace];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${namespace}.${key}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
  }, [language, direction]);

  useEffect(() => {
    // Load translations
    const loadTranslations = async () => {
      try {
        const [enAdmin, arAdmin] = await Promise.all([
          fetch('/locales/en/admin.json').then(res => res.json()),
          fetch('/locales/ar/admin.json').then(res => res.json()),
        ]);

        setTranslations({
          en: {
            admin: enAdmin,
          },
          ar: {
            admin: arAdmin,
          },
        });
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();
  }, []);

  const value: LanguageContextType = {
    language,
    direction,
    toggleLanguage,
    t,
    translations,
    setTranslations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
