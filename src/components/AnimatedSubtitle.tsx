'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AnimatedSubtitle() {
  const { language } = useLanguage();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const words = {
    en: ['Level', 'Game', 'Technical'],
    ru: ['Level', 'Game', 'Technical'] // Оставляем на английском как технические термины
  };

  const currentWords = words[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % currentWords.length);
        setIsAnimating(false);
      }, 300); // Время для анимации исчезновения
      
    }, 3000); // Меняем каждые 3 секунды

    return () => clearInterval(interval);
  }, [currentWords.length]);

  return (
    <p className="text-lg md:text-xl opacity-80 mb-6 md:mb-8 font-poppins">
      <span 
        className={`inline-block transition-opacity duration-500 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {currentWords[currentWordIndex]}
      </span>
      <span> Design Portfolio</span>
    </p>
  );
}