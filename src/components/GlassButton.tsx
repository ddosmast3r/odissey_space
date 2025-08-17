'use client';

import { useRef } from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassButton({ children, className = '', onClick }: GlassButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (buttonRef.current) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      buttonRef.current.appendChild(ripple);

      const rect = buttonRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      setTimeout(() => {
        ripple.remove();
      }, 500);
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`ripple-button px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-sm font-medium ${className}`}
    >
      {children}
    </button>
  );
}