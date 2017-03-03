//for all the things that have to do with the solar system (planets, asteroids, comets, sun, moons)
var logPos = false;

var VSOP_TERM_LIMIT = 10E-5;

function normalise(angle){
    angle = angle - 2*Math.PI*Math.floor(angle/(2*Math.PI));
    return angle;
}

function moonPos(){
    var T = (JD-2451545)/36525;
    e = deg2rad(23.4392916666666667-0.0130041666666667*T-0.0000001666666667*T*T+0.0000005027777778*T*T*T);
    var L1 = normalisedeg(218.3164477 + 481267.88123421*T - 0.0015786*T*T + Math.pow(T, 3)/538841 - Math.pow(T, 4)/65194000);
    var D = normalisedeg(297.8501921 + 445267.1114034*T - 0.0018819*T*T + Math.pow(T, 3)/545868 - Math.pow(T, 4)/113065000);
    var M = normalisedeg(357.5291092 + 35999.0502909*T - 0.0001536*T*T + Math.pow(T, 3)/24490000);
    var M1 = normalisedeg(134.9633964 + 477198.8675055*T + 0.0087414*T*T + Math.pow(T, 3)/69699-Math.pow(T, 4)/14712000);
    var F = normalisedeg(93.272095 + 483202.0175233*T - 0.0036539*T*T - Math.pow(T, 3)/3526000 + Math.pow(T, 4)/863310000);
    var A1 = normalisedeg((119.75+131.849*T));
    var A2 = normalisedeg((53.09 + 479264.290*T));
    var A3 = normalisedeg((313.45 + 481266.484*T));
    var E = normalisedeg(1-0.002516*T - 0.0000074*T*T);
    var sigma = computeMoonPosition(D, M, M1, F, E);
    sigma.l+=3958*Math.sin(deg2rad(A1))+1962*Math.sin(deg2rad(L1-F))+318*Math.sin(deg2rad(A2));
    sigma.b+=-2235*Math.sin(deg2rad(L1))+382*Math.sin(deg2rad(A3))+175*Math.sin(deg2rad(A1-F))+175*Math.sin(deg2rad(A1+F))+
        127*Math.sin(deg2rad(L1-M1))-115*Math.sin(deg2rad(L1+M1));
    eclipticCoord = new Object();
    eclipticCoord.lambda = deg2rad(L1 + sigma.l/1000000);
    eclipticCoord.beta  = deg2rad(sigma.b/1000000);
    eclipticCoord.delta = 385000.56+sigma.r/1000;
    parAngle = 6378.14/eclipticCoord.delta;
    eq = ecliptic2equatorial(eclipticCoord, e);
    var HA = theta-eq.ra;
    var glat = lat - deg2rad(0.1924*Math.sin(2*lat));
    var rho = 0.99833 + 0.00167*Math.cos(2*lat);
    var g = Math.atan2(Math.tan(glat), Math.cos(HA));
    eq.ra -= parAngle*Math.cos(glat)*Math.sin(HA)/Math.cos(eq.de);
    eq.de -= parAngle*Math.sin(glat)*Math.sin(g-eq.de)/Math.sin(g);
    drawMoon();
    if(logPos) console.log("Moon   "+decHours(eq.ra)+"   "+decDeg(eq.de));
    //logPos = false;
}

function computeMoonPosition(D, M, M1, F, E){
  var sigma = new Object();
  sigma.l = computeELPSeriesSine(0, 60, D, M, M1, F, E);
  sigma.r = computeELPSeriesCosine(60, 120, D, M, M1, F, E);
  sigma.b = computeELPSeriesCosine(120, 180, D, M, M1, F, E);
  return sigma;
}

function computeELPSeriesCosine(start, end, D, M, M1, F, E){
  var sum = 0;
  for(i = start; i < end; i++){
    var dMul = elpData[5 * i];
    var mMul = elpData[5 * i + 1];
    var m1Mul = elpData[5 * i + 2];
    var fMul = elpData[5 * i + 3];
    var E2 = E * E;
    var coef = elpData[5 * i + 4];
    var term = coef * Math.cos(dMul * D + mMul * M + m1Mul * M1 + fMul * F);
    if(mMul == 1 || mMul == -1){
        term *= E;
    }
    else if(mMul == 2 || mMul == -2){
        term *= E2;
    }
    sum += term;
  }
  return sum;
}

function computeELPSeriesSine(start, end, D, M, M1, F, E){
  var sum = 0;
  for(i = start; i < end; i++){
    var dMul = elpData[5 * i];
    var mMul = elpData[5 * i + 1];
    var m1Mul = elpData[5 * i + 2];
    var fMul = elpData[5 * i + 3];
    var E2 = E * E;
    var coef = elpData[5 * i + 4];
    var term = coef * Math.sin(dMul * D + mMul * M + m1Mul * M1 + fMul * F);
    if(mMul == 1 || mMul == -1){
        term *= E;
    }
    else if(mMul == 2 || mMul == -2){
        term *= E2;
    }
    sum += term;
  }
  return sum;
}

function ecliptic2equatorial(ecl, eps) {
    eq = new Object();
    eq.ra = Math.atan2(Math.sin(ecl.lambda)*Math.cos(eps)-Math.tan(ecl.beta)*Math.sin(eps), Math.cos(ecl.lambda));
    eq.de = Math.asin(Math.sin(ecl.beta)*Math.cos(eps)+Math.cos(ecl.beta)*Math.sin(eps)*Math.sin(ecl.lambda));
    return eq;
}

function drawMoon() {
    ctx.fillStyle="gray";
    var moon = projectStereo(eq.de, eq.ra, false);
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, 15, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.font = "700 12px Arial";
    ctx.fillText("Moon", moon.x+15, moon.y+15);
}

function normalisedeg(angle){
    angle = angle - 360*Math.floor(angle/360);
    return angle;
}

//rotation of the coordinate system around the x axis
function rotateCoordinateSystem(oldCoord, angle){
    newCoord = new Object();
    newCoord.x = oldCoord.x;
    newCoord.y = oldCoord.y*Math.cos(angle) - oldCoord.z*Math.sin(angle);
    newCoord.z = oldCoord.y*Math.sin(angle) + oldCoord.z*Math.cos(angle);
    return newCoord;
}

function deg2rad(angle){
    return angle*Math.PI/180;
}

function rad2deg(angle){
    return angle*180/Math.PI;
}

/*function normalise(deg){
    while(deg<0 || deg>2*Math.PI){
        if (deg<0) deg+=2*Math.PI;
        else deg-=2*Math.PI;
    }
    return deg;
}*/

function Rect2Spheric(eq){
    eqSpheric = new Object();
    eqSpheric.ra = Math.atan2(eq.y, eq.x);
    eqSpheric.de = Math.atan2(eq.z, Math.sqrt(eq.x*eq.x+eq.y*eq.y));
    return eqSpheric;
}

function drawPlanets(){
  var time = (JD-2451545)/365250;
  var inclination = deg2rad(23.4392916666666667-0.0130041666666667*time-0.0000001666666667*Math.pow(time, 2)+0.0000005027777778*Math.pow(time, 3));
  var earthCoord = computePlanetCoordinates(vsopData[2], time);
  var sunCoord = new Object();
  sunCoord.x = -earthCoord.x;
  sunCoord.y = -earthCoord.y;
  sunCoord.z = -earthCoord.z;
  drawSun(sunCoord, time, inclination);

  ctx.beginPath();

  for(var i = 0; i < vsopData.length; i++){
    if(i != 2){
      var helioCoord = computePlanetCoordinates(vsopData[i], time);
      drawPlanet(helioCoord, sunCoord, inclination, planetNames[i], planetMagnitudes[i]);
    }
  }

  ctx.fillStyle='#FFFFFF';
  ctx.closePath();
  ctx.fill();
}

function computePlanetCoordinates(vsopData, time){
  var helioCoord = new Object();
  helioCoord.x = computeVSOP(vsopData.x, time);
  helioCoord.y = computeVSOP(vsopData.y, time);
  helioCoord.z = computeVSOP(vsopData.z, time);
  return helioCoord;

}

function computeVSOP(seriesArray, time){
  var result = 0;
  var i = 0;
  for(series of seriesArray){
    result += computeVSOPPolynom(series, time) * Math.pow(time, i);
    i++;
  }
  return result;
}

function computeVSOPPolynom(terms, time){
  var result = 0;
  for(variables of terms){
    if(Math.abs(variables[0]) < VSOP_TERM_LIMIT)
      break;

    result += variables[0] * Math.cos(variables[1] + variables[2] * time);
  }

  return result;
}



function drawSun(sunCoord, time, incl){
    time = Date.now();
    var eqRect = rotateCoordinateSystem(sunCoord, incl);
    var eqCoord = Rect2Spheric(eqRect);
    var sun = projectStereo(eqCoord.de, eqCoord.ra, false);
    ctx.drawImage(document.getElementById("rose"), sun.x-20, sun.y-20, 40 ,40);
    if(logPos) console.log("Sun   "+decHours(eqCoord.ra)+"   "+decDeg(eqCoord.de));
}

function drawPlanet(coord, sunCoord, epsilon, n, mag){
    coord.x += sunCoord.x;
    coord.y += sunCoord.y;
    coord.z += sunCoord.z;

    var planetEqRect = rotateCoordinateSystem(coord, epsilon);
    var eqCoord = Rect2Spheric(planetEqRect);
    var planet = projectStereo(eqCoord.de, eqCoord.ra, false);
    size = 4*Math.pow(1.2, -mag);
    ctx.moveTo(planet.x, planet.y);
    ctx.arc(planet.x, planet.y, size, 0, 2*Math.PI);
    ctx.font = "200 11px Arial";
    if(isPrintFr) ctx.fillStyle = "black";
    else ctx.fillStyle='#FF8400';
    ctx.fillText(n, planet.x+size+1.5, planet.y+size+1.5);
    if(logPos) console.log(n+"   "+decHours(eqCoord.ra)+"   "+decDeg(eqCoord.de));
}

function calcCoord(c, tau){
    var coord = 0;
    for(var i =0; i< c.length; i++){
        coord+=c[i]*Math.pow(tau, i);
    }
    return coord;
}

function Spheric2Rect(spheric, d){
    rect = new Object();
    rect.x = d*Math.cos(spheric.lon)*Math.cos(spheric.lat);
    rect.y = d*Math.sin(spheric.lon)*Math.cos(spheric.lat);
    rect.z = d*Math.sin(spheric.lat);
    return rect;
}

function getBrowserWidth(){
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

function getBrowserHeight(){
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

function decHours(angle) {
    var hd = rad2deg(normalise(angle))/15;
    var h = hd | 0;
    var m = (Math.abs(hd-h)*60) | 0;
    var s = (((Math.abs(hd-h)*3600-m*60)*1000) | 0) /1000;
    var str = h+"h "+m+"m "+s+"s";
    return str;
}

function decDeg(angle) {
    var hd = rad2deg(angle);
    var h = parseInt(hd);
    var m = parseInt(Math.abs(hd-h)*60);
    var s = parseInt((Math.abs(hd-h)*3600-m*60)*1000) /1000;
    if(angle<0 && h>=0) var str = "-"+h+"d "+m+"m "+s+"s";
        else var str = h+"d "+m+"m "+s+"s";
    return str;

}
