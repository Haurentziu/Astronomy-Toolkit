var center = {x: 0, y: 0, z: 0};
var segmentCountPerAU = 20;
var lastPosition = {x:0, y:0};
var lastTime = Date.now();
var deltaT = 0;
var fps;
var paused = false;
var timeWarp = 1000000;

var scene, aspect_ratio, camera, renderer, controls;

var UNIX_TIME_J2000 = 946684800;
var SECONDS_IN_YEAR = 365.25 * 24 * 60 * 60;

var epoch = unixToEpoch(Date.now() / 1000.0);


var planetRadius = 0.07;

// new CelestialBody(semiMajorAxis, eccentricty, inclination, longitudeOfNode, argOfPericenter, meanAnomaly2000)

//TODO change mean anomaly values!
var planets = [
  new CelestialBody("Mercury",      0.3870, 0.205635, deg2rad(7.0050), deg2rad(48.331300), deg2rad(77.456450), deg2rad(252.25084)),
  new CelestialBody("Venus",        0.7230, 0.006773, deg2rad(3.3947), deg2rad(76.679900), deg2rad(131.53298), deg2rad(181.97973)),
  new CelestialBody("Earth",        1.0000, 0.016700, deg2rad(0.0000), deg2rad(-11.26064), deg2rad(102.94719), deg2rad(100.46435)),
  new CelestialBody("Mars",         1.5240, 0.093405, deg2rad(1.8510), deg2rad(49.557400), deg2rad(336.04084), deg2rad(355.45332)),
  new CelestialBody("Juno",         2.6700, 0.254981, deg2rad(12.982), deg2rad(169.91138), deg2rad(248.10807), deg2rad(32.096083)),
  new CelestialBody("Ceres",        2.7653, 0.079138, deg2rad(10.586), deg2rad(80.393200), deg2rad(72.589810), deg2rad(113.41044)),
  new CelestialBody("Pallas",       2.7721, 0.230999, deg2rad(34.840), deg2rad(173.12950), deg2rad(310.15094), deg2rad(96.148266)),
  new CelestialBody("67P",          3.4648, 0.641436, deg2rad(7.0458), deg2rad(50.084660), deg2rad(12.842101), deg2rad(52.690003)),
  new CelestialBody("Jupiter",      5.2030, 0.048498, deg2rad(1.3050), deg2rad(100.45420), deg2rad(14.753850), deg2rad(34.404380)),
  new CelestialBody("Saturn",       9.5230, 0.055546, deg2rad(2.4840), deg2rad(113.66340), deg2rad(92.431940), deg2rad(49.944320)),
  new CelestialBody("1P/Halley",    17.834, 0.967142, deg2rad(162.26), deg2rad(58.420080), deg2rad(111.33248), deg2rad(38.384264)),
  new CelestialBody("Uranus",       19.208, 0.047318, deg2rad(0.7700), deg2rad(74.000500), deg2rad(170.96424), deg2rad(313.23218)),
  new CelestialBody("Neptune",      30.087, 0.008606, deg2rad(1.7690), deg2rad(131.78060), deg2rad(44.971350), deg2rad(304.88003)),
  new CelestialBody("Pluto",        39.746, 0.250000, deg2rad(17.142), deg2rad(110.30340), deg2rad(224.06676), deg2rad(238.92881)),
];

var colors = [
  0xa6e97d,  //Mercury
  0xf6f57b,  //Venus
  0x42A5F5,  //Earth
  0xfa7f95,  //Mars
  0x423232,  //Juno
  0xdbca72,  //Ceres
  0x49506e,   //Pallas
  0x488e72,   //67P
  0x9bf5ea,  //Jupiter
  0xf9d27e,  //Saturn
  0x599858,  //1P
  0x8e7bec,  //Uranus
  0xa34949,  //Neptune
  0x74b16d,  //Pluto
];


var planet_models = [];
var planet_labels = [];

window.onload = function(){
  init();
  createOrbits();
  createPlanets();
  createPlanetLabels();

  updatePlanets();

/*  addSphere(0.05, 0xffd234);*/
  var flareTexture = THREE.ImageUtils.loadTexture("http://mgvez.github.io/jsorrery/img/sunflare.png");
  var flareMaterial = new THREE.SpriteMaterial({map: flareTexture, blending:THREE.AdditiveBlending, useScreenCoordinates: false, color: 0xffffff});
  var flareSprite = new THREE.Sprite(flareMaterial);
  flareSprite.scale.set(0.6, 0.6, 0.6);
  flareSprite.position.set(0, 0, 0);
  scene.add(flareSprite);
  render();

  document.getElementById('warp').innerHTML = timeWarp;
}


function createOrbits(){
  for(var i = 0; i < planets.length; i++){
    addCircleGeometry(planets[i], colors[i]);
  }
}

function createPlanets(){
  var planetSprite = THREE.ImageUtils.loadTexture("./res/planet.png");
  for(var i = 0; i < planets.length; i++){
    var material = new THREE.SpriteMaterial( { map: planetSprite, useScreenCoordinates: false, color: 0xffffff } );
  	var sprite = new THREE.Sprite(material);
  	sprite.scale.set(0.2, 0.2, 0.2); // imageWidth, imageHeight
  	scene.add(sprite);
    planet_models.push(sprite);
  }
}

function createPlanetLabels(){
  for(var i = 0; i < planets.length; i++){
    sprite = createTextSprite(planets[i].name);
    scene.add(sprite);
    planet_labels.push(sprite);
  }
}

function updatePlanets(){
  for(var i = 0; i < planets.length; i++){
    position = planets[i].getPositionAtEpoch(epoch);
    var scale =   2 * Math.tan( camera.fov * Math.PI / 360 ) * getDistance(position, camera.position) / 50;

    planet_models[i].position.set(position.x, position.y, position.z);
    planet_models[i].scale.set(scale, scale, scale);


    planet_labels[i].scale.set(scale * 10 , scale * 10, scale * 10);
    planet_labels[i].position.set(position.x, position.y, position.z);
  }
}

function addSphere(radius, color){
  var geometry = new THREE.SphereGeometry(radius, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  var material = new THREE.MeshBasicMaterial({color: color});
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

function addCircleGeometry(planet, color){
  geometry = new THREE.Geometry();
  material = new THREE.LineBasicMaterial({ color: color });

  segmentCount = Math.ceil(2 * Math.PI * planet.semiMajorAxis * segmentCountPerAU);
  for(var i = 0; i <= segmentCount; i++){
    angle = 2 * i * Math.PI / segmentCount;
    position = planet.getCartesianCoordinates(angle);
    vector  = new THREE.Vector3(position.x, position.y , position.z);
    geometry.vertices.push(vector);
  }
  scene.add(new THREE.Line(geometry, material));
}

function deg2rad(angle){
  return angle * Math.PI / 180.00;
}

function render(){
  fps++;
  updatePlanets();
  now = new Date().getTime();
  sinceLastFrame = now - lastTime;

  if(!paused){
    epoch += sinceLastFrame / (100 * 1000 * SECONDS_IN_YEAR) * timeWarp;
  }
//  console.log(sinceLastFrame / (100 * 1000 * SECONDS_IN_YEAR) * timeWarp);
  document.getElementById('date').innerHTML=unixToString(epochToUnixTime(epoch));
  requestAnimationFrame(render);
  controls.update();

  deltaT += sinceLastFrame;
  lastTime = now;
  if(deltaT > 200){
    document.getElementById('fps').innerHTML=fps * 5;
    deltaT = 0;
    fps = 0;
  }

  renderer.render(scene, camera);
}

function getDistance(p1, p2){
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y) + (p1.z - p2.z) * (p1.z - p2.z));
}

function unixToEpoch(unixTime){
  return (unixTime - UNIX_TIME_J2000) / (100 * SECONDS_IN_YEAR);
}

function epochToUnixTime(epoch){
  return UNIX_TIME_J2000 + epoch * 100 * SECONDS_IN_YEAR;
}

function unixToString(unixTime){
  return new Date(unixTime * 1000).toString();
}

window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
  //  alert(code);
    if (code === 32) { //SPACE key
      paused = !paused;
    }
    else if(code === 39){ //RIGHT ARROW
      timeWarp *= 2;
      document.getElementById('warp').innerHTML = Math.floor(timeWarp);
    }
    else if(code === 37){  //LEFT ARROW
      timeWarp /= 2;
      document.getElementById('warp').innerHTML = Math.floor(timeWarp);
    }

};

window.onresize = function(e){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function createTextSprite(text){
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "#bebebe";
  ctx.font = "Bold 13px Arial";

  var fontMetrics = ctx.measureText(text);

  console.log(fontMetrics.height);
  ctx.fillText(text, canvas.width / 2 + 20, canvas.height / 2 + 15.0 / 2.0);

  var texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  var material = new THREE.SpriteMaterial({map :texture});
  var sprite = new THREE.Sprite(material);
  sprite.scale.set(1, 1, 1);
  return sprite;
}


function init(){
  scene = new THREE.Scene();
  aspect_ratio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect_ratio, 0.1, 1000);
  //camera = new THREE.OrthographicCamera(75, aspect_ratio, 0.1, 1000);
  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer = new THREE.WebGLRenderer({antialias:true});

  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.background = new THREE.Color(0x212121);

  renderer.domElement.style="position:absolute; top:0px; left:0px; margin:0px; "
  document.body.appendChild(renderer.domElement);
  camera.position.z = 5;

//  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 8;
  controls.zoomSpeed = 0.1;
  controls.dynamicDampingFactor = 0.25;
  controls.noPan = true;
  controls.staticMoving = false;
  //controls.enableZoom = false;
  controls.minDistance = 0.1;
  controls.maxDistance = 60;


}
