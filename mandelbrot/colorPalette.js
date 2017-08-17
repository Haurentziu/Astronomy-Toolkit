var rgbCanvases = [], contexts = [];
var FUNCTION_COLOR = "#a8a8a8";
var POINT_RADIUS = 4;

function ColorPalette(canvasInterpolator, redInterpolator, greenInterpolator, blueInterpolator, id){
  this.redInterpolator = redInterpolator;
  this.greenInterpolator = greenInterpolator;
  this.blueInterpolator =  blueInterpolator;
  this.canvasInterpolator = canvasInterpolator;
  this.canvas = document.getElementById(id);
  this.canvas.addEventListener("mousedown", this.mouseDownListener.bind(this));
  this.canvas.addEventListener("mousemove", this.mouseMoveListener.bind(this));
  this.canvas.addEventListener("mouseup", this.mouseUpListener.bind(this));

  this.ctx = this.canvas.getContext("2d");
  this.id = id;

  this.isMouseDown = false;
  this.selectedPoint = 0;
}

ColorPalette.prototype.mouseDownListener = function(e){
  this.isMouseDown = true;
  var dataX = this.canvasInterpolator.getDataX();
  var dataY = this.canvasInterpolator.getDataY();
  var point = getCursorPosition(this.canvas, e);

  for(var i = 0; i < dataX.length; i++){
    var deltaX = dataX[i] * this.canvas.width - point.x;
    var deltaY = dataY[i] * this.canvas.height - point.y;
    if(deltaX * deltaX + deltaY * deltaY < 100){
      this.selectedPoint = i;
      break;
    }
  }
}

ColorPalette.prototype.mouseUpListener = function(e){
  this.isMouseDown = false;
}


ColorPalette.prototype.mouseMoveListener = function(e){
  //console.log(this.isMouseDown);
  if(this.isMouseDown){
    var dataX = this.canvasInterpolator.getDataX();
    var dataY = this.canvasInterpolator.getDataY();
    var point = getCursorPosition(this.canvas, e);

    this.canvasInterpolator.updatePoint(this.selectedPoint, point.x / this.canvas.width, point.y / this.canvas.height);
    updatePaletts(); //from mandelbrot.js
  }
}

function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return {x: x, y:y}
}



ColorPalette.prototype.draw = function(){
  this.drawGradient();
  this.drawFunction();
  this.drawPoints();
}

function float2rgb(f){
  return Math.floor(255.0 * f);
}


ColorPalette.prototype.drawPoints = function(){
  var dataX = this.canvasInterpolator.getDataX();
  var dataY = this.canvasInterpolator.getDataY();
  this.ctx.fillStyle = FUNCTION_COLOR;
  for(var i = 0; i < dataX.length ; i++){
    this.ctx.beginPath();
    this.ctx.arc(dataX[i] * this.canvas.width, dataY[i] * this.canvas.height, POINT_RADIUS, 0, 2*Math.PI);
    this.ctx.fill();
  }
}

ColorPalette.prototype.drawFunction = function(){
  this.ctx.beginPath();
  this.ctx.strokeStyle = FUNCTION_COLOR;
  for(var i = 0; i < this.canvas.width; i += this.canvas.width / 100.0){
    var x = i / this.canvas.width;
    var y = this.canvasInterpolator.linearInterpolation(x) * this.canvas.height;

    if(i == 0){
      this.ctx.moveTo(i, y);
    }
    else{
      this.ctx.lineTo(i, y);
    }
  }
  this.ctx.stroke();
}

ColorPalette.prototype.drawGradient = function(){
  for(var i = 0; i < this.canvas.width - 1; i++){
    var x = i / this.canvas.width;

    var red = this.redInterpolator.linearInterpolation(x);
    var green = this.greenInterpolator.linearInterpolation(x);
    var blue = this.blueInterpolator.linearInterpolation(x);

    this.ctx.fillStyle = "rgb( " + float2rgb(red) + ", " + float2rgb(green) + "," + float2rgb(blue) + ")";
    this.ctx.fillRect(i, 0, i + 1, this.canvas.height);
  }
}
