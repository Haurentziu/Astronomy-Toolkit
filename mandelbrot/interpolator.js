function Interpolator(dataX, dataY){
  this.dataX = dataX;
  this.dataY = dataY;
  this.slopes = computeSlopes(dataX, dataY);
}

function computeSlopes(dataX, dataY){
  var slopes = [];
  for(var i = 0; i < dataX.length - 1; i++){
    slopes[i] = (dataY[i + 1] - dataY[i]) / (dataX[i + 1] - dataX[i]);
  }
  return slopes;
}

Interpolator.prototype.getDataX = function(){
  return this.dataX;
}

Interpolator.prototype.getDataY = function(){
  return this.dataY;
}

Interpolator.prototype.getSlopes = function(){
  return this.slopes;
}

Interpolator.prototype.updatePoint = function(i, x, y){
  this.dataX[i] = x;
  this.dataY[i] = y;
  this.slopes = computeSlopes(this.dataX, this.dataY);
}

Interpolator.prototype.getValueArrayLinear = function(n){
  var values = []
  for(var i = 0; i < 1.0; i += 1.0 / n){
    values[i] = this.linearInterpolation(i);
  }
  return values;
}

Interpolator.prototype.linearInterpolation = function(x){
  var intervalNo = 0;
  for(var i = 0; i < this.dataX.length - 1; i++){
    if(this.dataX[i] < x && x < this.dataX[i + 1]){
      intervalNo = i;
      break;
    }
  }

  var y = this.slopes[intervalNo] * (x - this.dataX[intervalNo]) + this.dataY[intervalNo];
  return y;
}
