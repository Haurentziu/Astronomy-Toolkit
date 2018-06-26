<!DOCTYPE html>
<html>
  <head>
      <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "ca-pub-1754254364823400",
          enable_page_level_ads: true
        });
      </script>
      <title>Astronomy Toolkit</title>
      <link rel="stylesheet" type="text/css" href="stylesheet.css" />
      <meta name='og:image' content="https://astronomytoolkit.ddns.net/res/solar_system.jpg">
      <meta name='og:description' content="Astronomy Website by Haurentziu">

      <script type="text/javascript" src="../lib/analytics.js"></script>
  </head>

  <body itemscope itemtype="http://schema.org/Product">
    <img itemprop="image" src = "../res/solar_system.jpg" style = "display: none;"/>

    <div id = "container">
      <?php include('../basic_html/topbar.html'); ?>

      <div id = "title">
        <div id = "banner"></div>
        <div id = "gradient"></div>
      </div>

      <div id="pages_container">

        <a href = "../skychart">
          <div class = "page" style = "background: url(../res/starmap.jpg)">
            <h3>Sky Chart</h3>
          </div>
        </a>

  			<a href = "../solar_system">
  				<div class = "page" style = "background: url(../res/solar_system.jpg)">
  					<h3>Solar System</h3>
  				</div>
        </a>

        <a href = "../nbody">
          <div class = "page" style = "background: url(../res/nbody.png)">
            <h3>N-Body Simulator</h3>
          </div>
        </a>

        <a href = "../sundial">
          <div class = "page" style = "background: url(../res/sundial.jpg)">
            <h3>Sundial Generator</h3>
          </div>
        </a>

        <div class = "page" style = "background: url(https://pulsations.files.wordpress.com/2010/05/randomdog.jpg)">
          <h3>Ephemerides</h3>
        </div>


        <div class = "page" style = "background: url(https://s-media-cache-ak0.pinimg.com/236x/d9/5b/a2/d95ba22cef0cb9af20a99d1a4210ddf9.jpg)">
          <h3>Eclipses</h3>
        </div>

        <div class = "page" style = "background: url(../res/cane2.jpg)">
          <h3>Astronomical Clock</h3>
        </div>

  	</div>

    <?php include('../basic_html/bottom_bar.html'); ?>
 </div>


  </body>
</html>
