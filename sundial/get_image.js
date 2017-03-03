window.onload = function(){
	addImage(46, 26, "UAIE");
}

function getImage(){
	removeImage();
	var latitude = parseFloat(document.getElementById("lat").value);
	var longitude = parseFloat(document.getElementById("long").value);
	var motto = document.getElementById('motto').value
	addImage(latitude, longitude, motto);
}

function addImage(latitude, longitude, motto){
	var imgElement = document.createElement("embed");
	imgElement.setAttribute("src", "../cgi-bin/sundial.py?lat=" + latitude + "&long=" + longitude + '&name=' + motto );
	imgElement.setAttribute("type", "image/svg+xml");
	imgElement.setAttribute("width", "1200px");
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
