var show_menu = false;
var juliaDefaults = [
  [0.285, 0.01],
  [-0.4, 0.6],
  [0.285, 0],
  [0.45, 0.1428],
  [-0.70176, -0.3842],
  [-0.835, -0.2321],
  [-0.8, 0.156],
  [-0.7269, 0.1889],
  [0, -0.8],
  [-0.6180339, 0],
];



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

function addJuliaPresets(){
  var defaultsDOM = document.getElementById('julia_defaults');
  var i = 0;
  for(preset of juliaDefaults){
    var option = document.createElement("option");
    if(preset[0] != 0)
      option.text = preset[0];
    if(preset[1] > 0){
      option.text += "+" + preset[1] + "i";
    }
    else if (preset[1] != 0){
      option.text += "-" + Math.abs(preset[1]) + "i";
    }
    option.value = i;
    defaultsDOM.appendChild(option);
    i++;
  }
}

function setJuliaPreset(preset){
  var id = parseInt(preset);
  setJuliaReal(juliaDefaults[id][0]);
  setJuliaImag(juliaDefaults[id][1]);

  updateFieldInput("julia_real_input", juliaDefaults[id][0]);
  updateFieldInput("julia_imag_input", juliaDefaults[id][1]);
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
