import { mat4, vec3 } from 'gl-matrix';
import { PicoCadModel, PicoCadObject } from './picocad-parser';

// PICO-8 color palette
const PICO_COLORS = [
  [0, 0, 0],           // 0: black
  [29, 43, 83],        // 1: dark blue
  [126, 37, 83],       // 2: dark purple
  [0, 135, 81],        // 3: dark green
  [171, 82, 54],       // 4: brown
  [95, 87, 79],        // 5: dark grey
  [194, 195, 199],     // 6: light grey
  [255, 241, 232],     // 7: white
  [255, 0, 77],        // 8: red
  [255, 163, 0],       // 9: orange
  [255, 236, 39],      // 10: yellow
  [0, 228, 54],        // 11: green
  [41, 173, 255],      // 12: blue
  [131, 118, 156],     // 13: indigo
  [255, 119, 168],     // 14: pink
  [255, 204, 170]      // 15: peach
];

export class WebGLRenderer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram | null = null;
  private textureProgram: WebGLProgram | null = null;
  private buffers: { [key: string]: WebGLBuffer } = {};
  private uniformLocations: { [key: string]: WebGLUniformLocation | null } = {};
  private textureUniformLocations: { [key: string]: WebGLUniformLocation | null } = {};
  private attributeLocations: { [key: string]: number } = {};
  private textureAttributeLocations: { [key: string]: number } = {};
  
  private modelMatrix = mat4.create();
  private viewMatrix = mat4.create();
  private projectionMatrix = mat4.create();
  
  public cameraPosition = vec3.fromValues(0, 0, 5);
  public cameraRotation = vec3.fromValues(0, 0, 0);
  
  private texture: WebGLTexture | null = null;
  private hasTexture = false;
  private hasLogged = false;
  
  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl');
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    this.gl = gl;
    
    // Set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    // Set clear color to a more visible color for debugging
    gl.clearColor(0.2, 0.3, 0.4, 1.0);
    
    console.log('WebGL initialized with canvas size:', canvas.width, 'x', canvas.height);
    
    this.initShaders();
    this.initTextureShaders();
    this.setupMatrices(canvas.width, canvas.height);
  }
  
  private initShaders() {
    const vertexShaderSource = `
      attribute vec3 aVertexPosition;
      attribute vec3 aVertexColor;
      
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      
      varying lowp vec3 vColor;
      
      void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
        vColor = aVertexColor;
      }
    `;
    
    const fragmentShaderSource = `
      varying lowp vec3 vColor;
      
      void main(void) {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `;
    
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to load shaders');
    }
    
    this.program = this.gl.createProgram();
    if (!this.program) {
      throw new Error('Failed to create shader program');
    }
    
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw new Error('Unable to initialize shader program: ' + this.gl.getProgramInfoLog(this.program));
    }
    
    // Get attribute and uniform locations
    this.attributeLocations.vertexPosition = this.gl.getAttribLocation(this.program, 'aVertexPosition');
    this.attributeLocations.vertexColor = this.gl.getAttribLocation(this.program, 'aVertexColor');
    
    this.uniformLocations.projectionMatrix = this.gl.getUniformLocation(this.program, 'uProjectionMatrix');
    this.uniformLocations.modelViewMatrix = this.gl.getUniformLocation(this.program, 'uModelViewMatrix');
  }
  
  private initTextureShaders() {
    const vertexShaderSource = `
      attribute vec3 aVertexPosition;
      attribute vec2 aTextureCoord;
      
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      
      varying highp vec2 vTextureCoord;
      
      void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
        vTextureCoord = aTextureCoord;
      }
    `;
    
    const fragmentShaderSource = `
      varying highp vec2 vTextureCoord;
      
      uniform sampler2D uSampler;
      
      void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
      }
    `;
    
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to load texture shaders');
    }
    
    this.textureProgram = this.gl.createProgram();
    if (!this.textureProgram) {
      throw new Error('Failed to create texture shader program');
    }
    
    this.gl.attachShader(this.textureProgram, vertexShader);
    this.gl.attachShader(this.textureProgram, fragmentShader);
    this.gl.linkProgram(this.textureProgram);
    
    if (!this.gl.getProgramParameter(this.textureProgram, this.gl.LINK_STATUS)) {
      throw new Error('Unable to initialize texture shader program: ' + this.gl.getProgramInfoLog(this.textureProgram));
    }
    
    // Get texture attribute and uniform locations
    this.textureAttributeLocations.vertexPosition = this.gl.getAttribLocation(this.textureProgram, 'aVertexPosition');
    this.textureAttributeLocations.textureCoord = this.gl.getAttribLocation(this.textureProgram, 'aTextureCoord');
    
    this.textureUniformLocations.projectionMatrix = this.gl.getUniformLocation(this.textureProgram, 'uProjectionMatrix');
    this.textureUniformLocations.modelViewMatrix = this.gl.getUniformLocation(this.textureProgram, 'uModelViewMatrix');
    this.textureUniformLocations.sampler = this.gl.getUniformLocation(this.textureProgram, 'uSampler');
  }
  
  private loadShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling shader: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  private setupMatrices(width: number, height: number) {
    // Set up projection matrix
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = width / height;
    const zNear = 0.1;
    const zFar = 100.0;
    
    mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);
  }
  
  public setModel(model: PicoCadModel) {
    console.log('Setting model in WebGL renderer:', model);
    this.createBuffersFromModel(model);
    console.log('Model buffers created, numElements:', this.buffers.numElements);
  }
  
  public loadTexture(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      
      image.onload = () => {
        this.texture = this.gl.createTexture();
        if (!this.texture) {
          reject(new Error('Failed to create texture'));
          return;
        }
        
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        
        // Check if image is power of 2
        if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
          this.gl.generateMipmap(this.gl.TEXTURE_2D);
        } else {
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
          this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        }
        
        this.hasTexture = true;
        resolve();
      };
      
      image.onerror = () => {
        reject(new Error('Failed to load texture image'));
      };
      
      image.src = url;
    });
  }
  
  private isPowerOf2(value: number): boolean {
    return (value & (value - 1)) === 0;
  }
  
  private createBuffersFromModel(model: PicoCadModel) {
    const vertices: number[] = [];
    const colors: number[] = [];
    const uvCoords: number[] = [];
    const indices: number[] = [];
    
    let vertexOffset = 0;
    
    for (let objIndex = 0; objIndex < model.objects.length; objIndex++) {
      const obj = model.objects[objIndex];
      
      for (let faceIndex = 0; faceIndex < obj.faces.length; faceIndex++) {
        const face = obj.faces[faceIndex];
        
        if (face.vertices.length >= 3) {
          // Check if vertex indices are valid
          const validVertices = face.vertices.every(idx => 
            idx >= 0 && idx < obj.vertices.length && obj.vertices[idx]
          );
          
          if (!validVertices) {
            console.warn('Invalid vertex indices in face:', face.vertices, 'Object has', obj.vertices.length, 'vertices');
            continue;
          }
          
          // Convert face to triangles (simple fan triangulation)
          for (let i = 1; i < face.vertices.length - 1; i++) {
            const v1 = obj.vertices[face.vertices[0]];
            const v2 = obj.vertices[face.vertices[i]];
            const v3 = obj.vertices[face.vertices[i + 1]];
            
            if (v1 && v2 && v3) {
              
              // Add vertices
              vertices.push(v1.x + obj.position.x, v1.y + obj.position.y, v1.z + obj.position.z);
              vertices.push(v2.x + obj.position.x, v2.y + obj.position.y, v2.z + obj.position.z);
              vertices.push(v3.x + obj.position.x, v3.y + obj.position.y, v3.z + obj.position.z);
              
              // Add UV coordinates (if available)
              if (face.uv && face.uv.length >= 8) {
                // Use UV coordinates from the face
                uvCoords.push(face.uv[0] / 128, face.uv[1] / 128); // v1
                uvCoords.push(face.uv[2] / 128, face.uv[3] / 128); // v2  
                uvCoords.push(face.uv[4] / 128, face.uv[5] / 128); // v3
              } else {
                // Default UV coordinates
                uvCoords.push(0, 0);
                uvCoords.push(1, 0);
                uvCoords.push(0, 1);
              }
              
              // Add colors (from PICO-8 palette)
              const color = PICO_COLORS[face.color % PICO_COLORS.length];
              const r = color[0] / 255;
              const g = color[1] / 255;
              const b = color[2] / 255;
              
              colors.push(r, g, b);
              colors.push(r, g, b);
              colors.push(r, g, b);
              
              // Add indices
              indices.push(vertexOffset, vertexOffset + 1, vertexOffset + 2);
              vertexOffset += 3;
            }
          }
        }
      }
    }
    
    console.log('WebGL buffers created:', {
      vertices: vertices.length / 3,
      triangles: indices.length / 3
    });
    
    // Create vertex buffer
    this.buffers.position = this.gl.createBuffer()!;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    
    // Create color buffer
    this.buffers.color = this.gl.createBuffer()!;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    
    // Create UV buffer
    this.buffers.uv = this.gl.createBuffer()!;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.uv);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uvCoords), this.gl.STATIC_DRAW);
    
    // Create index buffer
    this.buffers.indices = this.gl.createBuffer()!;
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    
    // Store triangle count
    this.buffers.numElements = indices.length;
  }
  
  public render() {
    // Always clear the canvas first
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    if (!this.program || (!this.textureProgram && this.hasTexture)) {
      console.log('Render skipped: program or textureProgram not ready');
      return;
    }
    
    // Check if we have any data to render
    if (!this.buffers.indices || !this.buffers.numElements) {
      // console.log('No model data to render');
      return;
    }
    
    // Choose appropriate shader program
    const currentProgram = this.hasTexture && this.textureProgram ? this.textureProgram : this.program;
    const currentAttributes = this.hasTexture ? this.textureAttributeLocations : this.attributeLocations;
    const currentUniforms = this.hasTexture ? this.textureUniformLocations : this.uniformLocations;
    
    // Use shader program
    this.gl.useProgram(currentProgram);
    
    // Set up view matrix (camera)
    mat4.identity(this.viewMatrix);
    mat4.translate(this.viewMatrix, this.viewMatrix, [0, 0, -this.cameraPosition[2]]);
    mat4.rotateX(this.viewMatrix, this.viewMatrix, this.cameraRotation[0]);
    mat4.rotateY(this.viewMatrix, this.viewMatrix, this.cameraRotation[1]);
    mat4.rotateZ(this.viewMatrix, this.viewMatrix, this.cameraRotation[2]);
    
    // Combine model and view matrices
    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, this.viewMatrix, this.modelMatrix);
    
    // Set uniforms
    this.gl.uniformMatrix4fv(currentUniforms.projectionMatrix, false, this.projectionMatrix);
    this.gl.uniformMatrix4fv(currentUniforms.modelViewMatrix, false, modelViewMatrix);
    
    // Bind vertex buffer
    if (this.buffers.position) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
      this.gl.vertexAttribPointer(currentAttributes.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(currentAttributes.vertexPosition);
    }
    
    if (this.hasTexture && this.texture) {
      // Bind texture
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.uniform1i(currentUniforms.sampler, 0);
      
      // Bind UV buffer
      if (this.buffers.uv && currentAttributes.textureCoord !== undefined) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.uv);
        this.gl.vertexAttribPointer(currentAttributes.textureCoord, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(currentAttributes.textureCoord);
      }
    } else {
      // Bind color buffer (for non-textured rendering)
      if (this.buffers.color && currentAttributes.vertexColor !== undefined) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
        this.gl.vertexAttribPointer(currentAttributes.vertexColor, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(currentAttributes.vertexColor);
      }
    }
    
    // Bind index buffer and draw
    if (this.buffers.indices && this.buffers.numElements) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
      this.gl.drawElements(this.gl.TRIANGLES, this.buffers.numElements, this.gl.UNSIGNED_SHORT, 0);
      
      // Debug: log once when drawing
      if (!this.hasLogged) {
        console.log(`Drawing ${this.buffers.numElements} triangles, hasTexture: ${this.hasTexture}`);
        this.hasLogged = true;
      }
    }
  }
  
  public updateCamera(position: vec3, rotation: vec3) {
    vec3.copy(this.cameraPosition, position);
    vec3.copy(this.cameraRotation, rotation);
  }
  
  public resize(width: number, height: number) {
    this.gl.viewport(0, 0, width, height);
    this.setupMatrices(width, height);
  }
}