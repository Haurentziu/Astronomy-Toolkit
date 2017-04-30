<!DOCTYPE html>
<html>
  <head>
    <title>Skychart Information</title>
    <link rel = "stylesheet" type = "text/css" href = "../basic_html/basic_style.css">
    <script type="text/javascript" src="../lib/analytics.js"></script>
    <script type="text/javascript" src="../lib/jquery-2.1.4.js"></script>
    <script type="text/x-mathjax-config">
    MathJax.Hub.Config({
      tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
    });
    </script>
    <script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML"></script>

  </head>
  <body>
    <div id = "main_container">
      <?php include("../basic_html/topbar.html") ?>

      <div id = "title">
        <div id = "banner" style = "background-image: url('skychart1.png');">

        </div>
        <div id = "gradient">

        </div>
        <h1>Skychart</h1>
        <h2>How I Programmed the Skychart</h2>
      </div>
      <div id = "content">
        <h4>Introduction</h4>
        <p>
            A sky map or a star chart shows the position of the stars, of the Messier objects and of the planets as they are seen by an observer from a location on Earth
            on a given time. The oldest skychart is 32,500 years old. It is sculpted in a Mammoth tusk and resembles the constellation Orion.
        </p>
        <br>
        <h4>Resources, algorithms and formulas used</h4>
        <p>
          The positions of the stars in equatorial coordinates were taken from the Yale Bright Star Catalog. The equatorial coordinates are converted in horizontal
          coordinates using the formulas:
            $$\tan{A} = \frac{\sin{H}}{\cos{H} \sin{\Phi} - \tan{\delta} \cos{\Phi}}$$
            $$\sin{a} = \sin{\delta} \sin{\Phi} + \cos{\delta} \cos{\Phi} \cos{H}$$
          where $A$ is the azimuth, $a$ the altitude, $H$ the hour angle, $\delta$ the declination of the star and $\Phi$ the observer's latitude.
        </p>
        <p>
          To project the stars on the computer screen I used the stereographic projection. It is conformal, which means that it preserves angles.
          The polar coordinates of a point from the celestial sphere projected on screen are:
            $$\left(R, \theta \right) = \left( \cot{\frac{a}{2}}, A \right)$$
        </p>
        <p>
          The position of the Moon is calculated using ELP2000
        </p>
	    <h4>Sources:</h4>
        <ul>
          <li>Wikipedia</li>
        </ul>

      </div>
      <?php include("../basic_html/bottom_bar.html"); ?>
    </div>
  </body>
</html>
