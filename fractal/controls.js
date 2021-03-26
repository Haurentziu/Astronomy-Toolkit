var initX, initY;
var isMouseDown = false;
var selectorCanvas, selectorCanvasCtx;
var rectangleSelect = false;
var isRotating = false;
var origAngle = 0;

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
  document.addEventListener("keydown", keyDownListener, false);
  document.addEventListener("keyup", keyUpListener, false);

}

function keyDownListener(e){
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
  else if (code == 17){
    isRotating = true;
    origAngle = fractalMesh.material.uniforms.rot_angle.value;
  }
}

function keyUpListener(e){
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 17){
    isRotating = false;
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
      fractalMesh.material.uniforms.zoom.value *= 1.08;
    }
    else{
      fractalMesh.material.uniforms.zoom.value /= 1.08;
    }

    var newZoom = fractalMesh.material.uniforms.zoom.value;

    rot_angle = fractalMesh.material.uniforms.rot_angle.value;
    deltaX = -threeX / newZoom + threeX / oldZoom
    deltaY = -threeY / newZoom + threeY / oldZoom
    fractalMesh.material.uniforms.origin.value.x += Math.cos(rot_angle) * deltaX + Math.sin(rot_angle) * deltaY;
    fractalMesh.material.uniforms.origin.value.y += -Math.sin(rot_angle) * deltaX + Math.cos(rot_angle) * deltaY;

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

    rot_angle = fractalMesh.material.uniforms.rot_angle.value;
    deltaX = (dpr * (initX + e.clientX) - canvasWidth) / (fractalMesh.material.uniforms.zoom.value * canvasHeight)
    deltaY = -(dpr * (initY + e.clientY) - canvasHeight) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);
    fractalMesh.material.uniforms.origin.value.x += Math.cos(rot_angle) * deltaX + Math.sin(rot_angle) * deltaY;
    fractalMesh.material.uniforms.origin.value.y += -Math.sin(rot_angle) * deltaX + Math.cos(rot_angle) * deltaY;

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
    else if(!isRotating){
      //fractalMesh.material.uniforms.origin.value.x -= 2.0 * dpr * (e.clientX - initX) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);
      //fractalMesh.material.uniforms.origin.value.y += 2.0 * dpr * (e.clientY - initY) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);

      deltaX = -2.0 * dpr * (e.clientX - initX) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);
      deltaY = 2.0 * dpr * (e.clientY - initY) / (fractalMesh.material.uniforms.zoom.value * canvasHeight);

      rot_angle = fractalMesh.material.uniforms.rot_angle.value;
      fractalMesh.material.uniforms.origin.value.x += Math.cos(rot_angle) * deltaX + Math.sin(rot_angle) * deltaY;
      fractalMesh.material.uniforms.origin.value.y += -Math.sin(rot_angle) * deltaX + Math.cos(rot_angle) * deltaY;

      initX = e.clientX;
      initY = e.clientY;
      updateFieldInput("center_re_input", fractalMesh.material.uniforms.origin.value.x);
      updateFieldInput("center_img_input", fractalMesh.material.uniforms.origin.value.y);
      decreasePixelRatio();
    }
    else if(isRotating){
      //fractalMesh.material.uniforms.rot_angle.value += Math.PI * (e.clientY - initY) / canvasHeight;

      angle0 = Math.atan2(initY - canvasHeight / 2.0, initX - canvasWidth / 2.0)
      //angle0 = Math.PI;
      fractalMesh.material.uniforms.rot_angle.value +=  angle0 - Math.atan2((e.clientY - canvasHeight / 2.0), (e.clientX - canvasWidth / 2.0)  )
      if(fractalMesh.material.uniforms.rot_angle.value > Math.PI) fractalMesh.material.uniforms.rot_angle.value -= 2 * Math.PI;
      else if(fractalMesh.material.uniforms.rot_angle.value < - Math.PI) fractalMesh.material.uniforms.rot_angle.value += 2 * Math.PI;


      initX = e.clientX;
      initY = e.clientY;

      updateFieldInput("rot_input_txt", 180.0 * fractalMesh.material.uniforms.rot_angle.value / Math.PI);
      updateFieldInput("rot_input_range", 180.0 * fractalMesh.material.uniforms.rot_angle.value / Math.PI);

      //shouldUpdate = true;
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
