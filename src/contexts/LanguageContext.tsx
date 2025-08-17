'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '@/locales/en.json';
import ruTranslations from '@/locales/ru.json';

export type Language = 'en' | 'ru';

type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = { [key: string]: TranslationValue };

const translations: Record<Language, Translations> = {
  en: enTranslations,
  ru: ruTranslations
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // Detect browser language on mount
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const detectLanguage = (): Language => {
        // Check localStorage first
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ru')) {
          return savedLanguage;
        }

        // Check browser language
        const browserLanguage = navigator.language.toLowerCase();
        if (browserLanguage.startsWith('ru')) {
          return 'ru';
        }
        
        return 'en'; // Default to English
      };

      setLanguage(detectLanguage());
    }
  }, []);

  // Save language preference
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language, mounted]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let translation: any = translations[language];
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }
    
    return typeof translation === 'string' ? translation : key;
  };

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}