var initX, initY;
var isMouseDown = false;

function addListeners(renderer){
  renderer.domElement.addEventListener("wheel", wheelListener, false);
  renderer.domElement.addEventListener("mousedown", mouseDownListener, false);
  renderer.domElement.addEventListener("mousemove", mouseMoveListener, false);
  renderer.domElement.addEventListener("mouseup", mouseUpListener, false);

}

function wheelListener(e){
  var x = e.clientX;
  var y = e.clientY;
  var dpr = window.devicePixelRatio;
  var oldZoom = fractalMesh.material.uniforms.zoom.value;

  var threeX = aspectRatio * (2.0 * dpr * x / canvasWidth - 1.0);
  var threeY = (1.0 - 2.0 * dpr *  y / canvasHeight);

  if(e.deltaY < 0){
    fractalMesh.material.uniforms.zoom.value *= 1.05;
  }
  else{
    fractalMesh.material.uniforms.zoom.value /= 1.05;
  }

  var newZoom = fractalMesh.material.uniforms.zoom.value;
  fractalMesh.material.uniforms.origin.value.x -= threeX / newZoom - threeX / oldZoom;
  fractalMesh.material.uniforms.origin.value.y -= threeY / newZoom - threeY / oldZoom;
  updateFieldInput("zoom_input", fractalMesh.material.uniforms.zoom.value);
  updateFieldInput("center_re_input", fractalMesh.material.uniforms.origin.value.x);
  updateFieldInput("center_img_input", fractalMesh.material.uniforms.origin.value.y);
  decreasePixelRatio();

}

function mouseDownListener(e){
  isMouseDown = true;
  initX = e.clientX;
  initY = e.clientY;
}

function mouseUpListener(e){
  isMouseDown = false;
}

function mouseMoveListener(e){
  var dpr = window.devicePixelRatio;

  if(isMouseDown){
    //console.log((e.clientX - initX) / fractalMesh.material.uniforms.zoom.value);
    fractalMesh.material.uniforms.origin.value.x -= 2.0 * dpr * (e.clientX - initX) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);
    fractalMesh.material.uniforms.origin.value.y += 2.0 * dpr * (e.clientY - initY) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);
    initX = e.clientX;
    initY = e.clientY;
    updateFieldInput("center_re_input", fractalMesh.material.uniforms.origin.value.x);
    updateFieldInput("center_img_input", fractalMesh.material.uniforms.origin.value.y);
    decreasePixelRatio();
  }
}
