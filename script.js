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

//Steely Dan LastFM implementation

const apiKey = '8ea5a5da7317567eb1927bfa0b324ed5';
const username = 'bradycn';
const period = '1month';

const listenCountElem = document.getElementById('listen-count');

setInterval(() => {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=200&period=${period}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const trackCount = data.recenttracks['@attr'].total;
      listenCountElem.textContent = trackCount;
    })
    .catch(error => console.error(error));
}, 60000);
