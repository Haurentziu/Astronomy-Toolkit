var initX, initY;
var isMouseDown = false;

function addListeners(renderer){
  renderer.domElement.addEventListener("wheel", wheelListener);
  renderer.domElement.addEventListener("mousedown", mouseDownListener);
  renderer.domElement.addEventListener("mousemove", mouseMoveListener);
  renderer.domElement.addEventListener("mouseup", mouseUpListener);

}

function wheelListener(e){
  if(e.deltaY < 0){
    fractalMesh.material.uniforms.zoom.value *= 1.05;
  }
  else{
    fractalMesh.material.uniforms.zoom.value /= 1.05;
  }
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
  if(isMouseDown){
    //console.log((e.clientX - initX) / fractalMesh.material.uniforms.zoom.value);
    fractalMesh.material.uniforms.origin.value.x -= 2.0 * (e.clientX - initX) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);
    fractalMesh.material.uniforms.origin.value.y += 2.0 * (e.clientY - initY) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);
    initX = e.clientX;
    initY = e.clientY;
    decreasePixelRatio();
  }
}
