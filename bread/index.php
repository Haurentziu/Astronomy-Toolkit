<!DOCTYPE html>
<html>
  <head>
    <title>Baking Stuff</title>
    <link rel = "stylesheet" type = "text/css" href = "../basic_html/basic_style.css">
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
        <div id = "banner" style = "background-image: url('bread_anime.jpg');">

        </div>
        <div id = "gradient">

        </div>
        <h1>Baking Recipes</h1>
        <h2>Let's get this bread!</h2>
      </div>
      <div id = "content">
        <h5>Homemade bread</h5>
        <p>Ingredients for a single loaf of bread:</p>
        <ul>
          <li>10 dl flour</li>
          <li>11 ml yeast</li>
          <li>4 dl water</li>
          <li>11 ml sugar</li>
          <li>11 ml salt</li>
        </ul>
        <p>Bake 45-50 minutes at 200 &deg;C with conventional heating</p>
        <img  src = "bread.jpg" align="middle" style="width:100% !important"/>
        <br><br>
        <h5>Scones</h5>
        <p>Ingredients:</p>
        <ul>
          <li>2.7 dl flour</li>
          <li>10 ml sugar</li>
          <li>75 ml milk</li>
          <li>25 ml sunflower oil</li>
          <li>10 ml baking powder</li>
          <li>1 ml salt</li>
        </ul>



        <p>Bake 20-25 minutes at 200 &deg;C with conventional heating</p>
        <br>

        <img  src = "scones.jpg" align="middle" style="width:100% !important"/>
      </div>
      <?php include("../basic_html/bottom_bar.html"); ?>
    </div>
  </body>
</html>
