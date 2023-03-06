function expandImage(img) {
    var overlay = document.createElement("div");
    overlay.className = "fullscreen";
    overlay.onclick = function() {
      document.body.removeChild(overlay);
    };
    var fullImg = document.createElement("img");
    fullImg.src = img.src;
    overlay.appendChild(fullImg);
    document.body.appendChild(overlay);
    
    var altText = document.createElement("p");
    altText.textContent = img.alt;
    overlay.appendChild(altText);

    document.body.appendChild(overlay);
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
  
window.onload = fadeInBody;

