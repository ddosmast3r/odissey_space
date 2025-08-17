'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import CareerTimeline from './CareerTimeline';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-2 gap-8 items-start mb-16">
        <div>
          <div className="frosted-glass p-6 rounded-lg mb-4">
            <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
            <p className="text-xl opacity-80">
              {t('about.description')}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <a 
              href="https://t.me/ddosmaster1" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-xs shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="relative z-10 hidden sm:inline">Telegram</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </a>
            
            <a 
              href="https://github.com/ddosmast3r" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-medium text-xs shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-gray-700 hover:to-gray-800 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="relative z-10 hidden sm:inline">GitHub</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/30 to-gray-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/odissey-pogosov/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-xs shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="relative z-10 hidden sm:inline">LinkedIn</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </a>
            
            <a 
              href="https://definitelydog.itch.io/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium text-xs shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-red-700 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img 
                src="https://static.itch.io/images/itchio-textless-black.svg" 
                alt="itch.io" 
                className="w-4 h-4 relative z-10 brightness-0 invert"
              />
              <span className="relative z-10 hidden sm:inline">itch.io</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </a>
          </div>
          
          {/* Career Timeline */}
          <div className="mt-8">
            <CareerTimeline />
          </div>
        </div>
        <div>
          <div className="flex justify-center mb-8">
            <div className="w-80">
              <div className="relative group mb-8">
                <img 
                  src="/images/me/0B0B74CA-AC27-43E7-B5A8-FAD343D9A46F_1_105_c.jpeg" 
                  alt="Profile photo" 
                  className="w-full rounded-lg shadow-xl border-2 border-green-500 transform transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Education Section under photo */}
              <div className="frosted-glass p-6 rounded-lg">
                <h3 className="font-semibold mb-4">{t('about.educationTitle')}</h3>
                <div className="flex items-center gap-3 text-sm opacity-80">
                  <img 
                    src="https://src.guap.ru/logos/guap/guap-sign.png" 
                    alt="GUAP Logo" 
                    className="w-8 h-8 object-contain"
                  />
                  <div>
                    <p className="font-medium">{t('about.educationUniversity')}</p>
                    <p>{t('about.educationDegree')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden text-center mb-16">
        <div className="frosted-glass p-6 rounded-lg mb-4">
          <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-xl opacity-80">
            {t('about.description')}
          </p>
        </div>
        <div className="flex justify-center mb-4">
          <div className="w-64">
            <div className="relative group mb-4">
              <img 
                src="/images/me/0B0B74CA-AC27-43E7-B5A8-FAD343D9A46F_1_105_c.jpeg" 
                alt="Profile photo" 
                className="w-full rounded-lg shadow-xl border-2 border-green-500 transform transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Education Section under photo - Mobile */}
            <div className="frosted-glass p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-sm">{t('about.educationTitle')}</h3>
              <div className="flex items-center gap-3 text-xs opacity-80">
                <img 
                  src="https://src.guap.ru/logos/guap/guap-sign.png" 
                  alt="GUAP Logo" 
                  className="w-6 h-6 object-contain"
                />
                <div>
                  <p className="font-medium">{t('about.educationUniversity')}</p>
                  <p>{t('about.educationDegree')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <a 
            href="https://t.me/ddosmaster1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-xs shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            <span className="relative z-10 hidden sm:inline">Telegram</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </a>
          
          <a 
            href="https://github.com/ddosmast3r" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-medium text-xs shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-gray-700 hover:to-gray-800 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="relative z-10 hidden sm:inline">GitHub</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600/30 to-gray-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </a>
          
          <a 
            href="https://www.linkedin.com/in/odissey-pogosov/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-xs shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="relative z-10 hidden sm:inline">LinkedIn</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </a>
          
          <a 
            href="https://definitelydog.itch.io/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium text-xs shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-red-700 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img 
              src="https://static.itch.io/images/itchio-textless-black.svg" 
              alt="itch.io" 
              className="w-4 h-4 relative z-10 brightness-0 invert"
            />
            <span className="relative z-10 hidden sm:inline">itch.io</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </a>
        </div>
        
        {/* Career Timeline - Mobile */}
        <div className="mt-8">
          <CareerTimeline />
        </div>
      </div>

      {/* Background Section - Full Width */}
      <div className="frosted-glass rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('about.background')}</h2>
        <div className="max-w-4xl mx-auto space-y-4 text-lg opacity-90">
          <p>
            {t('about.backgroundText1')}
          </p>
          <p>
            {t('about.backgroundText2')}
          </p>
        </div>
      </div>

      <div className="text-center frosted-glass rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">{t('about.workTogether')}</h2>
        <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">
          {t('about.workTogetherText')}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="mailto:contact@odissey.space" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            {t('about.getInTouch')}
          </a>
          <a href="/cv/CV_RU.pdf" download="CV_RU.pdf" className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            {t('about.downloadResume')}
          </a>
        </div>
      </div>
    </div>
  );
}