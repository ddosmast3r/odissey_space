'use client';

import { useRef, useEffect, useState } from 'react';
import { parsePicoCadModel, PicoCadModel } from '@/lib/picocad-parser';
import { WebGLRenderer } from '@/lib/webgl-renderer';
import { AVAILABLE_MODELS, Model3D } from '@/lib/models-config';
import { vec3 } from 'gl-matrix';

interface PicoCadViewerProps {
  modelUrl?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function PicoCadViewer({ 
  modelUrl, 
  width = 800, 
  height = 600, 
  className = '' 
}: PicoCadViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<PicoCadModel | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);
  const [isWebGL, setIsWebGL] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dragInfo, setDragInfo] = useState<{
    isDragging: boolean;
    lastX: number;
    lastY: number;
    rotationX: number;
    rotationY: number;
    zoom: number;
  }>({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    rotationX: 0.2,
    rotationY: 0.5,
    zoom: 15  // Увеличили дистанцию камеры
  });

  // Initialize WebGL renderer
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      try {
        console.log('Initializing WebGL renderer...');
        console.log('Canvas size:', canvasRef.current.width, 'x', canvasRef.current.height);
        
        // Try different WebGL contexts
        const webglContexts = ['webgl2', 'webgl', 'experimental-webgl'];
        let webglSupported = false;
        
        for (const contextName of webglContexts) {
          try {
            const testGl = canvasRef.current.getContext(contextName);
            if (testGl) {
              console.log(`WebGL supported with context: ${contextName}`);
              webglSupported = true;
              break;
            }
          } catch (e) {
            console.log(`Failed ${contextName}:`, e);
          }
        }
        
        if (!webglSupported) {
          throw new Error('WebGL not supported');
        }
        
        rendererRef.current = new WebGLRenderer(canvasRef.current);
        setIsWebGL(true);
        setIsLoaded(true);
        console.log('WebGL renderer initialized successfully');
        
        // Start animation loop
        const animate = () => {
          if (rendererRef.current) {
            // Update camera based on drag info
            const cameraPosition = vec3.fromValues(0, 0, dragInfo.zoom);
            const cameraRotation = vec3.fromValues(dragInfo.rotationX, dragInfo.rotationY, 0);
            
            rendererRef.current.updateCamera(cameraPosition, cameraRotation);
            rendererRef.current.render();
          }
          animationRef.current = requestAnimationFrame(animate);
        };
        
        animate();
        
        // Auto-load first model (Ricky the Dog) after renderer is ready
        if (AVAILABLE_MODELS.length > 0) {
          console.log('Auto-loading first model:', AVAILABLE_MODELS[0].name);
          setTimeout(() => {
            loadModel(AVAILABLE_MODELS[0]);
          }, 1000);
        }
      } catch (err) {
        console.error('WebGL initialization failed:', err);
        setError(`WebGL error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsWebGL(false);
        // Fallback to 2D canvas
        initFallbackCanvas();
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, dragInfo.rotationX, dragInfo.rotationY, dragInfo.zoom]);
  
  const initFallbackCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (ctx && canvas) {
      // Draw a nice gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1e3a8a');
      gradient.addColorStop(1, '#1e40af');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw some "3D-looking" shapes
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 30, 100, 60);
      
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(canvas.width / 2 - 45, canvas.height / 2 - 25, 90, 50);
      
      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎮 PicoCad Viewer', canvas.width / 2, canvas.height / 2 - 60);
      
      ctx.font = '14px Arial';
      ctx.fillText('WebGL not supported', canvas.width / 2, canvas.height / 2 + 40);
      ctx.fillText('Using 2D fallback mode', canvas.width / 2, canvas.height / 2 + 60);
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Try a different browser for 3D', canvas.width / 2, canvas.height / 2 + 80);
      
      setIsLoaded(true);
    }
  };
  
  // Simple test to make sure canvas is visible
  useEffect(() => {
    if (canvasRef.current && !isLoaded && !rendererRef.current) {
      const canvas = canvasRef.current;
      console.log('Canvas element found:', canvas.width, 'x', canvas.height);
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw a simple test pattern
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('3D Viewer Loading...', canvas.width / 2, canvas.height / 2);
        
        console.log('Test canvas drawn with size:', canvas.width, 'x', canvas.height);
      }
    }
  }, [isLoaded]);
  
  const loadModel = async (modelConfig: Model3D) => {
    console.log('Loading model:', modelConfig.name, 'Renderer available:', !!rendererRef.current, 'IsWebGL:', isWebGL);
    
    setIsLoading(true);
    setError(null);
    setSelectedModel(modelConfig);
    
    try {
      // Load model text file
      console.log('Fetching model file:', modelConfig.txtFile);
      const response = await fetch(modelConfig.txtFile);
      if (!response.ok) {
        throw new Error(`Failed to load model: ${response.statusText}`);
      }
      
      const content = await response.text();
      console.log('Model file content length:', content.length);
      
      const parsedModel = parsePicoCadModel(content);
      console.log('Parsed model:', parsedModel);
      setModel(parsedModel);
      
      // Load model into WebGL renderer or 2D fallback
      if (rendererRef.current && isWebGL) {
        console.log('Loading model into WebGL renderer...');
        rendererRef.current.setModel(parsedModel);
        
        // Load texture if available
        if (modelConfig.textureFile) {
          try {
            console.log('Loading texture:', modelConfig.textureFile);
            await rendererRef.current.loadTexture(modelConfig.textureFile);
            console.log('Texture loaded successfully');
          } catch (texError) {
            console.warn('Failed to load texture:', texError);
          }
        }
      } else {
        // 2D fallback rendering
        console.log('Rendering model in 2D fallback mode');
        render2DModel(parsedModel, modelConfig);
      }
      
      console.log('Model loaded successfully:', modelConfig.name);
      
    } catch (err) {
      console.error('Failed to load model:', err);
      setError(err instanceof Error ? err.message : 'Failed to load model');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        try {
          const parsedModel = parsePicoCadModel(content);
          setModel(parsedModel);
          setError(null);
          
          console.log('Parsed PicoCad model:', parsedModel);
          
          // Load model into WebGL renderer
          if (rendererRef.current && isWebGL) {
            rendererRef.current.setModel(parsedModel);
          }
          
        } catch (err) {
          console.error('Failed to parse PicoCad model:', err);
          setError(err instanceof Error ? err.message : 'Failed to parse PicoCad file');
          setModel(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragInfo(prev => ({
      ...prev,
      isDragging: true,
      lastX: e.clientX,
      lastY: e.clientY
    }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragInfo.isDragging) {
      const deltaX = e.clientX - dragInfo.lastX;
      const deltaY = e.clientY - dragInfo.lastY;
      
      setDragInfo(prev => ({
        ...prev,
        rotationY: prev.rotationY + deltaX * 0.005,
        rotationX: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.rotationX + deltaY * 0.005)),
        lastX: e.clientX,
        lastY: e.clientY
      }));
    }
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setDragInfo(prev => ({
      ...prev,
      zoom: Math.max(5, Math.min(100, prev.zoom + e.deltaY * 0.05))
    }));
  };

  const handleMouseUp = () => {
    setDragInfo(prev => ({ ...prev, isDragging: false }));
  };

  const testCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('No canvas found');
      return;
    }
    
    console.log('Testing canvas:', canvas.width, 'x', canvas.height);
    
    // Test 2D first
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Canvas Test', canvas.width / 2, canvas.height / 2);
      console.log('2D test drawn');
    }
    
    // Test WebGL after delay
    setTimeout(() => {
      const gl = canvas.getContext('webgl');
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 1.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        console.log('WebGL green test drawn');
      }
    }, 2000);
  };

  const render2DModel = (model: PicoCadModel, modelConfig: Model3D) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!ctx || !canvas) return;
    
    // Clear canvas
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw model info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`📦 ${modelConfig.name}`, canvas.width / 2, 50);
    
    ctx.font = '14px Arial';
    ctx.fillText(`${model.objects.length} objects`, canvas.width / 2, 80);
    
    const totalVertices = model.objects.reduce((sum, obj) => sum + obj.vertices.length, 0);
    const totalFaces = model.objects.reduce((sum, obj) => sum + obj.faces.length, 0);
    
    ctx.fillText(`${totalVertices} vertices, ${totalFaces} faces`, canvas.width / 2, 100);
    
    // Draw a simple wireframe representation
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 50;
    const scale = 30;
    
    model.objects.forEach((obj, objIndex) => {
      obj.faces.forEach((face, faceIndex) => {
        if (face.vertices.length >= 3) {
          ctx.beginPath();
          for (let i = 0; i < face.vertices.length; i++) {
            const vertexIndex = face.vertices[i];
            const vertex = obj.vertices[vertexIndex];
            if (vertex) {
              const x = centerX + vertex.x * scale;
              const y = centerY - vertex.y * scale; // Flip Y
              
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
          }
          ctx.closePath();
          ctx.stroke();
        }
      });
    });
    
    // Show texture info if available
    if (modelConfig.textureFile) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '12px Arial';
      ctx.fillText('🎨 With texture', canvas.width / 2, canvas.height - 40);
    }
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Arial';
    ctx.fillText('2D mode: WebGL unavailable', canvas.width / 2, canvas.height - 20);
  };

  if (error) {
    return (
      <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ${className}`}>
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className={`picocad-viewer-container ${className}`}>
      
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block bg-gray-900 cursor-grab active:cursor-grabbing"
          style={{ 
            width: '100%', 
            height: `${height}px`,
            maxWidth: '100%',
            touchAction: 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>
      
      {/* Model Gallery */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🎮 Interactive 3D Model Gallery
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Click on any model below to load it in the 3D viewer above
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_MODELS.map((modelConfig) => (
            <div 
              key={modelConfig.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedModel?.id === modelConfig.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => !isLoading && loadModel(modelConfig)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {modelConfig.textureFile ? (
                    <img 
                      src={modelConfig.textureFile} 
                      alt={`${modelConfig.name} texture`}
                      className="w-16 h-16 object-cover rounded border border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                      <span className="text-2xl">🎲</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {modelConfig.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {modelConfig.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      modelConfig.category === 'character' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        : modelConfig.category === 'object'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {modelConfig.category}
                    </span>
                    {modelConfig.textureFile && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">🎨 Textured</span>
                    )}
                  </div>
                </div>
              </div>
              {selectedModel?.id === modelConfig.id && isLoading && (
                <div className="mt-3 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">Loading...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 space-y-4">
        {/* Viewer Status */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            🎮 PicoCad WebGL 3D Viewer
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">
                {isWebGL ? (
                  <span className="text-green-700 dark:text-green-300">✅ WebGL Active</span>
                ) : (
                  <span className="text-orange-700 dark:text-orange-300">⚠️ 2D Fallback</span>
                )}
              </p>
              <ul className="text-xs space-y-1">
                {isWebGL ? (
                  <>
                    <li className="text-green-600 dark:text-green-400">🌟 Real-time 3D rendering</li>
                    <li className="text-green-600 dark:text-green-400">🎮 Interactive camera controls</li>
                    <li className="text-green-600 dark:text-green-400">🎨 PICO-8 color palette</li>
                  </>
                ) : (
                  <>
                    <li className="text-orange-600 dark:text-orange-400">📄 File parsing only</li>
                    <li className="text-orange-600 dark:text-orange-400">⚠️ WebGL not supported</li>
                  </>
                )}
              </ul>
            </div>
            
            {selectedModel && model && (
              <div>
                <p className="font-medium text-green-700 dark:text-green-300 mb-1">📊 Loaded Model</p>
                <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                  <li>📝 {selectedModel.name}</li>
                  <li>🔺 {model.objects.reduce((acc, obj) => acc + obj.vertices.length, 0)} vertices</li>
                  <li>🎭 {model.objects.reduce((acc, obj) => acc + obj.faces.length, 0)} faces</li>
                  <li>📦 {model.objects.length} objects</li>
                  {selectedModel.textureFile && <li>🎨 With texture</li>}
                </ul>
              </div>
            )}
            
            <div>
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">🎮 Controls</p>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                <li>🖱️ Mouse drag: Rotate camera</li>
                <li>🔄 Mouse wheel: Zoom in/out</li>
                <li>🎮 Click models above to load them</li>
                {!selectedModel && <li>👆 Try clicking on "Ricky the Dog"!</li>}
              </ul>
              <button 
                onClick={testCanvas}
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                🔧 Test Canvas
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}