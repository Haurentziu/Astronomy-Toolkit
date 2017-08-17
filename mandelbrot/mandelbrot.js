var canvasWidth, canvasHeight;
var scene, aspect_ratio, camera, renderer, controls;
var fractalMesh;

var lastScale = 1;

var redX = [0.0, 0.20416666666666666, 0.45625, 0.6666666666666666, 0.7895833333333333, 1.0];
var redY = [0.03, 0.96, 0.99, 0.99, 0.21, 0.03];
/*var redY = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];*/

var greenX = [0.0, 0.20416666666666666, 0.45625, 0.6666666666666666, 0.7895833333333333, 1.0];
var greenY = [0.02, 0.13, 0.65, 0.99, 0.44, 0.02];

var blueX = [0.0, 0.19583333333333333, 0.43333333333333335, 0.6625, 0.7979166666666667, 1.0];
var blueY = [0.15, 0.02, 0.03, 0.01, 0.97, 0.15];
/*
var redInterpolator = new Interpolator(redX, redY);
var greenInterpolator = new Interpolator(greenX, greenY);
var blueInterpolator = new Interpolator(blueX, blueY);*/

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
  createFractal();
  resize();
  window.onresize = resize;

  render();

/*  redPalette = new ColorPalette(redInterpolator, redInterpolator, greenInterpolator, blueInterpolator, "red");
  greenPalette = new ColorPalette(greenInterpolator, redInterpolator, greenInterpolator, blueInterpolator, "green");
  bluePalette = new ColorPalette(blueInterpolator, redInterpolator, greenInterpolator, blueInterpolator, "blue");


  redPalette.draw();
  greenPalette.draw();
  bluePalette.draw();*/
}



function render(){
  stats.begin();
  if(!normalPixelRatio && Date.now() - lastEventUnix > 50){
    renderer.setPixelRatio(1.0);
    normalPixelRatio = true;
    shouldUpdate = true;
  }

  if(shouldUpdate){
    renderer.render(scene, camera);
    shouldUpdate = false;
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
  var array = []
  for(var i = 0 ; i < x.length; i++){
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

        /*  slopes_red: {type : 'uFloatArray', value: redInterpolator.getSlopes()},
          slopes_green: {type : 'uFloatArray', value: greenInterpolator.getSlopes()},
          slopes_blue: {type : 'uFloatArray', value: blueInterpolator.getSlopes()},

          palette_red: {type: 'v2v', value: floatArrayToVec2Array(redInterpolator.getDataX(), redInterpolator.getDataY())},
          palette_green: {type: 'v2v', value: floatArrayToVec2Array(greenInterpolator.getDataX(), greenInterpolator.getDataY())},
          palette_blue: {type: 'v2v', value: floatArrayToVec2Array(blueInterpolator.getDataX(), blueInterpolator.getDataY())},
*/
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
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.domElement.style.width = getBrowserWidth() + "px";
  renderer.domElement.style.height = getBrowserHeight() + "px";
  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
  shouldUpdate = true;

}

function decreasePixelRatio(){
  lastEventUnix = Date.now();
  renderer.setPixelRatio(0.30);
  normalPixelRatio = false;
  shouldUpdate = true;
}

function setColoring(coloring){
  fractalMesh.material.uniforms.coloring.value = coloring;
  shouldUpdate = true;
}

function setFractalType(coloring){
  fractalMesh.material.uniforms.fractal_type.value = coloring;
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
  document.getElementById('bellowAbout').appendChild(renderer.domElement);
}
