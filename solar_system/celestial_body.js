function CelestialBody(name, semiMajorAxis, eccentricty, inclination, longitudeOfNode, argOfPericenter, meanAnomaly2000){
  this.name = name;
  this.semiMajorAxis = semiMajorAxis;
  this.eccentricty = eccentricty;
  this.inclination = inclination;
  this.longitudeOfNode = longitudeOfNode;
  this.argOfPericenter = argOfPericenter;
  this.meanAnomaly2000 = meanAnomaly2000;
  this.meanAngularMotion = 100 * 2.0 * Math.PI / Math.sqrt(semiMajorAxis * semiMajorAxis * semiMajorAxis); // rad/century
}

CelestialBody.prototype.getPositionAtEpoch = function(epoch){
  meanAnomalyNow = this.getMeanAnomalyNow(epoch);
  eccentricAnomaly = this.getEccentricAnomaly(meanAnomalyNow);
  return this.getCartesianCoordinates(eccentricAnomaly);
}

CelestialBody.prototype.getMeanAnomalyNow = function(epoch){
  meanAnomalyNow = this.meanAnomaly2000 + this.meanAngularMotion * epoch;
  return meanAnomalyNow = meanAnomalyNow - 2 * Math.PI * parseInt(meanAnomalyNow / (2 * Math.PI));
}

CelestialBody.prototype.getEccentricAnomaly = function(meanAnomaly){
  e1 = meanAnomaly + this.eccentricty * Math.sin(meanAnomaly) * (1.0 + this.eccentricty * Math.cos(meanAnomaly));
  e0 = meanAnomaly;
  iter = 0;
  while(Math.abs(e1 - e0) > 1e-3 && iter < 20){
    e0 = e1;
    e1 = e0 - (e0 - this.eccentricty * Math.sin(e0) - meanAnomaly) / (1 - this.eccentricty * Math.cos(e0));
    iter++;
  }
  return e1;

}

CelestialBody.prototype.getCartesianCoordinates = function(eccentricAnomaly){
  trueAnomaly = this.getTrueAnomaly(eccentricAnomaly);
  radius = this.semiMajorAxis * (1 - this.eccentricty*this.eccentricty) / (1 + this.eccentricty * Math.cos(trueAnomaly));
  x = radius * (Math.cos(this.longitudeOfNode) * Math.cos(this.argOfPericenter + trueAnomaly) - Math.sin(this.longitudeOfNode) * Math.sin(trueAnomaly + this.argOfPericenter) * Math.cos(this.inclination));
  y = radius * (Math.sin(this.longitudeOfNode) * Math.cos(this.argOfPericenter + trueAnomaly) + Math.cos(this.longitudeOfNode) * Math.sin(trueAnomaly + this.argOfPericenter) * Math.cos(this.inclination));
  z = radius * Math.sin(this.argOfPericenter + trueAnomaly) * Math.sin(this.inclination);
  return {x: x, y: y, z: z};
};

CelestialBody.prototype.getTrueAnomaly = function(eccentricAnomaly){
  return Math.atan2(Math.sqrt(1 - this.eccentricty * this.eccentricty) * Math.sin(eccentricAnomaly), Math.cos(eccentricAnomaly) - this.eccentricty);
};
