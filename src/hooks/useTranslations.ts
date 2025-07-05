import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

export function useTranslations(namespace: string) {
  const { language, t } = useContext(LanguageContext);

  return {
    t: (key: string) => t(namespace, key),
    language,
  };
} 