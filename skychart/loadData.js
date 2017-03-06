stars = [];
bounds = [];
milkyway = [];
constellation = [];
var vsopFiles = [
  "VSOP87C.mer", "VSOP87C.ven", "VSOP87C.ear", "VSOP87C.mar", "VSOP87C.jup", "VSOP87C.sat", "VSOP87C.ura", "VSOP87C.nep",
]
var planetNames = [
  "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"
]

var planetMagnitudes = [
  -2.45, -4.2, undefined, -2.91, -1.61, -0.49, 5.32, 7.78
];
var vsopData = [];
var vsopLoadedFiles = 0;
var loadedVSOP = false;

var messierObjects = [];
var elpData = [];

var constellationLines = [];

$.get("./res/stars.txt", function(data) {
    var lines = data.split('\n');
	id=0;
	for (var i = 0; i < lines.length; i++) {
        data = lines[i].split(",");
		if (data[2] < 5.5){
			stars[id] = new Object();
			stars[id].ra=parseFloat(data[0]);
			stars[id].dec=parseFloat(data[1]);
			stars[id].mag=parseFloat(data[2]);
			stars[id].name=data[3]+"";
			id++;
		}
	}
});

$.get("./res/messier.csv", function(data) {
  var lines = data.split('\n');
	for (var i = 0; i < lines.length; i++) {
      data = lines[i].split(",");
			var messier = new Object();
      messier.ra = deg2rad(parseFloat(data[2]) * 15);
      messier.dec = deg2rad(parseFloat(data[3]));
      messier.name = data[0];
      messier.type = data[1];
      messier.mag = data[4];
      messierObjects.push(messier);
		}
});

$.get("./res/constNames.txt", function(data) {
    var lines = data.split('\n');
	for (var i = 0; i < lines.length; i++) {
    data = lines[i].split(",");
    constellation[i] = new Object();
    constellation[i].name = data[0];
    constellation[i].code = data[1];
    constellation[i].ra = parseFloat(data[2]);
    constellation[i].dec = parseFloat(data[3]);
	}
});

$.get("./res/conlines.txt", function(data) {
    var lines = data.split('\n');
  	for (var i = 0; i < lines.length; i++) {
      data = lines[i].split(",");
      line = new Object();
      line.startRA = data[0];
      line.startDEC = data[1];
      line.endRA = data[2];
      line.endDEC = data[3];
      constellationLines.push(line);

  	}
});

function isEmpty(str) {
    return (!str || 0 === str.length);
}

$.get("./res/milkyway.txt", function(data) {
    var lines = data.split('\n');
	for (var i = 0; i < lines.length; i++) {
    data = lines[i].split(",");
		milkyway[i] = new Object();
		milkyway[i].mode = data[0];
    milkyway[i].ra = parseFloat(data[1]);
		milkyway[i].de = parseFloat(data[2]);
	}
});

$.get("../res/elp2000_truncated.csv", function(data) {
  var lines = data.split('\n');

	for (line of lines) {
    data = line.split(",");
    if(data[0].charAt(0) != 'V'){
      for(i of data)
        elpData.push(i);
    }

	}
});



function getSolarSystemData(){
  for(file of vsopFiles){
    vsopData.push(getPlanetVSOP("../res/vsop87/" + file));
  }
}

function checkLoadStatus(){
  loadedVSOP = vsopLoadedFiles == vsopFiles.length
}

function getPlanetVSOP(file){
    var vsop = new Object();
    vsop.x = [];
    vsop.y = [];
    vsop.z = [];
    $.get(file, function(data) {
      var isFirst = true;
      var lines = data.split('\n');
      var variable = "1";
      var series = [];

    	for (line of lines) {
        if(line.charAt(1) == "V"){
          if(!isFirst){
            if(variable == "1")
              vsop.x.push(series)
            else if(variable == "2")
              vsop.y.push(series)
            else if(variable == "3")
              vsop.z.push(series)
          }
          else isFirst = false;
          series = [];

          variable = line.substring(41, 42);
        }

        else {
          variables = [];
          var a = parseFloat(line.substring(83, 97).replace("\\s",""));
          var b = parseFloat(line.substring(97, 111).replace("\\s",""));
          var c = parseFloat(line.substring(111, 131).replace("\\s",""));
          variables.push(a, b, c)
          series.push(variables);

        }
    	}
      vsopLoadedFiles++;
      checkLoadStatus();

    });
    return vsop;
}

function deg2rad(angle){
    return angle*Math.PI/180;
}

function rad2deg(angle){
    return angle*180/Math.PI;
}
