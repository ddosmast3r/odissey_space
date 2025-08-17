'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-2 gap-8 items-start mb-16">
        <div>
          <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-xl opacity-80 mb-8">
            {t('about.description')}
          </p>
          <div className="space-y-4">
            <a 
              href="https://t.me/ddosmaster1" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 relative overflow-hidden w-64"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Telegram</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </a>
            
            <a 
              href="#" 
              className="group flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-semibold text-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-900 relative overflow-hidden w-64"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">LinkedIn</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative group">
            <img 
              src="/images/me/0B0B74CA-AC27-43E7-B5A8-FAD343D9A46F_1_105_c.jpeg" 
              alt="Profile photo" 
              className="w-80 rounded-lg shadow-xl border-4 border-white dark:border-gray-800 transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <img 
              src="/images/me/0B0B74CA-AC27-43E7-B5A8-FAD343D9A46F_1_105_c.jpeg" 
              alt="Profile photo" 
              className="w-64 rounded-lg shadow-xl border-4 border-white dark:border-gray-800 transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        <p className="text-xl opacity-80 mb-8 max-w-lg mx-auto">
          {t('about.description')}
        </p>
        <div className="space-y-4 flex flex-col items-center">
          <a 
            href="https://t.me/ddosmaster1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 relative overflow-hidden w-64"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Telegram</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </a>
          
          <a 
            href="#" 
            className="group flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-semibold text-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-900 relative overflow-hidden w-64"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">LinkedIn</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-6">{t('about.background')}</h2>
          <div className="space-y-4 text-lg opacity-90">
            <p>
              {t('about.backgroundText1')}
            </p>
            <p>
              {t('about.backgroundText2')}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">{t('about.skillsTitle')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">{t('about.gameDevTitle')}</h3>
              <ul className="text-sm space-y-1 opacity-80">
                <li>• Level Design</li>
                <li>• Game Mechanics</li>
                <li>• Player Experience</li>
                <li>• Prototyping</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-green-600">{t('about.technicalTitle')}</h3>
              <ul className="text-sm space-y-1 opacity-80">
                <li>• Unity/Unreal</li>
                <li>• C# Programming</li>
                <li>• 3D Modeling</li>
                <li>• Version Control</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">{t('about.workTogether')}</h2>
        <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">
          {t('about.workTogetherText')}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="mailto:contact@odissey.space" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {t('about.getInTouch')}
          </a>
          <a href="/cv/CV_RU.pdf" download="CV_RU.pdf" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            {t('about.downloadResume')}
          </a>
        </div>
      </div>
    </div>
  );
}