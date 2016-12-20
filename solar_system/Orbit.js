var Orbit = function(celestialBody, color){
  this.mesh = createOrbitGeometry(celestialBody, color);
}

function createOrbitGeometry(celestialBody, color){
  var geometry = new THREE.Geometry();
  var material = new THREE.LineBasicMaterial({ color: color, transparent: true });

  var segmentCount = Math.ceil(2 * Math.PI * celestialBody.semiMajorAxis * 30);
  for(var i = 0; i <= segmentCount; i++){
    var angle = 2 * i * Math.PI / segmentCount;
    var position = celestialBody.getCartesianCoordinates(angle);
    var vector  = new THREE.Vector3(position.x, position.y , position.z);
    geometry.vertices.push(vector);
  }
  var mesh = new THREE.Line(geometry, material);
  return mesh;
}
