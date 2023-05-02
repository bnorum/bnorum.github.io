function onModalClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
}

function fadeInBody() {
  var opacity = 0;
  var timer = setInterval(function() {
    if (opacity >= 1) {
        clearInterval(timer);
      }
      document.body.style.opacity = opacity;
      opacity += 0.5;
    }, 50);
}
  
function projToggle(element) {
  var x = element;
  if (x.style.width === "22.5vw") {
    x.style.width = "44.25vw";
  } else {
    x.style.width = "22.5vw";
  }
}
window.onload = fadeInBody;

