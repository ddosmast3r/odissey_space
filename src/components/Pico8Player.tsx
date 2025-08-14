'use client';

import { useEffect, useRef, useState } from 'react';

interface Pico8PlayerProps {
  width?: number;
  height?: number;
}

declare global {
  interface Window {
    PicoPlayer: (containerId: string, cartPath: string, lib?: string, width?: number, height?: number) => void;
  }
}

export default function Pico8Player({ 
  width = 512, 
  height = 512 
}: Pico8PlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableGames = [
    '/pico-8/demo_game.p8.png',
    '/pico-8/pico_race.p8.png',
    '/pico-8/breaker.p8.png',
    '/pico-8/jelpi.p8.png',
    '/pico-8/donsol.p8.png',
    '/pico-8/celeste_classic.p8.png',
    '/pico-8/traficgame-0.p8.png'
  ];

  useEffect(() => {
    if (availableGames.length > 0 && !selectedGame) {
      setSelectedGame(availableGames[0]);
    }
    loadPicoPlayerScript();
  }, []);

  const loadPicoPlayerScript = () => {
    if (typeof window !== 'undefined' && !window.PicoPlayer) {
      const script = document.createElement('script');
      script.src = '/picoplayer.js';
      script.onload = () => {
        if (selectedGame) {
          loadGame(selectedGame);
        }
      };
      script.onerror = () => {
        setError('Failed to load PicoPlayer library');
      };
      document.head.appendChild(script);
    } else if (typeof window.PicoPlayer === 'function' && selectedGame) {
      loadGame(selectedGame);
    }
  };

  const loadGame = (gamePath: string) => {
    
    if (!containerRef.current || !window.PicoPlayer) 
      
      return;

    setIsLoaded(false);
    setError(null);

    try {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      const containerId = 'pico-container-' + Date.now();
      containerRef.current.id = containerId;

      setTimeout(() => {
        try {
          window.PicoPlayer(containerId, gamePath, undefined, width, height);
          setIsLoaded(true);
        } catch (err) {
          setError('Failed to load game: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
      }, 100);

    } catch (err) {
      setError('Failed to load game: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    if (selectedGame && typeof window.PicoPlayer === 'function') {
      loadGame(selectedGame);
    }
  }, [selectedGame]);

  const handleGameSelect = (game: string) => {
    setSelectedGame(game);
  };

  return (
    <div className="pico8-player bg-black p-4 rounded-lg">
      <div className="mb-4">
        <label htmlFor="game-select" className="block text-white mb-2">
          Select Game:
        </label>
        <select
          id="game-select"
          value={selectedGame}
          onChange={(e) => handleGameSelect(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded mr-2"
        >
          {availableGames.map((game) => (
            <option key={game} value={game}>
              {game.split('/').pop()?.replace(/\.(p8\.png|p8|js)$/, '')}
            </option>
          ))}
        </select>
      </div>
      
      <div className="relative">
        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-100 rounded">
            Error: {error}
          </div>
        )}
        
        
        <div
          ref={containerRef}
          className="border border-gray-600 rounded mx-auto"
          style={{ 
            width: `${width}px`, 
            height: `${height}px`,
            maxWidth: '100%',
            imageRendering: 'pixelated'
          }}
        />
        
        <style jsx>{`
          #${containerRef.current?.id} canvas {
            width: ${width}px !important;
            height: ${height}px !important;
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
            object-fit: contain;
          }
        `}</style>
        
        {isLoaded && (
          <div className="mt-4 text-xs text-gray-400">
            <p>Controls: Arrow keys to move, Z/X for buttons</p>
            <p>Press Enter for menu, P to pause</p>
          </div>
        )}
      </div>
    </div>
  );
}