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
        <div id = "banner" style = "background-image: url('skychart.jpg');">

        </div>
        <div id = "gradient">

        </div>
        <h1>Skychart</h1>
        <h2>How I Programmed the Skychart</h2>
      </div>
      <div id = "content">
        <p>
            A sky map or a star chart shows the position of the stars, of the Messier objects and of the planets as they are seen by an observer from a location on Earth
            on a given time. You can use my sky map generator <a href = "../skychart">here</a>
        </p>
        <br>
        <h4>Algorithms and formulas used</h4>
        <p>
          The positions of the stars in equatorial coordinates were taken from the <a href = "http://cdsarc.u-strasbg.fr/viz-bin/Cat?V/50">
          Yale Bright Star Catalog.</a> The equatorial coordinates are converted in horizontal coordinates using the formulas:
            $$\tan{A} = \frac{\sin{H}}{\cos{H} \sin{\Phi} - \tan{\delta} \cos{\Phi}}$$
            $$\sin{a} = \sin{\delta} \sin{\Phi} + \cos{\delta} \cos{\Phi} \cos{H}$$
          where $A$ is the azimuth, $a$ the altitude, $H$ the hour angle, $\delta$ the declination and $\Phi$ the observer's latitude.
        </p>
        <p>
          To project the stars on the computer screen I used the stereographic projection.
          The polar coordinates of a point from the celestial sphere projected on screen are:
            $$\left(R, \theta \right) = \left( \cot{\frac{a}{2}}, A \right)$$
        </p>
        <p>
          The position of the Moon is calculated using a truncated ELP2000 algorithm, presented in Jean Meeus' Astronomical Algorithms.
        </p>
        <p>The heliocentric rectangular coordinates of the planets are computed using
          <a href = "http://cdsarc.u-strasbg.fr/viz-bin/Cat?cat=VI%2f81&target=brief&msg=redirected%20by%20VizieR">
            VSOP87</a>. For example, for the $X$ coordinate we use:
            $$X_{k} = \sum A \cos{\left( B + C t \right)}$$
            $$X = \sum X_{k}  t^{k}$$
            where t is the number of millenia since J2000 and A, B, C are the coefficient from the VSOP87 table.
            Now we need to translate the heliocentric coordinates($X$, $Y$, $Z$) so they are centered on the Earth.
            $$\begin{cases}
            X_{g} = X - X_{\oplus} \\
            Y_{g} = Y - Y_{\oplus} \\
            Z_{g} = Z - Z_{\oplus} \end{cases}$$
            $X_{g}$, $Y_{g}$, $Z_{g}$ are the geocentric coordinates of the planet and $X_{\oplus}$, $Y_{\oplus}$, $Z_{\oplus}$
            are the heliocentric coordinates of the Earth.
            To rotate the coordinates so that the $XY$ plane of the coordinate system is in the plane of the celestial equator, and not in the plane
            of the ecliptic we use the forumulas:
            $$\begin{cases}
            X_{eq} = X_{g} \\
            Y_{eq} = Y_{g} \cos{\epsilon} - Z_{g} \sin{\epsilon} \\
            Z_{eq} = Y_{g} \sin{\epsilon} + Z_{g} \cos{\epsilon} \end{cases}$$
            $\epsilon$ is the obliquity of the ecliptic which is calculated using the following polynomial:
              $$\epsilon = 23^\circ26'21.45'' - 46.815'' T - 0.0006'' T^{2} + 0.00181'' T^{3}$$
            To convert in equatorial spherical coordinates we use:
            $$\begin{cases}
              \tan{\alpha} = \frac{X_{eq}}{Y_{eq}} \\
              \tan{\delta} = \frac{Z_{eq}}{\sqrt{X_{eq}^{2} + Y_{eq}^{2}}}
            \end{cases}$$
            The equatorial coordinates of the planets are converted into horizontal coordinates and projected using the same formulas that are
            used for the stars.
      </p>
      <br>
      <h4>Libraries and programming languages</h4>
      <p>The star map is programmed in JavaScript. I used <a href = "https://github.com/jquery/jquery">JQuery</a> to get the VSOP87 and ELP2000 data
         and positions of the stars and Messier objects from the server. To download the sky map I used <a href = "http://danml.com/download.html">download.js.</a>
       </p>
       <br>
      <h4>Acknowledgements and sources:</h4>
        <ul>
          <li>Wikipedia</li>
          <li>Jean Meeus - Astronomical Algorithms, Second Edition</li>
          <li><a href = "http://eaps.mit.edu/12.114/Map_projections_a_working_manual.pdf">Map Projections - A Working Manual</a></li>
        </ul>

      </div>
      <?php include("../basic_html/bottom_bar.html"); ?>
    </div>
  </body>
</html>
