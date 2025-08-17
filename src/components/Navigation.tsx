'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRef, useEffect, useState } from 'react';

export default function Navigation() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [mobileIndicatorStyle, setMobileIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: '/', label: t('nav.home'), shortLabel: t('nav.home') },
    { href: '/projects/professional', label: t('projectsPage.professional'), shortLabel: t('projectsPage.workShort') },
    { href: '/projects/personal', label: t('projectsPage.personal'), shortLabel: t('projectsPage.personalShort') },
    { href: '/about', label: t('nav.about'), shortLabel: t('nav.about') }
  ];

  const isActive = (path: string) => {
    // Точное совпадение для главной
    if (path === '/' && pathname === '/') return true;
    // Точное совпадение для остальных страниц
    if (path !== '/' && pathname === path) return true;
    return false;
  };

  const updateIndicator = () => {
    if (!navRef.current) return;
    
    const activeIndex = navItems.findIndex(item => isActive(item.href));
    
    if (activeIndex === -1) {
      setIndicatorStyle({ left: 0, width: 0, opacity: 0 });
      return;
    }

    const links = navRef.current.querySelectorAll('a');
    const activeLink = links[activeIndex] as HTMLElement;
    
    if (activeLink) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        opacity: 1
      });
    }
  };

  const updateMobileIndicator = () => {
    if (!mobileNavRef.current) return;
    
    const activeIndex = navItems.findIndex(item => isActive(item.href));
    
    if (activeIndex === -1) {
      setMobileIndicatorStyle({ left: 0, width: 0, opacity: 0 });
      return;
    }

    const containers = mobileNavRef.current.querySelectorAll('div.relative');
    const activeContainer = containers[activeIndex] as HTMLElement;
    
    if (activeContainer) {
      const navRect = mobileNavRef.current.getBoundingClientRect();
      const containerRect = activeContainer.getBoundingClientRect();
      
      setMobileIndicatorStyle({
        left: containerRect.left - navRect.left,
        width: containerRect.width,
        opacity: 1
      });
    }
  };

  useEffect(() => {
    updateIndicator();
    updateMobileIndicator();
    // Небольшая задержка для корректного расчета после рендера
    const timer = setTimeout(() => {
      updateIndicator();
      updateMobileIndicator();
    }, 100);
    
    // Обработчик изменения размеров окна
    const handleResize = () => {
      updateIndicator();
      updateMobileIndicator();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname, t]);

  const NavLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link 
      href={href} 
      className={`relative text-gray-300 hover:text-white transition-colors duration-200 ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        ref={navRef}
        className="hidden md:flex gap-6 lg:gap-8 text-lg lg:text-xl font-medium font-poppins relative"
        suppressHydrationWarning
      >
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href}>
            {item.label}
          </NavLink>
        ))}
        
        {/* Animated indicator */}
        <div 
          className="absolute -bottom-1 h-0.5 bg-gradient-to-r from-green-400 to-green-300 matrix-glow transition-all duration-300 ease-out"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity
          }}
        />
      </nav>
      
      {/* Mobile Navigation */}
      <nav 
        ref={mobileNavRef}
        className="md:hidden flex gap-2 sm:gap-3 text-base sm:text-lg font-medium font-inter relative"
        suppressHydrationWarning
      >
        {navItems.map((item, index) => (
          <div key={item.href} className="relative flex-1">
            <NavLink href={item.href} className="text-base sm:text-lg block text-center px-2 pt-3 pb-1">
              {item.shortLabel}
            </NavLink>
          </div>
        ))}
        
        {/* Animated mobile indicator */}
        <div 
          className="absolute -bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-green-300 matrix-glow transition-all duration-300 ease-out"
          style={{
            left: `${mobileIndicatorStyle.left}px`,
            width: `${mobileIndicatorStyle.width}px`,
            opacity: mobileIndicatorStyle.opacity
          }}
        />
      </nav>
    </>
  );
}