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
//var epoch = 0;
paused = true;

var planetRadius = 0.07;

var selectedBody = -1; //-1 is the sun

var debugMode = true;

// new CelestialBody(semiMajorAxis, eccentricty, inclination, longitudeOfNode, argOfPericenter, meanAnomaly2000)

//TODO change mean anomaly values!
var planets = [
  new CelestialBody("Mercury",      0.3870, 0.205635, deg2rad(7.0050), deg2rad(48.331300), deg2rad(77.456450), deg2rad(174.794787)),
  new CelestialBody("Venus",        0.7230, 0.006773, deg2rad(3.3947), deg2rad(76.679900), deg2rad(131.53298), deg2rad(50.4160980)),
  new CelestialBody("Earth",        1.0000, 0.016700, deg2rad(0.0000), deg2rad(-11.26064), deg2rad(102.94719), deg2rad(357.529109)),
  new CelestialBody("Mars",         1.5240, 0.093405, deg2rad(1.8510), deg2rad(49.557400), deg2rad(336.04084), deg2rad(19.3727660)),
  new CelestialBody("Juno",         2.6700, 0.254981, deg2rad(12.982), deg2rad(169.91138), deg2rad(58.204242), deg2rad(240.155636)),
  new CelestialBody("Ceres",        2.7653, 0.079138, deg2rad(10.586), deg2rad(80.393200), deg2rad(151.84910), deg2rad(6.06964272)),
  new CelestialBody("Pallas",       2.7721, 0.230999, deg2rad(34.840), deg2rad(173.12950), deg2rad(123.46330), deg2rad(352.853564)),
  new CelestialBody("67P",          3.4648, 0.641436, deg2rad(7.0458), deg2rad(50.084660), deg2rad(62.926768), deg2rad(216.153893)),
  new CelestialBody("Jupiter",      5.2030, 0.048498, deg2rad(1.3050), deg2rad(100.45420), deg2rad(14.753850), deg2rad(20.0203120)),
  new CelestialBody("Saturn",       9.5230, 0.055546, deg2rad(2.4840), deg2rad(113.66340), deg2rad(92.431940), deg2rad(317.020207)),
  new CelestialBody("1P/Halley",    17.834, 0.967142, deg2rad(162.26), deg2rad(58.420080), deg2rad(169.75256), deg2rad(65.8423700)),
  new CelestialBody("Uranus",       19.208, 0.047318, deg2rad(0.7700), deg2rad(74.000500), deg2rad(170.96424), deg2rad(141.049714)),
  new CelestialBody("Neptune",      30.087, 0.008606, deg2rad(1.7690), deg2rad(131.78060), deg2rad(44.971350), deg2rad(256.228389)),
  new CelestialBody("Pluto",        39.746, 0.250000, deg2rad(17.142), deg2rad(110.30340), deg2rad(224.43738), deg2rad(14.0921741)),
// new CelestialBody("Uaie",         99.999, 0.989999, deg2rad(45.000), deg2rad(180.00000), deg2rad(0.0000000), deg2rad(14.0921741)),
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

var textures = [
  "./res/textures/mercurymap.jpg",
  "./res/textures/venusmap.jpg",
  "./res/textures/earthmap1k.jpg",
  "./res/textures/mars_1k_color.jpg",
  null,
  null,
  null,
  null,
  "./res/textures/jupitermap.jpg",
  "./res/textures/saturnmap.jpg",
  null,
  "./res/textures/uranusmap.jpg",
  "./res/textures/neptunemap.jpg",
  "./res/textures/plutomap1k.jpg",

]

var bumps = [
  "./res/textures/mercurybump.jpg",
  "./res/textures/venusbump.jpg",
  "./res/textures/earthbump1k.jpg",
  "./res/textures/marsbump1k.jpg",
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  "./res/textures/plutobump1k.jpg",

]

var skyboxTextures = [
  "./res/flare.png",
  "./res/uaie.png",
  "./res/uaie.png",
  "./res/uaie.png",
  "./res/uaie.png",
  "./res/uaie.png",
]

var planetSprites = [];
var planetMeshes = [];
var planet_labels = [];
var skyboxMesh;
var sunLight;


window.onload = function(){
  debugMode = getParameters('debug') === 'true';
  console.log(debugMode)

  init();
//  createSkybox();
  createOrbits();
  createPlanetSprites();
  createPlanetLabels();
  if(debugMode)
    createPlanetMeshes();


  sunLight = new THREE.PointLight( 0xffffff, 1, 0);
  sunLight.position.set( 0, 0, 0 );
  sunLight.shadowCameraVisible = true;
  scene.add( sunLight );

  updatePlanets();

/*  addSphere(0.05, 0xffd234);*/
  var flareTexture = THREE.ImageUtils.loadTexture("./res/flare.png");
  var flareMaterial = new THREE.SpriteMaterial({map: flareTexture, blending:THREE.AdditiveBlending, useScreenCoordinates: false, color: 0xffffff});
  var flareSprite = new THREE.Sprite(flareMaterial);
  flareSprite.scale.set(0.8, 0.8, 0.8);
  flareSprite.position.set(0, 0, 0);
  scene.add(flareSprite);

  render();

  document.getElementById('warp').innerHTML = timeWarp;
}

function render(){
  fps++;
  updatePlanets();

  if(selectedBody != -1){
    controls.target = planetMeshes[selectedBody].position;
  }

  var now = new Date().getTime();
  var sinceLastFrame = now - lastTime;

  if(!paused){
    epoch += sinceLastFrame / (100 * 1000 * SECONDS_IN_YEAR) * timeWarp;
  }

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


function createOrbits(){
  for(var i = 0; i < planets.length; i++){
    addCircleGeometry(planets[i], colors[i]);
  }
}

function createPlanetSprites(){
  var planetSprite = THREE.ImageUtils.loadTexture("./res/planet.png");
  for(var i = 0; i < planets.length; i++){
    var material = new THREE.SpriteMaterial( { map: planetSprite, useScreenCoordinates: false, color: 0xffffff } );
  	var sprite = new THREE.Sprite(material);
  	sprite.scale.set(0.2, 0.2, 0.2); // imageWidth, imageHeight
  	scene.add(sprite);
    planetSprites.push(sprite);
  }
}

function createPlanetMeshes(){
  for(var i = 0; i < planets.length; i++){
    var geometry = new THREE.SphereGeometry(0.05, 50, 50);
    if(textures[i] != null && bumps[i] != null){
      var texture = THREE.ImageUtils.loadTexture(textures[i]);
      var bump = THREE.ImageUtils.loadTexture(bumps[i]);
      var material = new THREE.MeshPhongMaterial({map: texture, bumpMap: bump, bumpScale: 0.0002});
    }
    else if(textures[i] != null){
      var texture = THREE.ImageUtils.loadTexture(textures[i]);
      var material = new THREE.MeshPhongMaterial({map: texture});
    }
    else{
      var material = new THREE.MeshPhongMaterial({color: 0x808080});
    }
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    planetMeshes.push(mesh)
  }
}

function createPlanetLabels(){
  for(var i = 0; i < planets.length; i++){
    var sprite = createTextSprite(planets[i].name);
    scene.add(sprite);
    planet_labels.push(sprite);
  }
}

function updatePlanets(){
  for(var i = 0; i < planets.length; i++){
    position = planets[i].getPositionAtEpoch(epoch);

    var scale =  2 * Math.tan( camera.fov * Math.PI / 360.0 ) * getDistance(position, camera.position) / window.innerHeight;

    var circleScale = 20 * scale;
    var labelScale = 200 * scale;

    planetSprites[i].position.set(position.x, position.y, position.z);
    planetSprites[i].scale.set(circleScale, circleScale, circleScale);

    if(debugMode)
      planetMeshes[i].position.set(position.x, position.y, position.z);

    planet_labels[i].scale.set(labelScale, labelScale, labelScale);
    planet_labels[i].position.set(position.x, position.y, position.z);
  }
}


function updateSkybox(){
  skyboxMesh.position.set(camera.position.x, camera.position.y, camera.position.z);
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
    var angle = 2 * i * Math.PI / segmentCount;
    var position = planet.getCartesianCoordinates(angle);
    var vector  = new THREE.Vector3(position.x, position.y , position.z);
    geometry.vertices.push(vector);
  }
  scene.add(new THREE.Line(geometry, material));
}

function deg2rad(angle){
  return angle * Math.PI / 180.00;
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

function createSkybox(){
  var cubeTexture = THREE.ImageUtils.loadTextureCube(skyboxTextures);
  var shader = THREE.ShaderLib["cube"];
  var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

  uniforms["tCube"].value = cubeTexture;

  var material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader:   shader.vertexShader,
    uniforms:       uniforms,
    depthWrite : false,
    side: THREE.BackSide,
  });

  skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(1000, 1000, 1000, 1, 1, 1, null, true), material);
  scene.add(skyboxMesh);
}

function createTextSprite(text){
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "#bebebe";

  ctx.font = "Bold 16px Arial";

  var fontMetrics = ctx.measureText(text);

  ctx.fillText(text, canvas.width / 2 + 25, canvas.height / 2 + 15.0 / 2.0);

  var texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  var material = new THREE.SpriteMaterial({map :texture});
  var sprite = new THREE.Sprite(material);
  sprite.scale.set(1, 1, 1);
  return sprite;
}


window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    //alert(code);
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
    else if(code === 49){
      selectedBody = 0;
    }
    else if(code === 50){
      selectedBody = 1;
    }
    else if(code === 51){
      selectedBody = 2;
    }
    else if(code === 52){
      selectedBody = 3;
    }
    else if(code === 53){
      selectedBody = 8;
    }
    else if(code === 54){
      selectedBody = 9;
    }
    else if(code === 55){
      selectedBody = 11;
    }
    else if(code === 56){
      selectedBody = 12;
    }
    else if(code === 57){
      selectedBody = 13;
    }
    else if(code === 48){
      controls.target = new THREE.Vector3(0, 0, 0);
      selectedBody = -1;
    }

};


window.onresize = function(e){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function getParameters(name) {
    url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}


function init(){
  scene = new THREE.Scene();
  aspect_ratio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect_ratio, 0.1, 1000000);
  //camera = new THREE.OrthographicCamera(75, aspect_ratio, 0.1, 1000);
  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer = new THREE.WebGLRenderer({antialias:true});

  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.background = new THREE.Color(0x111111);

  renderer.domElement.style="position:absolute; top:0px; left:0px; margin:0px; "
  document.body.appendChild(renderer.domElement);
  camera.position.z = 2;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.noPan = true;
  controls.enableDamping = true;
  controls.minAzimuthAngle = -Math.PI / 2.0;
  controls.maxAzimuthAngle = Math.PI/2.0;
  controls.minDistance = 0.1;
  controls.maxDistance = 60;


}
