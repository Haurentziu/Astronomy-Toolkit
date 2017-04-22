var latitudeInput;
var longitudeInput;
var zoneInput;
var solarInput;
var civilInput;

var map;
var marker;

var defaultLat = 51.48257;
var defaultLong = 0;
var defaultZone = 0;

window.onload = function(){
	latitudeInput = document.getElementById("lat");
	longitudeInput = document.getElementById("long");
	zoneInput = document.getElementById("time_zone_input")
	civilInput = document.getElementById("civil");
	solarInput = document.getElementById("solar")
	document.getElementById("search_field").addEventListener("keypress", enterSearch);

	addImage("?lat=" + defaultLat + "&long=" + defaultLong + "&zone=" + defaultZone + "&time=civil");
	updateFields(defaultLat, defaultLong)
}

function getLinkEnding(){
	var latitude = parseFloat(latitudeInput.value);
	var longitude = parseFloat(longitudeInput.value);
	var zone = parseFloat(zoneInput.value);
	var time = "";
	if(civilInput.checked){
		time = "civil";
	}
	else if(solarInput.checked){
		time = "solar";
	}
	return "?lat=" + latitude + "&long=" + longitude + "&zone=" + zone + "&time=" + time;
}

function getImage(){
	removeImage();
	var linkEnd = getLinkEnding();
	addImage(linkEnd);
}

function getPDF(){
	removeImage();
	var linkEnd = getLinkEnding();
	var imgElement = document.createElement("iframe");
	imgElement.setAttribute("src", "../cgi-bin/sundialPDF.py"+linkEnd);
	imgElement.setAttribute("width", "820px");
	imgElement.setAttribute("height", "820px");
	imgElement.setAttribute("id", "sundial");
	document.getElementById("image_div").appendChild(imgElement);
}

function addImage(ending){
	var imgElement = document.createElement("img");
	imgElement.setAttribute("src", "../cgi-bin/sundial.py" + ending);
	imgElement.setAttribute("width", "820px");
	imgElement.setAttribute("height", "820px");
	imgElement.setAttribute("id", "sundial");
	document.getElementById("image_div").appendChild(imgElement)

}

function removeImage(){
	sundialImg = document.getElementById("sundial");
	if(sundialImg != null){
		sundialImg.parentNode.removeChild(sundialImg);
	}
}

function geocode(){
	var querry = document.getElementById("search_field").value;
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': querry}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			updateFields(results[0].geometry.location.lat(), results[0].geometry.location.lng());
			updateMarker(results[0].geometry.location.lat(), results[0].geometry.location.lng());
			updateTimeZone(results[0].geometry.location.lat(), results[0].geometry.location.lng());
		}
	});
}

function geolocate(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(updatePosition);
	}

}

function updatePosition(position){
	updateFields(position.coords.latitude, position.coords.longitude);
	updateMarker(position.coords.latitude, position.coords.longitude);
	updateTimeZone(position.coords.latitude, position.coords.longitude);
}

function updateFields(lat, lng){
	latitudeInput.value = lat;
	longitudeInput.value = lng;
}

function positionInputListener(){
	updateMarker(latitudeInput.value, longitudeInput.value);
	updateTimeZone(latitudeInput.value, longitudeInput.value);
}

function updateMarker(lat, lng){
	var location = new google.maps.LatLng(lat, lng);
	marker.setPosition(location);
	map.setCenter(location);
}

function initMap(){
	var defaultLocation = {lat: defaultLat, lng: defaultLong};
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 6,
		center: defaultLocation
	});

	marker = new google.maps.Marker({
		position: defaultLocation,
		map: map,
	});

	google.maps.event.addListener(map, "click", function (event) {
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();
    marker.setPosition(event.latLng);
		updateFields(latitude, longitude);
		updateTimeZone(latitude, longitude);
	});
}

function enterSearch(event){
	var event = window.event ? window.event : e;
	if(event.keyCode == 13){
		document.getElementById("search_button").click();
	}
}

//key
function updateTimeZone(latitude, longitude){
	url = "https://maps.googleapis.com/maps/api/timezone/json?location="+latitude + "," + longitude + "&timestamp="+Math.round((new Date().getTime())/1000)+"&sensor=false",
	$.ajax({
   url: url,
	}).done(function(response){
  	if(response.timeZoneId != null){
			zoneInput.value = parseInt((response.rawOffset) / 3600);
			console.log(response);
   	}
	});
}
