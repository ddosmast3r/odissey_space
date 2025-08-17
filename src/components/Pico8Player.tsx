'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Pico8PlayerProps {
  width?: number;
  height?: number;
}

declare global {
  interface Window {
    PicoPlayer: (containerId: string, cartPath: string, lib?: string, width?: number, height?: number) => void;
    PicoPress: (key: number, player: number) => void;
    PicoRelease: (key: number, player: number) => void;
  }
}

export default function Pico8Player({ 
  width = 512, 
  height = 512 
}: Pico8PlayerProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  
  // Joystick state
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [joystickTouchId, setJoystickTouchId] = useState<number | null>(null);
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setShowMobileControls(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const gameCartridge = '/pico-8/celeste_classic.p8.png';

  const loadGame = useCallback((gamePath: string) => {
    if (!containerRef.current || !window.PicoPlayer) {
      return;
    }

    setIsLoaded(false);
    setError(null);

    try {
      if (!containerRef.current) {
        setError('Container not ready');
        return;
      }

      containerRef.current.innerHTML = '';
      const containerId = 'pico-container-' + Date.now();
      containerRef.current.id = containerId;

      setTimeout(() => {
        try {
          window.PicoPlayer(containerId, gamePath, undefined, width, height);
          
          // Additional canvas scaling enforcement with monitoring
          const forceCanvasScaling = () => {
            if (!containerRef.current) return;
            const canvas = containerRef.current.querySelector('canvas');
            if (canvas) {
              // Make canvas responsive
              canvas.style.width = '100%';
              canvas.style.height = '100%';
              canvas.style.maxWidth = `${width}px`;
              canvas.style.maxHeight = `${height}px`;
              canvas.style.imageRendering = 'pixelated';
              canvas.style.display = 'block';
              canvas.style.margin = '0 auto';
              canvas.style.objectFit = 'fill';
              canvas.style.backgroundColor = 'black';
              canvas.style.transform = 'scale(1)';
              
              // Also set HTML attributes for extra enforcement
              canvas.setAttribute('width', '128');
              canvas.setAttribute('height', '128');
              canvas.setAttribute('style', `width: 100% !important; height: 100% !important; max-width: ${width}px !important; max-height: ${height}px !important; image-rendering: pixelated; display: block; margin: 0 auto; object-fit: fill; background-color: black;`);
              
              // Force browser reflow
              void canvas.offsetWidth;
            }
          };
          
          // Apply scaling multiple times to ensure it sticks
          setTimeout(forceCanvasScaling, 500);
          setTimeout(forceCanvasScaling, 1000);
          setTimeout(forceCanvasScaling, 2000);
          
          // Set up periodic checking
          const scalingInterval = setInterval(forceCanvasScaling, 1000);
          setTimeout(() => clearInterval(scalingInterval), 10000); // Stop after 10 seconds
          
          // Wait a bit more before marking as loaded to ensure PICO-8 is fully ready
          setTimeout(() => {
            setIsLoaded(true);
          }, 3000);
        } catch (err) {
          setError('Failed to load game: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
      }, 100);

    } catch (err) {
      setError('Failed to load game: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }, [width, height]);



  const handleStartGame = () => {
    setIsStarted(true);
    setError(null);
    
    // Загружаем PICO-8 скрипт если нужно, затем запускаем игру
    if (typeof window !== 'undefined' && !window.PicoPlayer) {
      const script = document.createElement('script');
      script.src = '/picoplayer.js';
      script.onload = () => {
        loadGame(gameCartridge);
      };
      script.onerror = () => {
        setError('Failed to load PicoPlayer library');
        setIsStarted(false);
      };
      document.head.appendChild(script);
    } else if (typeof window.PicoPlayer === 'function') {
      loadGame(gameCartridge);
    }
  };

  // Touch control handlers
  const handleButtonPress = (button: number) => {
    if (typeof window !== 'undefined' && window.PicoPress && isLoaded) {
      try {
        console.log('Pressing button:', button); // Debug log
        window.PicoPress(button, 0); // Player 0
      } catch (err) {
        console.warn('PICO-8 not ready for input:', err);
      }
    } else {
      console.warn('PicoPress not available or game not loaded');
    }
  };

  const handleButtonRelease = (button: number) => {
    if (typeof window !== 'undefined' && window.PicoRelease && isLoaded) {
      try {
        console.log('Releasing button:', button); // Debug log
        window.PicoRelease(button, 0); // Player 0
      } catch (err) {
        console.warn('PICO-8 not ready for input:', err);
      }
    } else {
      console.warn('PicoRelease not available or game not loaded');
    }
  };

  const handleTouchButton = (button: number) => {
    return {
      onTouchStart: (e: React.TouchEvent) => {
        e.preventDefault(); // Prevent scroll when touching buttons
        e.stopPropagation();
        handleButtonPress(button);
      },
      onTouchEnd: (e: React.TouchEvent) => {
        e.preventDefault(); // Prevent scroll when releasing buttons
        e.stopPropagation();
        handleButtonRelease(button);
      },
      onMouseDown: (e: React.MouseEvent) => {
        e.preventDefault();
        handleButtonPress(button);
      },
      onMouseUp: (e: React.MouseEvent) => {
        e.preventDefault();
        handleButtonRelease(button);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        e.preventDefault();
        handleButtonRelease(button);
      }
    };
  };

  // Joystick handlers
  const getJoystickDistance = (x: number, y: number) => {
    return Math.sqrt(x * x + y * y);
  };

  const normalizeJoystickPosition = (x: number, y: number, maxDistance: number) => {
    const distance = getJoystickDistance(x, y);
    if (distance <= maxDistance) {
      return { x, y };
    }
    const angle = Math.atan2(y, x);
    return {
      x: Math.cos(angle) * maxDistance,
      y: Math.sin(angle) * maxDistance
    };
  };

  const updateDirectionalInput = useCallback((x: number, y: number) => {
    const threshold = 0.3;
    const maxDistance = 50;
    
    // Normalize position
    const normalizedX = x / maxDistance;
    const normalizedY = y / maxDistance;
    
    // Determine which buttons should be pressed
    const shouldPressLeft = normalizedX < -threshold;
    const shouldPressRight = normalizedX > threshold;
    const shouldPressUp = normalizedY < -threshold;
    const shouldPressDown = normalizedY > threshold;
    
    if (typeof window !== 'undefined' && window.PicoPress && window.PicoRelease && isLoaded) {
      try {
        // Handle horizontal movement
        if (shouldPressLeft && !shouldPressRight) {
          window.PicoRelease(1, 0); // Release Right
          window.PicoPress(0, 0);   // Press Left
        } else if (shouldPressRight && !shouldPressLeft) {
          window.PicoRelease(0, 0); // Release Left
          window.PicoPress(1, 0);   // Press Right
        } else {
          window.PicoRelease(0, 0); // Release Left
          window.PicoRelease(1, 0); // Release Right
        }
        
        // Handle vertical movement
        if (shouldPressUp && !shouldPressDown) {
          window.PicoRelease(3, 0); // Release Down
          window.PicoPress(2, 0);   // Press Up
        } else if (shouldPressDown && !shouldPressUp) {
          window.PicoRelease(2, 0); // Release Up
          window.PicoPress(3, 0);   // Press Down
        } else {
          window.PicoRelease(2, 0); // Release Up
          window.PicoRelease(3, 0); // Release Down
        }
      } catch (err) {
        // Ignore errors
      }
    }
  }, [isLoaded]);

  const handleJoystickMove = useCallback((clientX: number, clientY: number) => {
    if (!joystickRef.current || !isDragging) return;
    
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    const maxDistance = 50;
    const normalized = normalizeJoystickPosition(deltaX, deltaY, maxDistance);
    
    setJoystickPos(normalized);
    updateDirectionalInput(normalized.x, normalized.y);
  }, [isDragging, updateDirectionalInput]);

  const handleJoystickStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    handleJoystickMove(clientX, clientY);
  }, [handleJoystickMove]);

  const handleJoystickEnd = useCallback(() => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
    
    // Release all directional buttons
    if (typeof window !== 'undefined' && window.PicoRelease && isLoaded) {
      [0, 1, 2, 3].forEach(btn => {
        try {
          window.PicoRelease(btn, 0);
        } catch (err) {
          // Ignore errors
        }
      });
    }
  }, [isLoaded]);

  // Mouse events for joystick
  const handleJoystickMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleJoystickStart(e.clientX, e.clientY);
  };

  const handleJoystickMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    handleJoystickMove(e.clientX, e.clientY);
  }, [handleJoystickMove]);

  const handleJoystickMouseUp = useCallback((e: MouseEvent) => {
    e.preventDefault();
    handleJoystickEnd();
  }, [handleJoystickEnd]);

  // Touch events for joystick
  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    if (joystickTouchId !== null) return; // Already tracking a touch
    
    const touch = e.touches[0];
    e.preventDefault(); // Prevent scroll when starting joystick interaction
    e.stopPropagation();
    setJoystickTouchId(touch.identifier);
    handleJoystickStart(touch.clientX, touch.clientY);
  };

  const handleJoystickTouchMove = useCallback((e: TouchEvent) => {
    if (joystickTouchId === null) return;
    
    // Find the specific touch we're tracking
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch.identifier === joystickTouchId) {
        e.preventDefault(); // Prevent scroll only when moving joystick
        handleJoystickMove(touch.clientX, touch.clientY);
        break;
      }
    }
  }, [handleJoystickMove, joystickTouchId]);

  const handleJoystickTouchEnd = useCallback((e: TouchEvent) => {
    if (joystickTouchId === null) return;
    
    // Check if our tracked touch ended
    let ourTouchEnded = true;
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch.identifier === joystickTouchId) {
        ourTouchEnded = false;
        break;
      }
    }
    
    if (ourTouchEnded) {
      setJoystickTouchId(null);
      handleJoystickEnd();
    }
  }, [handleJoystickEnd, joystickTouchId]);

  // Global event listeners for mouse/touch move and end
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleJoystickMouseMove);
      document.addEventListener('mouseup', handleJoystickMouseUp);
      document.addEventListener('touchmove', handleJoystickTouchMove, { passive: false });
      document.addEventListener('touchend', handleJoystickTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleJoystickMouseMove);
        document.removeEventListener('mouseup', handleJoystickMouseUp);
        document.removeEventListener('touchmove', handleJoystickTouchMove);
        document.removeEventListener('touchend', handleJoystickTouchEnd);
      };
    }
  }, [isDragging, handleJoystickMouseMove, handleJoystickMouseUp, handleJoystickTouchMove, handleJoystickTouchEnd]);

  return (
    <div className="pico8-player bg-black p-4 rounded-lg">
      
      <div className="relative">
        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-100 rounded">
            Error: {error}
          </div>
        )}
        
        {!isStarted ? (
          <div
            className="border-2 border-blue-600 rounded-lg mx-auto bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 w-full max-w-full aspect-square flex items-center justify-center shadow-xl"
            style={{ 
              maxWidth: `${width}px`, 
              maxHeight: `${height}px`,
              imageRendering: 'pixelated'
            }}
          >
            <button
              onClick={handleStartGame}
              className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-pixel border-2 border-green-400 hover:border-green-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <span className="relative z-10">{t('pico8.play')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl rounded-xl"></div>
            </button>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="border-2 border-blue-600 rounded-lg mx-auto bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 w-full max-w-full aspect-square shadow-xl"
            style={{ 
              maxWidth: `${width}px`, 
              maxHeight: `${height}px`,
              imageRendering: 'pixelated',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        )}
        
        {/* Touch Controls - Mobile Only */}
        {isLoaded && isStarted && showMobileControls && (
          <div className="mt-6">
            <div className="flex justify-between items-center max-w-md mx-auto px-4">
              {/* Virtual Joystick */}
              <div className="relative">
                <div 
                  ref={joystickRef}
                  className="relative w-28 h-28 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full border-4 border-gray-600 shadow-xl cursor-pointer select-none flex items-center justify-center"
                  onMouseDown={handleJoystickMouseDown}
                  onTouchStart={handleJoystickTouchStart}
                  style={{
                    touchAction: 'none',
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(0,0,0,0.3))',
                    boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Joystick Knob */}
                  <div
                    ref={knobRef}
                    className="absolute w-10 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full border-2 border-blue-300 shadow-lg transition-all duration-75 ease-out"
                    style={{
                      transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                      background: isDragging 
                        ? 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 1), rgba(29, 78, 216, 1))' 
                        : 'radial-gradient(circle at 30% 30%, rgba(96, 165, 250, 1), rgba(59, 130, 246, 1))',
                      boxShadow: isDragging 
                        ? 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(59, 130, 246, 0.5)' 
                        : 'inset 0 2px 4px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.3)',
                      scale: isDragging ? '0.95' : '1'
                    }}
                  />
                  
                  {/* Center dot for reference */}
                  <div className="absolute w-1.5 h-1.5 bg-gray-500 rounded-full opacity-30" />
                  
                  {/* Directional indicators */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs">↑</div>
                    <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs">↓</div>
                    <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">←</div>
                    <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">→</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Diagonal Layout */}
              <div className="relative w-32 h-32">
                <button
                  className="group absolute top-0 left-12 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:from-blue-800 active:to-blue-900 text-white font-bold w-16 h-16 rounded-full select-none shadow-xl border-4 border-blue-400 hover:border-blue-300 flex items-center justify-center transform transition-all duration-200 hover:scale-110 active:scale-95 relative overflow-hidden"
                  {...handleTouchButton(5)} // X button
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"></div>
                  <span className="font-pixel font-black text-2xl relative z-10 text-center ml-1 mt-px">X</span>
                  <div className="absolute inset-0 bg-blue-400/30 opacity-0 group-active:opacity-100 transition-opacity duration-100 rounded-full"></div>
                </button>
                <button
                  className="group absolute bottom-0 right-1 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 active:from-green-800 active:to-green-900 text-white font-bold w-16 h-16 rounded-full select-none shadow-xl border-4 border-green-400 hover:border-green-300 flex items-center justify-center transform transition-all duration-200 hover:scale-110 active:scale-95 relative overflow-hidden"
                  {...handleTouchButton(4)} // Z button
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"></div>
                  <span className="font-pixel font-black text-2xl relative z-10 text-center ml-1 mt-px">Z</span>
                  <div className="absolute inset-0 bg-green-400/30 opacity-0 group-active:opacity-100 transition-opacity duration-100 rounded-full"></div>
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-400 text-center">
              <p>{t('pico8.joystick')} • {t('pico8.controls')}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}