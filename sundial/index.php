<!DOCTYPE html>
<html>
  <head>
    <title>Sundial Generator</title>
		<link rel = "stylesheet" type = "text/css" href = "stylesheet.css">
    <link rel = "stylesheet" type = "text/css" href = "../basic_html/basic_style.css">
    <script type="text/javascript" src="../lib/analytics.js"></script>
    <script type="text/javascript" src="../lib/jquery-2.1.4.js"></script>


  </head>

  <body>
    <?php include("../basic_html/topbar.html") ?>

    <div id = "title">
      <div id = "banner" style = "background-image: url('res/sundial.png');">

      </div>
      <div id = "gradient">

      </div>
      <h1>Sundial Generator</h1>
      <h2>Create your own sundial in five minutes</h2>
    </div>
		<script src = "get_image.js"></script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAqMBMs0Tm9sEYxRm80faYpSEiJ44ouDks&callback=initMap"></script>

    <div id = "content">

  		<div id = "location_select" >
        <h5>Select Location</h5>
        <div class = "form">
          <input type="button" value = "Auto Detect Location" onclick = "geolocate()"/><br>

    			<label for = "lat">Latitude:</label>
          <input type = "text" id = "lat" value = "51.48257"> &deg;<br>

          <label for = "long">Longitude: </label>
    			<input type = "text" id = "long" value = "0"> &deg;<br>

          <input type = "text" placeholder = "Search location..." id = "search_field">
          <input type = "button" value = "Search" id = "search_button" onclick="geocode()"/>
          <div id = "map"></div>

        </div>
      </div>

      <div id = "time_select">
        <h5>Select Location</h5>
        <div class = "form">
          <input type="radio" id = "solar" name="time_type" value="solar"><label for="solar"> Solar Time</label><br>
          <div class="check"><div class="inside"></div></div>
          <input type="radio" id = "civil" name="time_type" value="civil" checked><label for="civil"> Civil Time</label><br>
          <div class="check"><div class="inside"></div></div>

          Time Zone: <input type="number" id = "time_zone_input" name="time_zone" min="-12" max="12" value = "0"><br>
        </div>
      </div>

  		<div id = "style_select">
        <h5>Select Location</h5>
        <div class = "form">
  			     Text: <input type = "text" id = "motto"><br>
        </div>
  		</div>

      <div id = "submit">
        <input type = "button" value = "Get SVG File" onclick = "getImage()">
        <input type = "button" value = "Get PDF File" onclick = "getPDF()">
      </div>
  		<div id = "image_div"></div>

  </div>
  <?php include("../basic_html/bottom_bar.html"); ?>
  </body>
</html>
