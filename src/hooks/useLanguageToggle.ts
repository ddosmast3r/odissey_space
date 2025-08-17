import { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Кастомный хук для переключения языка
 * Устраняет дублирование логики переключения языка в компонентах
 */
export function useLanguageToggle() {
  const { language, setLanguage } = useLanguage();
  
  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  }, [language, setLanguage]);
  
  return toggleLanguage;
}