var show_menu = false;

function toogle_menu(){
  var menu = document.getElementById("menu");
  show_menu = !show_menu;
  if(show_menu)
    menu.classList.add("horizTranslateMenu");
  else
    menu.classList.remove("horizTranslateMenu");

}
