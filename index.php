<!DOCTYPE html>
<html>
  <head>
      <title>Valuare &amp; Talent</title>
      <link rel="stylesheet" type="text/css" href="stylesheet.css" />
      <meta name='og:image' content="https://astronomytoolkit.ddns.net/res/solar_system.jpg">
      <meta name='og:description' content="Astronomy Website by Haurentziu">

</head>

  <body itemscope itemtype="http://schema.org/Product">
    <img itemprop="image" src = "../res/solar_system.jpg" style = "display: none;"/>

    <div id = "container">
      <?php include('basic_html/topbar.html'); ?>


      <div id = "title">
        <div id = "banner"></div>
        <div id = "gradient"></div>
      </div>

      <div class = "cat" onmouseenter="var audio = new Audio('../res/long_cat/meow.mp3'); audio.play();">
        <img id="head"src="../res/long_cat/head.png" />
        <div id = "body">

        </div>
        <img id="legs" src="../res/long_cat/legs.png" />
      </div>

      <div id="pages_container">
	
	<a href = "../doomer" class="music">
          <div class = "page">
            <div class = "cropper" style="background: url(../res/doomer.jpg)">
              <div class = "ribbon">
                <h2>Music</h2>
              </div>
              <div class = "info">
                <div class = "text">
                  <h3>Doomer Playlist</h3>
                  <h2>Sad Songs to Cry Your Eyes Out When You Are Having a Mental Breakdown in Public</h2>
                </div>
              </div>
            </div>
          </div>
        </a>


        <a href = "../fractal_gallery" class="article">
          <div class = "page">
            <div class = "cropper" style="background: url(../res/fractal_gallery.jpg)">
              <div class = "ribbon">
                <h2>Article</h2>
              </div>
              <div class = "info">
                <div class = "text">
                  <h3>Fractal Gallery</h3>
                  <h2>Beautiful fractal images created using the fractal generator tool, available on this website</h2>
                </div>
              </div>
            </div>
          </div>
        </a>


        <a href = "../fractal" target="_blank" class="interactive">
          <div class = "page">
            <div class = "cropper" style="background: url(../res/fractal_gen.jpg)">
              <div class = "ribbon">
                <h2>Interactive</h2>
              </div>

              <div class = "info">
                <div class = "text">
                  <h3>Fractal Generator</h3>
                  <h2>Tool for generating Mandelbrot and Julia sets with different coloring schemes programmed in JavaScript and WebGL</h2>
                </div>
              </div>
            </div>
          </div>
        </a>

        <a href = "../skychart" target="_blank" class="interactive">
          <div class = "page">
            <div class = "cropper" style="background: url(../res/starmap.jpg)">
              <div class = "ribbon">
                <h2>Interactive</h2>
              </div>

              <div class = "info">
                <div class = "text">
                  <h3>Sky Chart</h3>
                  <h2>Tool for generating maps of the sky for any time and for every location on Earth</h2>
                </div>
              </div>
            </div>

            </div>
        </a>

  			<a href = "../solar_system" target="_blank" class="interactive">
  				<div class = "page">
            <div class = "cropper" style="background: url(../res/solar_system.jpg)">
              <div class = "ribbon">
                <h2>Interactive</h2>
              </div>
              <div class = "info">
                <div class = "text">
                  <h3>Solar System</h3>
                  <h2>WebGL solar system with all the small bodies (comets and asteroids) from JPL Small-Body Database</h2>
                </div>
              </div>
            </div>
  				</div>
        </a>

        <a href = "../sundial" class="interactive">
          <div class = "page">
            <div class = "cropper" style="background: url(../res/sundial.jpg)">
              <div class = "ribbon">
                <h2>Interactive</h2>
              </div>
              <div class = "info">
                <div class = "text">
                  <h3>Sundial Generator</h3>
                  <h2>A tool with instructions for creating a horizontal sundial programmed in Python</h2>
                </div>
              </div>
            </div>
          </div>
        </a>

        <a href = "../skychart_info" class="article">
          <div class = "page">
            <div class = "cropper" style="background: url(../res/coding.jpg)">
              <div class = "ribbon">
                <h2>Article</h2>
              </div>
              <div class = "info">
                <div class = "text">
                  <h3>Coding the Skymap</h3>
                  <h2>A quick overview of the formulas, algorthims and databases used for generating the sky charts</h2>
                </div>
              </div>
            </div>
          </div>
        </a>

        <a href = "../nbody" target="_blank" class="interactive">
          <div class = "page">
            <div class = "cropper" style="background: url(../res/nbody.jpg)">
              <div class = "ribbon">
                <h2>Interactive</h2>
              </div>
              <div class = "info">
                <div class = "text">
                  <h3>N-Body Simulator</h3>
                  <h2>2D WebGL N-Body gravitational simulation, with Eulerian integration </h2>
                </div>
              </div>
            </div>
          </div>
        </a>

        <a href = "../downloads/JavaFractal1.1.jar" target="_blank" class="download">
          <div class = "page">
            <div class = "cropper" style="background: url(../res/fractal.jpg)">
              <div class = "ribbon">
                <h2>Download</h2>
              </div>
              <div class = "info">
                <div class = "text">
                  <h3>Java Fractal</h3>
                  <h2>An old tool for generating Mandelbrot and Julia sets with different coloring schemes, programmed in Java</h2>
                </div>
              </div>
            </div>
          </div>
        </a>

        <a href = "../downloads/FunctionPlotter.jar" target="_blank" class="download">
          <div class = "page">
            <div class = "cropper" style="background: url(../res/function.png)">
              <div class = "ribbon">
                <h2>Download</h2>
              </div>
              <div class = "info">
                <div class = "text">
                  <h3>Function Plotter</h3>
                  <h2>An old tool for plotting functions (explicit and parametric), programmed in Java</h2>
                </div>
              </div>
            </div>

          </div>
        </a>


  	</div>


 </div>

 <?php include('basic_html/bottom_bar.html'); ?>

  </body>
</html>
