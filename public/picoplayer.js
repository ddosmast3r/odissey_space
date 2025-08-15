// Big thanks to https://github.com/AfBu/PicoLoader
// pico-8 web player variables that must be present
var Module;
var playable_area_count = 0;
var playarea_state = 0;
var codo_command = 0;
var codo_command_p = 0;
var codo_volume = 256;
var codo_running = true;
var pa_pid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// Pico-8 buttons to Web Player key codes lookup table
var pico8keys = [
  [37, 39, 38, 40, 90, 88],
  [83, 70, 69, 68, 9, 81]
];

// Loads pico8 web player library and setups everything to run
function PicoPlayer(element, cart, lib, width, height) {
  // fallback to bbs version of pico8 console
  if (!lib) {
    lib = 'https://www.lexaloffle.com/play/pico8_0205c.js';
  }

  // Default sizes if not provided
  if (!width) width = 512;
  if (!height) height = 512;

  // load element by ID
  if (typeof(element) == 'string') {
    element = document.getElementById(element);
  }

  // create canvas and add it into element
  var canvas = document.createElement('canvas');
  
  // Set canvas size explicitly
  canvas.width = 128;  // Keep native PICO-8 resolution
  canvas.height = 128;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.maxWidth = width + 'px';
  canvas.style.maxHeight = height + 'px';
  canvas.style.imageRendering = 'pixelated';
  canvas.style.imageRendering = '-moz-crisp-edges';
  canvas.style.imageRendering = 'crisp-edges';
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
  
  // Clear element content and set proper styling
  element.innerHTML = '';
  element.style.width = '100%';
  element.style.height = '100%';
  element.style.maxWidth = width + 'px';
  element.style.maxHeight = height + 'px';
  element.style.display = 'flex';
  element.style.alignItems = 'center';
  element.style.justifyContent = 'center';
  
  element.appendChild(canvas);

  // setup module to load card and point to our canvas
  Module = {
    arguments: [cart],
    canvas: canvas
  };

  // load pico8 library
  var head = document.getElementsByTagName('head')[0];
  var js = document.createElement('script');
  js.src = lib;
  
  // Apply scaling after PICO-8 loads and creates its canvas
  js.onload = function() {
    setTimeout(function() {
      var actualCanvas = element.querySelector('canvas');
      if (actualCanvas) {
        actualCanvas.style.width = '100%';
        actualCanvas.style.height = '100%';
        actualCanvas.style.maxWidth = width + 'px';
        actualCanvas.style.maxHeight = height + 'px';
        actualCanvas.style.imageRendering = 'pixelated';
        actualCanvas.style.imageRendering = '-moz-crisp-edges';
        actualCanvas.style.imageRendering = 'crisp-edges';
        actualCanvas.style.display = 'block';
        actualCanvas.style.margin = '0 auto';
        
        // Force reflow
        actualCanvas.offsetWidth;
      }
    }, 500); // Give PICO-8 time to initialize
  };
  
  head.appendChild(js);
}

// Game dispatch function to send events to PICO-8
function gd(event) {
  if (typeof Module !== 'undefined' && Module) {
    var evt = new KeyboardEvent(event.type, {
      keyCode: event.keyCode,
      which: event.keyCode,
      bubbles: true,
      cancelable: true
    });
    
    try {
      // Send to canvas if available
      if (Module.canvas) {
        Module.canvas.dispatchEvent(evt);
      }
      
      // Send to document as fallback
      document.dispatchEvent(evt);
      
    } catch (e) {
      console.warn('Failed to dispatch event:', e);
    }
  }
}

// press button
function PicoPress(k, p) {
  var kc = pico8keys[p][k];

  gd({
    type: 'keydown',
    keyCode: kc
  });
}

// release button
function PicoRelease(k, p) {
  var kc = pico8keys[p][k];

  gd({
    type: 'keyup',
    keyCode: kc
  });
}

// set volume (0 - 256)
function PicoVolume(vol) {
  codo_volume = vol;
  codo_command = 2;
  codo_command_p = codo_volume;
}

// toggle sound
function PicoMute() {
  codo_volume = (codo_volume == 0 ? 256 : 0);
  codo_command = 2;
  codo_command_p = codo_volume;
}

// toggle pause
function PicoPause() {
  codo_running = !codo_running;

  if (codo_running) {
    Module.resumeMainLoop();
  } else {
    Module.pauseMainLoop();
  }
}

// reset cart
function PicoReset() {
  codo_command = 1;
  codo_running = true;

  Module.resumeMainLoop();
}

window.addEventListener('keydown', (e) => {
  if (e.target.localName != 'input') {
    switch (e.keyCode) {
      case 37: // left
      case 39: // right
        e.preventDefault();
        break;
      case 38: // up
      case 40: // down
        e.preventDefault();
        break;
      default:
        break;
        }
    }
}, {
  capture: true,
  passive: false
});
