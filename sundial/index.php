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
    <div id = "main_container">
      <?php include("../basic_html/topbar.html") ?>

      <div id = "title">
        <div id = "banner" style = "background-image: url('res/sundial.jpg');">

        </div>
        <div id = "gradient">

        </div>
        <h1>Horizontal Sundial Generator</h1>
        <h2>Create your own sundial in five minutes</h2>
      </div>
  		<script src = "get_image.js"></script>
      <script async defer
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAqMBMs0Tm9sEYxRm80faYpSEiJ44ouDks&callback=initMap"></script>

      <div id = "content">

    		<div id = "location_select" >
          <h5>Select Location</h5>
          <p>
            Use the automatic geolocator, search your location in the texfield below, or click on the map.
          </p>
          <div class = "form">
            <input type="button" value = "Auto Detect Location" onclick = "geolocate()"/><br>

      			<label for = "lat">Latitude:</label>
            <input type = "text" id = "lat" value = "51.48257" onblur = "positionInputListener()"> &deg;<br>

            <label for = "long">Longitude: </label>
      			<input type = "text" id = "long" value = "0" onblur = "positionInputListener()"> &deg;<br>

            <input type = "text" placeholder = "Search location..." id = "search_field">
            <input type = "button" value = "Search" id = "search_button" onclick="geocode()"/>
            <div id = "map"></div>

          </div>
        </div>

        <div id = "time_select">
          <h5>Time Options</h5>
          <p>
            The civil time is the time displayed on clocks and has a fixed offset from Coordinated Universal Time and is adjusted
            during some parts of the year by daylight savings time, while the apparent solar time depends only on the position of the sun
          </p>
          <p>
            The timezone in the input box is measured relative to the UTC time
          </p>
          <div class = "form">
            <input type="radio" id = "solar" name="time_type" value="solar"><label for="solar"> Apparent Solar Time</label><br>
            <input type="radio" id = "civil" name="time_type" value="civil" checked><label for="civil"> Civil Time</label><br>
            Time Zone: <input type="number" id = "time_zone_input" name="time_zone" min="-12" max="12" value = "0"><br>
          </div>
        </div>

        <h5>How to use</h5>
        <ol>
          <li>Download the PDF file or you can use the SVG if you want to modify the design</li>
          <li>Cut the dial</li>
          <li>Cut the gnomon(the triangle which casts the shadow on the dial) and glue it to the dial</li>
          <li>Align the arrows printed on the dial and on the gnomon with the true north</li>
          <li>Read the time by looking at the marking at the edge of the shadow</li>
          <li>In case of civil time, substract the value of the equation of time printed on the dial. In case of apparent
             solar time substract the equation of time to get the mean solar time</li>
        </ol>

        <div id = "submit">
          <input type = "button" value = "Get SVG File" onclick = "getImage()">
          <input type = "button" value = "Get PDF File" onclick = "getPDF()">
        </div>

    		<div id = "image_div"></div>
    </div>
    <?php include("../basic_html/bottom_bar.html"); ?>
  </div>
  </body>
</html>
