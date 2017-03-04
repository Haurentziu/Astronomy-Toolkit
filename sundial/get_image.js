var latitudeInput;
var longitudeInput;
var map;
var marker;

var defaultLat = 51.48257;
var defaultLong = 0;

window.onload = function(){
	latitudeInput = document.getElementById("lat");
	longitudeInput = document.getElementById("long")
	document.getElementById("search_field").addEventListener("keypress", enterSearch);

	addImage(defaultLat, defaultLong, "Greenwich");
	updateFields(defaultLat, defaultLong)
}

function getImage(){
	removeImage();
	var latitude = parseFloat(latitudeInput.value);
	var longitude = parseFloat(longitudeInput.value);
	var motto = document.getElementById('motto').value
	addImage(latitude, longitude, motto);
}

function addImage(latitude, longitude, motto){
	var imgElement = document.createElement("embed");
	imgElement.setAttribute("src", "../cgi-bin/sundial.py?lat=" + latitude + "&long=" + longitude + '&name=' + motto );
	imgElement.setAttribute("type", "image/svg+xml");
	imgElement.setAttribute("width", "800px");
	imgElement.setAttribute("height", "800px");
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
}

function updateFields(lat, lng){
	latitudeInput.value = lat;
	longitudeInput.value = lng;
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
	});
}

function enterSearch(event){
	var event = window.event ? window.event : e;
	if(event.keyCode == 13){
		document.getElementById("search_button").click();
	}
}
