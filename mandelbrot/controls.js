var initX, initY;
var isMouseDown = false;
var selectorCanvas, selectorCanvasCtx;
var rectangleSelect = false;

function addListeners(renderer){
  selectorCanvas = document.getElementById("selector_canvas");
  selectorCanvasCtx = selectorCanvas.getContext("2d");

  selectorCanvasCtx.stokeStyle = "white";
  selectorCanvasCtx.lineWidth="10";
  selectorCanvasCtx.rect(0, 0, selectorCanvas.width, selectorCanvas.height);
  selectorCanvasCtx.stroke();

  selectorCanvas.addEventListener("wheel", wheelListener, false);
  selectorCanvas.addEventListener("mousedown", mouseDownListener, false);
  selectorCanvas.addEventListener("mousemove", mouseMoveListener, false);
  selectorCanvas.addEventListener("mouseup", mouseUpListener, false);
  document.addEventListener("keydown", keyListener, false);

}

function keyListener(e){
  var code = e.keyCode ? e.keyCode : e.which;
  if(code == 27){
    fractalMesh.material.uniforms.origin.value.x = 0;
    fractalMesh.material.uniforms.origin.value.y = 0;
    fractalMesh.material.uniforms.zoom.value = 1;

    updateFieldInput("zoom_input", fractalMesh.material.uniforms.zoom.value);
    updateFieldInput("center_re_input", fractalMesh.material.uniforms.origin.value.x);
    updateFieldInput("center_img_input", fractalMesh.material.uniforms.origin.value.y);
    shouldUpdate = true;

  }
}


function wheelListener(e){
  if(!rectangleSelect){
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
}

function mouseDownListener(e){
  isMouseDown = true;
  initX = e.clientX;
  initY = e.clientY;
}

function mouseUpListener(e){
  isMouseDown = false;
  if(rectangleSelect){
    clearSelectorCanvas();
    var dpr = window.devicePixelRatio;

    fractalMesh.material.uniforms.origin.value.x += (dpr * (initX + e.clientX) - canvasWidth) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);
    fractalMesh.material.uniforms.origin.value.y -= (dpr * (initY + e.clientY) - canvasHeight) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);;
    fractalMesh.material.uniforms.zoom.value *= canvasHeight / (dpr * Math.abs(e.clientX - initX));

    updateFieldInput("zoom_input", fractalMesh.material.uniforms.zoom.value);
    updateFieldInput("center_re_input", fractalMesh.material.uniforms.origin.value.x);
    updateFieldInput("center_img_input", fractalMesh.material.uniforms.origin.value.y);
    shouldUpdate = true;
  }
}

function mouseMoveListener(e){
  var dpr = window.devicePixelRatio;
  //console.log((2.0 * dpr * e.clientX / (fractalMesh.material.uniforms.zoom.value * canvasHeight) - 1.0 * aspectRatio) + " " + (-2.0 * dpr * e.clientY / (fractalMesh.material.uniforms.zoom.value * canvasHeight) + 1.0))
  if(isMouseDown){
    //console.log((e.clientX - initX) / fractalMesh.material.uniforms.zoom.value);
    if(rectangleSelect){
      var dpr = window.devicePixelRatio;
      clearSelectorCanvas();
      var x = dpr * Math.min(initX, e.clientX);
      var y = dpr * Math.min(initY, e.clientY);
      var width =  dpr * Math.abs(e.clientX - initX);
      var height = dpr * Math.abs(e.clientY - initY);

      selectorCanvasCtx.beginPath();
      selectorCanvasCtx.lineStyle = "3px";
      selectorCanvasCtx.strokeStyle = "#ffffff";
      selectorCanvasCtx.rect(x, y, width, height);
      selectorCanvasCtx.stroke();
    }
    else{
      fractalMesh.material.uniforms.origin.value.x -= 2.0 * dpr * (e.clientX - initX) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);
      fractalMesh.material.uniforms.origin.value.y += 2.0 * dpr * (e.clientY - initY) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);
      initX = e.clientX;
      initY = e.clientY;
      updateFieldInput("center_re_input", fractalMesh.material.uniforms.origin.value.x);
      updateFieldInput("center_img_input", fractalMesh.material.uniforms.origin.value.y);
      decreasePixelRatio();
    }
  }
}

function clearSelectorCanvas(){
  selectorCanvasCtx.clearRect(0, 0, selectorCanvas.width, selectorCanvas.height);
}

function setRectangleSelect(value){
  rectangleSelect = value;
}
