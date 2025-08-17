'use client';

import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useLanguageToggle } from '@/hooks/useLanguageToggle';

export default function LanguageSwitcher() {
  const { language, t } = useLanguage();
  const toggleLanguage = useLanguageToggle();

  return (
    <button
      onClick={toggleLanguage}
      className="relative inline-flex items-center w-16 h-8 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-all duration-300 text-xs font-medium"
      title={t('common.language')}
    >
      {/* Sliding background */}
      <div 
        className={`absolute top-0.5 w-7 h-7 bg-white dark:bg-gray-900 rounded-full shadow-md transition-transform duration-300 ease-in-out ${
          language === 'en' ? 'translate-x-0.5' : 'translate-x-8'
        }`}
      />
      
      {/* Language labels */}
      <div className="relative flex items-center justify-between w-full px-1 z-10">
        <span className={`transition-colors duration-300 ${
          language === 'en' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
        }`}>
          EN
        </span>
        <span className={`transition-colors duration-300 ${
          language === 'ru' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'
        }`}>
          RU
        </span>
      </div>
    </button>
  );
}