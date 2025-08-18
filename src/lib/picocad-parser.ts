// Simplified PicoCad parser for modern format
export interface PicoCadVertex {
  x: number;
  y: number;
  z: number;
}

export interface PicoCadFace {
  vertices: number[];
  color: number;
  uv?: number[];
}

export interface PicoCadObject {
  name: string;
  position: PicoCadVertex;
  rotation: PicoCadVertex;
  vertices: PicoCadVertex[];
  faces: PicoCadFace[];
}

export interface PicoCadModel {
  name: string;
  vertexCount: number;
  faceCount: number;
  objectCount: number;
  objects: PicoCadObject[];
}

export function parsePicoCadModel(content: string): PicoCadModel {
  const lines = content.split('\n').map(line => line.trim());
  const header = lines[0];
  
  if (!header.startsWith('picocad;')) {
    throw new Error('Invalid PicoCad file format');
  }
  
  const headerParts = header.split(';');
  const name = headerParts[1] || 'Untitled';
  const vertexCount = parseInt(headerParts[2]) || 0;
  const faceCount = parseInt(headerParts[3]) || 0;
  const objectCount = parseInt(headerParts[4]) || 0;
  
  const objects: PicoCadObject[] = [];
  let currentObject: Partial<PicoCadObject> | null = null;
  let currentSection: 'none' | 'vertices' | 'faces' = 'none';
  let braceLevel = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    if (line === '{') {
      braceLevel++;
      if (braceLevel === 1) {
        // Start of new object
        currentObject = {
          name: 'object',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          vertices: [],
          faces: []
        };
        currentSection = 'none';
      }
      continue;
    }
    
    if (line === '}') {
      braceLevel--;
      if (braceLevel === 0) {
        // End of object
        if (currentObject && currentObject.vertices && currentObject.faces) {
          objects.push(currentObject as PicoCadObject);
        }
        currentObject = null;
        currentSection = 'none';
      } else if (braceLevel === 1) {
        // End of section (vertices or faces)
        currentSection = 'none';
      }
      continue;
    }
    
    if (braceLevel >= 1 && currentObject) {
      // Parse object properties
      if (line.includes("name=")) {
        const match = line.match(/name='([^']+)'/);
        if (match) {
          currentObject.name = match[1];
        }
        continue;
      }
      
      if (line.includes("pos=")) {
        const match = line.match(/pos=\{([^}]+)\}/);
        if (match) {
          const coords = match[1].split(',').map(s => parseFloat(s.trim()));
          currentObject.position = { x: coords[0] || 0, y: coords[1] || 0, z: coords[2] || 0 };
        }
        continue;
      }
      
      if (line.includes("rot=")) {
        const match = line.match(/rot=\{([^}]+)\}/);
        if (match) {
          const coords = match[1].split(',').map(s => parseFloat(s.trim()));
          currentObject.rotation = { x: coords[0] || 0, y: coords[1] || 0, z: coords[2] || 0 };
        }
        continue;
      }
      
      if (line.trim() === 'v={') {
        currentSection = 'vertices';
        continue;
      }
      
      if (line.trim() === 'f={') {
        currentSection = 'faces';
        continue;
      }
      
      // Parse vertex data
      if (currentSection === 'vertices' && line.includes('{') && line.includes('}')) {
        const match = line.match(/\{([^}]+)\}/);
        if (match && currentObject.vertices) {
          const coords = match[1].split(',').map(s => parseFloat(s.trim()));
          if (coords.length >= 3) {
            const vertex = { x: coords[0], y: coords[1], z: coords[2] };
            currentObject.vertices.push(vertex);
          }
        }
      }
      
      // Parse face data
      if (currentSection === 'faces' && line.includes('{') && line.includes('}')) {
        const match = line.match(/\{([^}]+)\}/);
        if (match && currentObject.faces) {
          const faceContent = match[1];
          const vertices: number[] = [];
          let color = 1;
          let uv: number[] = [];
          
          // Split by commas but handle nested braces for UV coordinates
          const parts = [];
          let current = '';
          let braceDepth = 0;
          
          for (let j = 0; j < faceContent.length; j++) {
            const char = faceContent[j];
            if (char === '{') braceDepth++;
            if (char === '}') braceDepth--;
            
            if (char === ',' && braceDepth === 0) {
              parts.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          if (current.trim()) parts.push(current.trim());
          
          // Parse each part
          for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.startsWith('c=')) {
              color = parseInt(trimmed.substring(2)) || 1;
            } else if (trimmed.startsWith('uv=')) {
              // Handle case where UV data might not have closing brace on same part
              const uvMatch = trimmed.match(/uv=\{(.+)/);
              if (uvMatch) {
                let uvData = uvMatch[1];
                // Remove closing brace if present
                if (uvData.endsWith('}')) {
                  uvData = uvData.slice(0, -1);
                }
                uv = uvData.split(',').map(s => parseFloat(s.trim()));
              }
            } else if (!isNaN(parseInt(trimmed))) {
              vertices.push(parseInt(trimmed) - 1); // Convert to 0-based indexing
            }
          }
          
          if (vertices.length >= 3) {
            currentObject.faces.push({ vertices, color, uv });
          }
        }
      }
    }
  }
  
  console.log('Parsed PicoCad model:', {
    name,
    objects: objects.length,
    totalVertices: objects.reduce((sum, obj) => sum + obj.vertices.length, 0),
    totalFaces: objects.reduce((sum, obj) => sum + obj.faces.length, 0)
  });
  
  return {
    name,
    vertexCount,
    faceCount,
    objectCount,
    objects
  };
}