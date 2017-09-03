function Interpolator(dataX, dataY){
  this.dataX = dataX;
  this.dataY = dataY;
  this.slopes = computeSlopes(dataX, dataY);
  //this.slopes = computeSecants(dataX, dataY);
}

function computeSlopes(dataX, dataY){
  var secants = computeSecants(dataX, dataY);
  var slopes = []

  for(var i = 1; i < secants.length; i++)
    slopes[i] = (secants[i - 1] + secants[i]) / 2.0;
  slopes[0] = secants[0];
  slopes[secants.length] = secants[secants.length - 1];

  slopes = preserveMonotonicity(slopes, secants);
  return slopes;
}

function computeSecants(dataX, dataY){
  var secants = [];
  for(var i = 0; i < dataX.length - 1; i++){
    secants[i] = (dataY[i + 1] - dataY[i]) / (dataX[i + 1] - dataX[i]);
  }
  return secants;
}

function preserveMonotonicity(slopes, secants){
  for(var i = 0; i < slopes.length; i++){
    if(secants[i] == 0){
      slopes[i] = 0;
      slopes[i + 1] = 0;
    }

    else{
      var a = slopes[i]/secants[i];
      var b = slopes[i + 1]/secants[i];
      var k = Math.hypot(a, b);
      if(k > .25){
        var t = 0.5/k;
        slopes[i] = t * a * secants[i];
        slopes[i + 1] = t * b * secants[i];
      }
    }
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

function getIntervalNumber(x, dataX){
  for(var i = 0; i < dataX.length - 1; i++){
    if(dataX[i] <= x && x < dataX[i + 1]){
      intervalNo = i;
      break;
    }
  }

  return intervalNo
}

Interpolator.prototype.akimaInterpolation = function(x){
  var i = getIntervalNumber(x, this.dataX);
  var h = (this.dataX[i + 1] - this.dataX[i]);
  var k = (x - this.dataX[i])/h;
  var k3 = k*k*k, k2 = k*k;

  var value = (2 * k3 - 3 * k2 + 1) * this.dataY[i];
  value += (k3 - 2 * k2 + k) * this.slopes[i] * h;
  value += (-2 * k3 + 3*  k2) * this.dataY[i + 1];
  value += (k3 - k2) * this.slopes[i + 1] * h * this.slopes[i + 1];

  return value;
}

Interpolator.prototype.linearInterpolation = function(x){
  var intervalNo = getIntervalNumber(x, this.dataX);

  var y = this.slopes[intervalNo] * (x - this.dataX[intervalNo]) + this.dataY[intervalNo];
  return y;
}
