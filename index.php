<!DOCTYPE html>
<html>
  <head>
      <title>Valuare &amp; Talent</title>
      <link rel="stylesheet" type="text/css" href="stylesheet.css" />
      <meta name='og:image' content="https://astronomytoolkit.ddns.net/res/solar_system.jpg">
      <meta name='og:description' content="Astronomy Website by Haurentziu">

      <script type="text/javascript" src="../lib/analytics.js"></script>
  </head>

  <body itemscope itemtype="http://schema.org/Product">
    <img itemprop="image" src = "../res/solar_system.jpg" style = "display: none;"/>

    <div id = "container">
      <?php include('basic_html/topbar.html'); ?>

      <div id = "title">
        <div id = "banner"></div>
        <div id = "gradient"></div>
      </div>

      <div id="pages_container">

        <a href = "../fractal_gallery">
          <div class = "page" style = "background: url(../res/fractal_gallery.jpg)">
            <h3>Fractal Gallery</h3>
          </div>
        </a>


        <a href = "../fractal" target="_blank">
          <div class = "page" style = "background: url(../res/fractal_gen.jpg)">
            <h3>Fractal Generator</h3>
          </div>
        </a>

        <a href = "../skychart" target="_blank">
          <div class = "page" style = "background: url(../res/starmap.jpg)">
            <h3>Sky Chart</h3>
          </div>
        </a>

  			<a href = "../solar_system" target="_blank">
  				<div class = "page" style = "background: url(../res/solar_system.jpg)">
  					<h3>Solar System</h3>
  				</div>
        </a>

        <a href = "../sundial">
          <div class = "page" style = "background: url(../res/sundial.jpg)">
            <h3>Sundial Generator</h3>
          </div>
        </a>

        <a href = "../skychart_info">
          <div class = "page" style = "background: url(../res/coding.jpg)">
            <h3>Coding the Skymap</h3>
          </div>
        </a>

        <a href = "../nbody" target="_blank">
          <div class = "page" style = "background: url(../res/nbody.png)">
            <h3>N-Body Simulator</h3>
          </div>
        </a>

        <a href = "../downloads/JavaFractal1.1.jar" target="_blank">
          <div class = "page" style = "background: url(../res/fractal.jpg)">
            <h3>Java Fractal</h3>
          </div>
        </a>

        <a href = "../downloads/FunctionPlotter.jar" target="_blank">
          <div class = "page" style = "background: url(../res/function.png)">
            <h3>Function Plotter</h3>
          </div>
        </a>
  	</div>

    <?php include('basic_html/bottom_bar.html'); ?>
 </div>


  </body>
</html>
