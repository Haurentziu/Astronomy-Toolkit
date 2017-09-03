var show_menu = false;

function toogle_menu(){
  var menu = document.getElementById("menu");
  var button = document.getElementById("toogle_menu_button");
  show_menu = !show_menu;
  if(show_menu){
    menu.classList.add("horizTranslateMenu");
    button.classList.add("horizTranslateMenu");
  }
  else{
    menu.classList.remove("horizTranslateMenu");
    button.classList.remove("horizTranslateMenu");
  }
}

function select_tab(evt, tab_id){
  var tabcontent = document.getElementsByClassName("tab_content");

  for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  var tablinks = document.getElementsByClassName("tab_button");
  for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tab_id).style.display = "block";
  evt.currentTarget.className += " active";

}
