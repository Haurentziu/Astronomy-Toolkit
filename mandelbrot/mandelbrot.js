var canvasWidth, canvasHeight;
var scene, aspect_ratio, camera, renderer, controls;
var fractalMesh;

var lastScale = 1;
var redX, redY, greenX, greenY, blueX, blueY;

//FIRE
/*
redX = [0,0.20416666666666666,0.45625,0.6666666666666666,0.7895833333333333,1];
redY = [0.03,0.96,0.99,0.99,0.21,0.03];
greenX = [0,0.20416666666666666,0.45625,0.6666666666666666,0.7895833333333333,1];
greenY = [0.02,0.13,0.65,0.99,0.44,0.02];
blueX = [0,0.19583333333333333,0.43333333333333335,0.6193700851932649,0.7979166666666667,1];
blueY = [0.15,0.02,0.03,0.46976440429687505,0.97,0.15];

*/

redX = [0,0.1613055690642326,0.45625,0.6666666666666666,0.8322733109997165,1];
redY = [0.025802001953124987,0.22580200195312505,0.99,0.99,0.955802001953125,0.025802001953124987];
greenX = [0,0.15807976261261972,0.38388621422552294,0.6774346013222972,0.8258216980964906,1];
greenY = [0.12278320312500002,0.452783203125,0.962783203125,0.6827832031250001,0.252783203125,0.12278320312500002];
blueX = [0,0.19033782712874875,0.3967894400319745,0.616144278741652,0.848402343257781,1];
blueY = [0.269764404296875,0.949764404296875,0.939764404296875,0.019764404296874982,0.08976440429687504,0.269764404296875];



//FROST
/*
redX = [0,0.19678944003197454,0.45625,0.6666666666666666,0.7742087948706842,1];
redY = [0.025802001953124987,0.3591983032226562,0.99,0.99,0.905802001953125,0.025802001953124987];
greenX = [0,0.18388621422552293,0.41937008519326485,0.6387249239029423,0.7935636335803616,1];
greenY = [0.232783203125,0.54617919921875,0.9999530029296875,0.732783203125,0.5327832031249999,0.232783203125];
blueX = [0,0.19678944003197454,0.41614427874165194,0.616144278741652,0.7774346013222971,1];
blueY = [0.409764404296875,0.659764404296875,1.0069342041015625,0.08976440429687504,0.06976440429687503,0.409764404296875];
*/

//B&W
/*
redX = [0,0.20324105293520034,0.40646685938681326,0.645176536806168,0.7613055690642326,1];
redY = [0.05580200195312501,0.795802001953125,0.25580200195312497,0.985802001953125,0.435802001953125,0.05580200195312501];
greenX = [0,0.20324105293520034,0.40646685938681326,0.645176536806168,0.7613055690642326,1];
greenY = [0.05580200195312501,0.795802001953125,0.25580200195312497,0.985802001953125,0.435802001953125,0.05580200195312501];
blueX = [0,0.20324105293520034,0.40646685938681326,0.645176536806168,0.7613055690642326,1];
blueY = [0.05580200195312501,0.795802001953125,0.25580200195312497,0.985802001953125,0.435802001953125,0.05580200195312501];
*/

var redInterpolator = new Interpolator(redX.slice(), redY.slice());
var greenInterpolator = new Interpolator(greenX.slice(), greenY.slice());
var blueInterpolator = new Interpolator(blueX.slice(), blueY.slice());

var redPalette, greenPalette, bluePalette;

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
//document.body.appendChild(stats.dom);

var shouldUpdate = true;

var lastEventUnix = Date.now();
var normalPixelRatio = true;

window.onload = function(){
  init();
  addListeners(renderer);
  addJuliaPresets();

  createFractal();
  resize();
  window.onresize = resize;

  render();

  redPalette = new ColorPalette(redInterpolator, redInterpolator, greenInterpolator, blueInterpolator, "red");
  greenPalette = new ColorPalette(greenInterpolator, redInterpolator, greenInterpolator, blueInterpolator, "green");
  bluePalette = new ColorPalette(blueInterpolator, redInterpolator, greenInterpolator, blueInterpolator, "blue");


  redPalette.draw();
  greenPalette.draw();
  bluePalette.draw();
}

function resetPalettes(){
  redInterpolator = new Interpolator(redX.slice(), redY.slice());
  greenInterpolator = new Interpolator(greenX.slice(), greenY.slice());
  blueInterpolator = new Interpolator(blueX.slice(), blueY.slice());

  redPalette = new ColorPalette(redInterpolator, redInterpolator, greenInterpolator, blueInterpolator, "red");
  greenPalette = new ColorPalette(greenInterpolator, redInterpolator, greenInterpolator, blueInterpolator, "green");
  bluePalette = new ColorPalette(blueInterpolator, redInterpolator, greenInterpolator, blueInterpolator, "blue");

  updatePaletts();
  shouldUpdate = true;
}

function printPalettes(){
  console.log("redX = [" + redInterpolator.getDataX().toString() + "]; \n" +
    "redY = [" + redInterpolator.getDataY().toString() + "]; \n" +

    "greenX = [" + greenInterpolator.getDataX().toString() + "]; \n" +
    "greenY = [" + greenInterpolator.getDataY().toString() + "]; \n" +

    "blueX = [" + blueInterpolator.getDataX().toString() + "]; \n" +
    "blueY = [" + blueInterpolator.getDataY().toString() + "]; \n"
  );
}

function render(){
  stats.begin();
  if(!normalPixelRatio && Date.now() - lastEventUnix > 50){
    renderer.setPixelRatio(window.devicePixelRatio);
    normalPixelRatio = true;
    shouldUpdate = true;
  }

  if(shouldUpdate){
  //  var uaie = Date.now();
    renderer.render(scene, camera);
    shouldUpdate = false;
  //  console.log(Date.now() - uaie);
 }
  stats.end();
  requestAnimationFrame(render);
}

function updatePaletts(){
  redPalette.draw();
  greenPalette.draw();
  bluePalette.draw();

  fractalMesh.material.uniforms.slopes_red.value = redInterpolator.getSlopes();
  fractalMesh.material.uniforms.slopes_green.value = greenInterpolator.getSlopes();
  fractalMesh.material.uniforms.slopes_blue.value = blueInterpolator.getSlopes();

  fractalMesh.material.uniforms.palette_red.value = floatArrayToVec2Array(redInterpolator.getDataX(), redInterpolator.getDataY());
  fractalMesh.material.uniforms.palette_green.value = floatArrayToVec2Array(greenInterpolator.getDataX(), greenInterpolator.getDataY());
  fractalMesh.material.uniforms.palette_blue.value = floatArrayToVec2Array(blueInterpolator.getDataX(), blueInterpolator.getDataY());

  shouldUpdate = true;
}

function floatArrayToVec2Array(x, y){
  var array = [];
  for(var i = 0; i < x.length; i++){
    array[i] = new THREE.Vector2(x[i], y[i])
  }
  return array;
}

function createFractal(){
  var geometry = new THREE.PlaneGeometry(2, 2, 0);
  var material = new THREE.ShaderMaterial({
      uniforms: {
          zoom: { type: 'f', value: 1},
          coloring: { type: 'i', value: 2},
          aspect_ratio: {type: 'f', value: 1.0},
          //origin: {type: '2f', value: new THREE.Vector2(0.001643721971153, -0.822467633298876)}
          origin: {type: '2f', value: new THREE.Vector2(0.0, 0.0)},
          color_offset: {type: 'f', value: 0.0},
          color_density: {type: 'f', value: 1.0},
          fractal_type: {type: 'i', value: 0},

          julia_real: {type: 'f', value: 0.285},
          julia_imag: {type: 'f', value: 0.01},

          escape_radius_sq: {type: 'f', value: 1e14},

          orbit_trap_point: {type: '2f', value: new THREE.Vector2(0, 0)},

          orbit_trap_line_a: {type: 'f', value: -1},
          orbit_trap_line_b: {type: 'f', value: 0},
          orbit_trap_line_c: {type: 'f', value: 0.12},

          slopes_red: {type : 'uFloatArray', value: redInterpolator.getSlopes()},
          slopes_green: {type : 'uFloatArray', value: greenInterpolator.getSlopes()},
          slopes_blue: {type : 'uFloatArray', value: blueInterpolator.getSlopes()},

          palette_red: {type: 'v2v', value: floatArrayToVec2Array(redInterpolator.getDataX(), redInterpolator.getDataY())},
          palette_green: {type: 'v2v', value: floatArrayToVec2Array(greenInterpolator.getDataX(), greenInterpolator.getDataY())},
          palette_blue: {type: 'v2v', value: floatArrayToVec2Array(blueInterpolator.getDataX(), blueInterpolator.getDataY())},

      },
      vertexShader: document.getElementById('fractal-vertex').innerHTML,
      fragmentShader: document.getElementById('fractal-fragment').innerHTML
  });
  fractalMesh = new THREE.Mesh(geometry, material);
  scene.add(fractalMesh);
}

function resize(){
  canvasWidth = Math.floor(getBrowserWidth() * window.devicePixelRatio);
  canvasHeight = Math.floor(getBrowserHeight() * window.devicePixelRatio);
  aspectRatio = canvasWidth / canvasHeight;
  fractalMesh.scale.copy( new THREE.Vector3(aspectRatio, 1.0, 1 ) );
  fractalMesh.material.uniforms.aspect_ratio.value = aspectRatio;
  renderer.setSize(getBrowserWidth(), getBrowserHeight());
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.domElement.style.width = getBrowserWidth() + "px";
  renderer.domElement.style.height = getBrowserHeight() + "px";
  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();

  var selectorCanvas = document.getElementById("selector_canvas");
  selectorCanvas.width = canvasWidth;
  selectorCanvas.height = canvasHeight;

  selectorCanvas.style.width = getBrowserWidth();
  selectorCanvas.style.height = getBrowserHeight();
  shouldUpdate = true;

}

function decreasePixelRatio(){
  lastEventUnix = Date.now();
  renderer.setPixelRatio(0.25);
  normalPixelRatio = false;
  shouldUpdate = true;
}

function setColoring(coloring){
  fractalMesh.material.uniforms.coloring.value = coloring;
  shouldUpdate = true;
  var new_esc_radius = 1e7;

  if(coloring == 4){
    new_esc_radius = 1e3;
  }
  setEscapeRadius(new_esc_radius); //TIA has problems with 32 bit precission!
  updateFieldInput("radius_input", new_esc_radius.toExponential());

  shouldUpdate = true;
}

function setFractalType(type){
  fractalMesh.material.uniforms.fractal_type.value = type;
  shouldUpdate = true;
}

function setColorDensity(density){
  fractalMesh.material.uniforms.color_density.value = density;
  shouldUpdate = true;
}

function setColorOffset(offset){
  fractalMesh.material.uniforms.color_offset.value = offset;
  shouldUpdate = true;
}

function setOrbitTrapX(x){
  fractalMesh.material.uniforms.orbit_trap_point.value.x = x;
  shouldUpdate = true;
}

function setOrbitTrapY(y){
  fractalMesh.material.uniforms.orbit_trap_point.value.y = y;
  shouldUpdate = true;
}

function setOrbitTrapA(a){
  fractalMesh.material.uniforms.orbit_trap_line_a.value = a;
  shouldUpdate = true;
}

function setOrbitTrapB(b){
  fractalMesh.material.uniforms.orbit_trap_line_b.value = b;
  shouldUpdate = true;
}

function setOrbitTrapC(c){
  fractalMesh.material.uniforms.orbit_trap_line_c.value = c;
  shouldUpdate = true;
}


function setJuliaReal(value){
  if(!isNaN(value))
    fractalMesh.material.uniforms.julia_real.value = value;
  shouldUpdate = true;
}

function setJuliaImag(value){
  if(!isNaN(value))
    fractalMesh.material.uniforms.julia_imag.value = value;
  shouldUpdate = true;
}

function setEscapeRadius(value){
  if(!isNaN(value))
    fractalMesh.material.uniforms.escape_radius_sq.value = value * value;
  shouldUpdate = true;
}

function setCenterReal(value){
  if(!isNaN(value))
    fractalMesh.material.uniforms.origin.value.x = value;
  shouldUpdate = true;
}

function setCenterImag(value){
  if(!isNaN(value))
    fractalMesh.material.uniforms.origin.value.y = value;
  shouldUpdate = true;
}

function setZoom(value){
  if(!isNaN(value))
    fractalMesh.material.uniforms.zoom.value = value;
  shouldUpdate = true;
}

function updateFieldInput(id, value){
  document.getElementById(id).value = value;
}

function downloadFractalImage(){
  var data = renderer.domElement.toDataURL();
  renderer.domElement.toBlob(function(blob) {
    saveAs(blob, "mandelbrot.png");
  });

}


function init(){
  scene = new THREE.Scene();

  canvasWidth = Math.floor(getBrowserWidth() * window.devicePixelRatio);
  canvasHeight = Math.floor(getBrowserHeight() * window.devicePixelRatio);
  aspectRatio = canvasWidth / canvasHeight;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

  //position camera
  var dist = 1.0 / Math.tan(Math.PI * camera.fov / 360);
  camera.position.z =  dist;


  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true
  });

  renderer.setSize(canvasWidth, canvasHeight);
  scene.background = new THREE.Color(0x0f0f0f);

  renderer.domElement.style="position:absolute; top:0px; left:0px; margin:0px; width: 100%; height: 100%;"
  document.getElementById('bellow_help').appendChild(renderer.domElement);
}
