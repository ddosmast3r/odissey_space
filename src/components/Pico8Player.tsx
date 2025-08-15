'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

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
        e.preventDefault();
        handleButtonPress(button);
      },
      onTouchEnd: (e: React.TouchEvent) => {
        e.preventDefault();
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
              <span className="relative z-10">PLAY</span>
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
        
        {isLoaded && !showMobileControls && isStarted && (
          <div className="mt-4 text-xs text-gray-400">
            <p>Controls: Arrow keys to move, Z/X for buttons</p>
            <p>Press Enter for menu, P to pause</p>
          </div>
        )}

        {/* Mobile Touch Controls */}
        {showMobileControls && isLoaded && isStarted && (
          <div className="mt-6">
            <div className="flex justify-between items-center max-w-sm mx-auto">
              {/* D-Pad */}
              <div className="relative">
                <div className="grid grid-cols-3 gap-1 w-36 h-36">
                  <div></div>
                  <button
                    className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:from-gray-800 active:to-gray-900 text-white font-bold rounded-lg select-none shadow-lg border-2 border-gray-500 flex items-center justify-center text-xl"
                    {...handleTouchButton(2)} // Up
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4l-8 8h6v8h4v-8h6z"/>
                    </svg>
                  </button>
                  <div></div>
                  <button
                    className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:from-gray-800 active:to-gray-900 text-white font-bold rounded-lg select-none shadow-lg border-2 border-gray-500 flex items-center justify-center text-xl"
                    {...handleTouchButton(0)} // Left
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 12l8-8v6h8v4h-8v6z"/>
                    </svg>
                  </button>
                  <div className="bg-gray-800 rounded-lg border-2 border-gray-600"></div>
                  <button
                    className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:from-gray-800 active:to-gray-900 text-white font-bold rounded-lg select-none shadow-lg border-2 border-gray-500 flex items-center justify-center text-xl"
                    {...handleTouchButton(1)} // Right
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 12l-8 8v-6H4v-4h8V4z"/>
                    </svg>
                  </button>
                  <div></div>
                  <button
                    className="bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 active:from-gray-800 active:to-gray-900 text-white font-bold rounded-lg select-none shadow-lg border-2 border-gray-500 flex items-center justify-center text-xl"
                    {...handleTouchButton(3)} // Down
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 20l8-8h-6V4h-4v8H4z"/>
                    </svg>
                  </button>
                  <div></div>
                </div>
              </div>

              {/* Action Buttons - Diagonal Layout */}
              <div className="relative w-40 h-40">
                <button
                  className="group absolute top-0 left-18 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:from-blue-800 active:to-blue-900 text-white font-bold w-20 h-20 rounded-full select-none shadow-xl border-4 border-blue-400 hover:border-blue-300 flex items-center justify-center transform transition-all duration-200 hover:scale-110 active:scale-95 relative overflow-hidden"
                  {...handleTouchButton(5)} // X button
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"></div>
                  <span className="font-pixel font-black text-4xl relative z-10 text-center ml-1 mt-px">X</span>
                  <div className="absolute inset-0 bg-blue-400/30 opacity-0 group-active:opacity-100 transition-opacity duration-100 rounded-full"></div>
                </button>
                <button
                  className="group absolute bottom-0 right-3 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 active:from-green-800 active:to-green-900 text-white font-bold w-20 h-20 rounded-full select-none shadow-xl border-4 border-green-400 hover:border-green-300 flex items-center justify-center transform transition-all duration-200 hover:scale-110 active:scale-95 relative overflow-hidden"
                  {...handleTouchButton(4)} // Z button
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"></div>
                  <span className="font-pixel font-black text-4xl relative z-10 text-center ml-1 mt-px">Z</span>
                  <div className="absolute inset-0 bg-green-400/30 opacity-0 group-active:opacity-100 transition-opacity duration-100 rounded-full"></div>
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-400 text-center">
              <p>D-Pad: Move • Z: Action/Jump • X: Secondary Action</p>
              <p>Tap and hold for continuous input</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}